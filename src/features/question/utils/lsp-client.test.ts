import { describe, expect, it, vi } from "vitest";

import type { Monaco } from "#/components/ui";

import { LanguageClient } from "./lsp-client";

/** 送信内容を記録し、テストから受信イベントを起こせる偽の WebSocket */
class FakeSocket extends EventTarget {
  readyState: number = WebSocket.CONNECTING;
  readonly sent: Array<Record<string, unknown>> = [];
  send(data: string) {
    this.sent.push(JSON.parse(data) as Record<string, unknown>);
  }
  close() {
    this.readyState = WebSocket.CLOSED;
    this.dispatchEvent(new CloseEvent("close", { code: 1000 }));
  }
  open() {
    this.readyState = WebSocket.OPEN;
    this.dispatchEvent(new Event("open"));
  }
  receive(message: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(message) }));
  }
  /** 送られた要求 (method) に応答する */
  reply(method: string, result: unknown) {
    const request = this.sent.find((message) => message.method === method && "id" in message);
    if (!request) throw new Error(`no request: ${method}`);
    this.receive({ jsonrpc: "2.0", id: request.id, result });
  }
}

type CompletionProvider = {
  provideCompletionItems: (
    model: unknown,
    position: { lineNumber: number; column: number },
  ) => Promise<{ suggestions: Array<Record<string, unknown>> }>;
};

/** プロバイダの登録と診断の反映だけを持つ偽の Monaco */
function fakeMonaco() {
  const providers: Record<string, CompletionProvider> = {};
  const setModelMarkers = vi.fn<(model: unknown, owner: string, markers: unknown[]) => void>();
  const models: Array<{ uri: { path: string; toString: () => string } }> = [];
  const monaco = {
    languages: {
      registerCompletionItemProvider: vi.fn<
        (language: string, provider: CompletionProvider) => { dispose: () => void }
      >((language, provider) => {
        providers[language] = provider;
        return { dispose: () => {} };
      }),
      registerHoverProvider: vi.fn<() => { dispose: () => void }>(() => ({ dispose: () => {} })),
      registerSignatureHelpProvider: vi.fn<() => { dispose: () => void }>(() => ({
        dispose: () => {},
      })),
      CompletionItemKind: { Text: 18, Function: 1 },
      CompletionItemInsertTextRule: { InsertAsSnippet: 4 },
    },
    editor: {
      setModelMarkers,
      getModel: (uri: { toString: () => string }) =>
        models.find((model) => model.uri.toString() === uri.toString()) ?? null,
      getModels: () => models,
    },
    MarkerSeverity: { Error: 8, Warning: 4, Info: 2, Hint: 1 },
    Uri: { parse: (value: string) => ({ toString: () => value, path: new URL(value).pathname }) },
  };
  return { monaco: monaco as unknown as Monaco, providers, setModelMarkers, models };
}

function fakeModel(uri: string, text: string) {
  const listeners: Array<() => void> = [];
  let value = text;
  const model = {
    uri: { path: new URL(uri).pathname, toString: () => uri },
    getValue: () => value,
    onDidChangeContent: (listener: () => void) => {
      listeners.push(listener);
      return { dispose: () => {} };
    },
    getWordUntilPosition: () => ({ startColumn: 1, endColumn: 4, word: "pri" }),
    edit(next: string) {
      value = next;
      for (const listener of listeners) listener();
    },
  };
  return model;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("言語サーバーとの接続", () => {
  it("接続すると initialize → initialized が送られ、サーバーの能力に応じて補完が登録される", async () => {
    // Arrange
    const socket = new FakeSocket();
    const { monaco, providers } = fakeMonaco();
    const connecting = LanguageClient.connect({
      monaco,
      socket: socket as unknown as WebSocket,
      language: "c",
      rootUri: "file:///Users/me/learn",
    });
    socket.open();
    await flush();

    // Act
    socket.reply("initialize", {
      capabilities: { completionProvider: { triggerCharacters: ["."] } },
    });
    await connecting;

    // Assert
    expect(socket.sent[0]).toMatchObject({
      method: "initialize",
      params: { rootUri: "file:///Users/me/learn", rootPath: "/Users/me/learn" },
    });
    expect(socket.sent[1]).toMatchObject({ method: "initialized" });
    expect(providers.c).toBeDefined();
    expect(monaco.languages.registerHoverProvider).not.toHaveBeenCalled();
  });

  it("開いたファイルは didOpen/didChange で同期され、補完と診断が Monaco に反映される", async () => {
    // Arrange
    const socket = new FakeSocket();
    const { monaco, providers, setModelMarkers, models } = fakeMonaco();
    const connecting = LanguageClient.connect({
      monaco,
      socket: socket as unknown as WebSocket,
      language: "c",
      rootUri: "file:///Users/me/learn",
    });
    socket.open();
    await flush();
    socket.reply("initialize", { capabilities: { completionProvider: {} } });
    const client = await connecting;
    const model = fakeModel("file:///Users/me/learn/questions/warm-up/1-hello/answer.c", "pri");
    models.push(model);

    // Act
    const detach = client.attach(model as never);
    model.edit("prin");
    const completing = providers.c?.provideCompletionItems(model, { lineNumber: 1, column: 5 });
    await flush();
    socket.reply("textDocument/completion", {
      isIncomplete: false,
      items: [{ label: "printf", kind: 3, detail: "int printf(const char *, ...)" }],
    });
    socket.receive({
      jsonrpc: "2.0",
      method: "textDocument/publishDiagnostics",
      params: {
        uri: "file:///Users/me/learn/questions/warm-up/1-hello/answer.c",
        diagnostics: [
          {
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 4 } },
            message: "unknown",
            severity: 1,
          },
        ],
      },
    });
    await flush();
    detach();

    // Assert
    expect(socket.sent).toContainEqual(
      expect.objectContaining({
        method: "textDocument/didOpen",
        params: {
          textDocument: { uri: model.uri.toString(), languageId: "c", version: 1, text: "pri" },
        },
      }),
    );
    expect(socket.sent).toContainEqual(
      expect.objectContaining({
        method: "textDocument/didChange",
        params: {
          textDocument: { uri: model.uri.toString(), version: 2 },
          contentChanges: [{ text: "prin" }],
        },
      }),
    );
    expect(socket.sent).toContainEqual(
      expect.objectContaining({
        method: "textDocument/completion",
        params: {
          textDocument: { uri: model.uri.toString() },
          position: { line: 0, character: 4 },
        },
      }),
    );
    const { suggestions } = (await completing) ?? { suggestions: [] };
    expect(suggestions[0]).toMatchObject({ label: "printf", kind: 1, insertText: "printf" });
    expect(setModelMarkers).toHaveBeenCalledWith(model, "sage-lsp", [
      expect.objectContaining({
        message: "unknown",
        severity: 8,
        startLineNumber: 1,
        endColumn: 5,
      }),
    ]);
    expect(setModelMarkers).toHaveBeenLastCalledWith(model, "sage-lsp", []);
    expect(socket.sent).toContainEqual(
      expect.objectContaining({ method: "textDocument/didClose" }),
    );
  });
});
