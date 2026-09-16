import { describe, expect, it, vi } from "vitest";

import { JsonRpcSocket } from "./json-rpc-socket";

/** 送信内容を記録し、テストから受信イベントを起こせる偽の WebSocket */
class FakeSocket extends EventTarget {
  readonly sent: string[] = [];
  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.dispatchEvent(new CloseEvent("close", { code: 1000, reason: "bye" }));
  }
  receive(message: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(message) }));
  }
}

describe("JSON-RPC over WebSocket", () => {
  it("要求は id 付きで送られ、同じ id の応答で解決する", async () => {
    // Arrange
    const socket = new FakeSocket();
    const rpc = new JsonRpcSocket(socket as unknown as WebSocket, () => undefined);

    // Act
    const reply = rpc.request<{ ok: boolean }>("initialize", { rootUri: "file:///p" });
    socket.receive({ jsonrpc: "2.0", id: 1, result: { ok: true } });

    // Assert
    await expect(reply).resolves.toEqual({ ok: true });
    expect(JSON.parse(socket.sent[0] ?? "")).toEqual({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { rootUri: "file:///p" },
    });
  });

  it("サーバーからの要求にはハンドラの返り値で応答し、通知には応答しない", async () => {
    // Arrange
    const socket = new FakeSocket();
    const handler = vi.fn<(method: string, params: unknown) => unknown>((method) =>
      method === "workspace/configuration" ? [null] : undefined,
    );
    const rpc = new JsonRpcSocket(socket as unknown as WebSocket, handler);

    // Act
    socket.receive({
      jsonrpc: "2.0",
      id: 7,
      method: "workspace/configuration",
      params: { items: [{}] },
    });
    socket.receive({ jsonrpc: "2.0", method: "window/logMessage", params: { message: "hi" } });
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(rpc).toBeDefined();
    expect(socket.sent).toHaveLength(1);
    expect(JSON.parse(socket.sent[0] ?? "")).toEqual({ jsonrpc: "2.0", id: 7, result: [null] });
    expect(handler).toHaveBeenCalledWith("window/logMessage", { message: "hi" });
  });

  it("接続が閉じると待っている要求は理由付きで失敗する", async () => {
    // Arrange
    const socket = new FakeSocket();
    const rpc = new JsonRpcSocket(socket as unknown as WebSocket, () => undefined);
    const reply = rpc.request("textDocument/hover", {});

    // Act
    socket.close();

    // Assert
    await expect(reply).rejects.toThrow("connection closed (1000: bye)");
  });
});
