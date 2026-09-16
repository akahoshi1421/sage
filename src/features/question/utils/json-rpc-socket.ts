type JsonRpcMessage = {
  jsonrpc: "2.0";
  id?: number | string;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code: number; message: string };
};

/** サーバーから届いた要求・通知を処理する。要求 (id あり) なら返り値が応答になる */
export type JsonRpcIncomingHandler = (
  method: string,
  params: unknown,
) => unknown | Promise<unknown>;

/** WebSocket の上で JSON-RPC 2.0 をやり取りする (1 フレーム 1 メッセージ)。言語サーバーとの通信に使う */
export class JsonRpcSocket {
  private nextId = 1;
  private readonly pending = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();

  constructor(
    private readonly socket: WebSocket,
    private readonly onIncoming: JsonRpcIncomingHandler,
  ) {
    socket.addEventListener("message", (event) => {
      void this.handle(String(event.data));
    });
    socket.addEventListener("close", (event) => {
      const error = new Error(
        `connection closed (${event.code}${event.reason ? `: ${event.reason}` : ""})`,
      );
      for (const request of this.pending.values()) request.reject(error);
      this.pending.clear();
    });
  }

  request<T>(method: string, params?: unknown): Promise<T> {
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: (value) => resolve(value as T), reject });
      this.send({ jsonrpc: "2.0", id, method, params });
    });
  }

  notify(method: string, params?: unknown): void {
    this.send({ jsonrpc: "2.0", method, params });
  }

  close(): void {
    this.socket.close();
  }

  private send(message: JsonRpcMessage) {
    this.socket.send(JSON.stringify(message));
  }

  private async handle(raw: string) {
    const message = JSON.parse(raw) as JsonRpcMessage;
    if (message.method === undefined) {
      // 応答
      const request = typeof message.id === "number" ? this.pending.get(message.id) : undefined;
      if (!request) return;
      this.pending.delete(message.id as number);
      if (message.error)
        request.reject(new Error(`${message.method ?? ""}${message.error.message}`));
      else request.resolve(message.result);
      return;
    }
    // サーバーからの要求 (id あり) または通知
    const result = await this.onIncoming(message.method, message.params);
    if (message.id !== undefined) {
      this.send({ jsonrpc: "2.0", id: message.id, result: result ?? null });
    }
  }
}
