import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { attachLspBridge, languageFromUrl } from "./bridge";

const fakeServer = fileURLToPath(
  new URL("../../test/fixtures/fake-language-server.mjs", import.meta.url),
);

let root: string | undefined;
let server: Server | undefined;

afterEach(async () => {
  await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
  server = undefined;
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

const listen = (httpServer: Server) =>
  new Promise<number>((resolve) => {
    httpServer.listen(0, "127.0.0.1", () => resolve((httpServer.address() as AddressInfo).port));
  });

const nextMessage = (ws: WebSocket) =>
  new Promise<unknown>((resolve) => {
    ws.addEventListener("message", (event) => resolve(JSON.parse(String(event.data))), {
      once: true,
    });
  });

const closed = (ws: WebSocket) =>
  new Promise<{ code: number; reason: string }>((resolve) => {
    ws.addEventListener("close", (event) => resolve({ code: event.code, reason: event.reason }), {
      once: true,
    });
  });

describe("言語サーバーの中継", () => {
  it("宣言された言語サーバーが起動し、WebSocket 越しに JSON-RPC が往復する", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-bridge-"));
    await writeFile(
      path.join(root, "sage.editor.js"),
      `export const languageServers = { fake: { command: ${JSON.stringify(process.execPath)}, args: [${JSON.stringify(fakeServer)}] } };\n`,
    );
    server = createServer();
    attachLspBridge(server, { root });
    const port = await listen(server);
    const ws = new WebSocket(`ws://127.0.0.1:${port}/_sage/lsp/fake`);
    await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

    // Act
    ws.send(
      JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { rootUri: null } }),
    );
    const reply = await nextMessage(ws);
    ws.send(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "echo", params: { hello: "world" } }));
    const echoed = await nextMessage(ws);
    ws.close();

    // Assert
    expect(reply).toEqual({
      jsonrpc: "2.0",
      id: 1,
      result: { capabilities: { hoverProvider: true } },
    });
    expect(echoed).toEqual({ jsonrpc: "2.0", id: 2, result: { hello: "world" } });
  });

  it("宣言されていない言語や存在しないコマンドは理由付きで切断される", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-bridge-"));
    await writeFile(
      path.join(root, "sage.editor.js"),
      'export const languageServers = { ghost: { command: "sage-no-such-language-server" } };\n',
    );
    server = createServer();
    attachLspBridge(server, { root });
    const port = await listen(server);

    // Act
    const unknown = await closed(new WebSocket(`ws://127.0.0.1:${port}/_sage/lsp/moonbit`));
    const missing = await closed(new WebSocket(`ws://127.0.0.1:${port}/_sage/lsp/ghost`));

    // Assert
    expect(unknown).toEqual({ code: 1008, reason: "no language server for moonbit" });
    expect(missing.code).toBe(1011);
    expect(missing.reason).toContain("sage-no-such-language-server");
  });

  it("中継のパス以外の WebSocket は対象外", () => {
    expect(languageFromUrl("/_sage/lsp/c")).toBe("c");
    expect(languageFromUrl("/_sage/lsp/objective-c")).toBe("objective-c");
    expect(languageFromUrl("/")).toBeNull();
    expect(languageFromUrl("/_sage/lsp/../x")).toBeNull();
  });
});
