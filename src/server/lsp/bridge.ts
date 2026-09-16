import { spawn } from "node:child_process";
import type { Server as HttpServer } from "node:http";

import { type Message, StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc/node";
import { type RawData, type WebSocket, WebSocketServer } from "ws";

import { loadLanguageServers } from "./language-servers";

/** WebSocket のパス。`/_sage/lsp/{Monaco の言語 ID}` */
export const LSP_PATH_PREFIX = "/_sage/lsp/";

/** パスから言語 ID を取り出す (中継の対象でなければ null) */
export function languageFromUrl(url: string | undefined): string | null {
  const { pathname } = new URL(url ?? "/", "http://localhost");
  if (!pathname.startsWith(LSP_PATH_PREFIX)) return null;
  const language = decodeURIComponent(pathname.slice(LSP_PATH_PREFIX.length));
  return /^[\w-]+$/.test(language) ? language : null;
}

const rawDataToString = (data: RawData) =>
  Array.isArray(data)
    ? Buffer.concat(data).toString("utf8")
    : Buffer.isBuffer(data)
      ? data.toString("utf8")
      : Buffer.from(data).toString("utf8");

/** WebSocket の close の理由は 123 バイトまで */
const closeReason = (text: string) => {
  let reason = text;
  while (Buffer.byteLength(reason) > 123) reason = reason.slice(0, -1);
  return reason;
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** 1 本の WebSocket 接続に対して言語サーバーを起動し、JSON-RPC を stdio と相互に流す */
async function bridgeLanguageServer(ws: WebSocket, language: string, root: string) {
  // 言語サーバーが立ち上がる前に届いたメッセージ (initialize など) は取りこぼさず溜めておく
  const queued: string[] = [];
  let forward: ((text: string) => void) | null = null;
  ws.on("message", (data) => {
    const text = rawDataToString(data);
    if (forward) forward(text);
    else queued.push(text);
  });

  let spec;
  try {
    spec = (await loadLanguageServers(root))[language];
  } catch (error) {
    ws.close(1011, closeReason(`sage.editor.js: ${errorMessage(error)}`));
    return;
  }
  if (!spec) {
    ws.close(1008, closeReason(`no language server for ${language}`));
    return;
  }

  const child = spawn(spec.command, spec.args, { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
  let lastStderr = "";
  child.stderr.on("data", (chunk: Buffer) => {
    lastStderr = `${lastStderr}${chunk.toString()}`.slice(-2000);
  });
  const reader = new StreamMessageReader(child.stdout);
  const writer = new StreamMessageWriter(child.stdin);
  reader.listen((message) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
  });
  forward = (text) => {
    void writer.write(JSON.parse(text) as Message);
  };
  for (const text of queued.splice(0)) forward(text);
  ws.on("close", () => {
    if (child.exitCode === null) child.kill();
  });
  child.on("error", (error) => {
    console.error(`[sage] ${spec.command}: ${error.message}`);
    ws.close(1011, closeReason(`${spec.command}: ${error.message}`));
  });
  child.on("exit", (code, signal) => {
    if (code !== 0 && code !== null)
      console.error(`[sage] ${spec.command} exited with ${code}\n${lastStderr}`);
    if (ws.readyState === ws.OPEN) {
      ws.close(1011, closeReason(`${spec.command} exited (${code ?? signal})`));
    }
  });
}

/**
 * `/_sage/lsp/{language}` への WebSocket 接続ごとに、`sage.editor.js` で宣言された
 * 言語サーバーをプロジェクトのルートで起動して中継する。
 * 起動するコマンドはプロジェクト側のファイルからだけ決まる (ブラウザからは指定できない)。
 */
export function attachLspBridge(server: HttpServer, options: { root: string }): void {
  const sockets = new WebSocketServer({ noServer: true });
  server.on("upgrade", (request, socket, head) => {
    const language = languageFromUrl(request.url);
    if (language === null) return;
    sockets.handleUpgrade(request, socket, head, (ws) => {
      void bridgeLanguageServer(ws, language, options.root);
    });
  });
}
