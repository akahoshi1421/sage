// テスト用の最小の言語サーバー: stdio で JSON-RPC を受け、initialize と echo に応える
import { StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc/node";

const reader = new StreamMessageReader(process.stdin);
const writer = new StreamMessageWriter(process.stdout);

reader.listen((message) => {
  if (message.method === "initialize") {
    void writer.write({
      jsonrpc: "2.0",
      id: message.id,
      result: { capabilities: { hoverProvider: true } },
    });
  } else if (message.method === "echo") {
    void writer.write({ jsonrpc: "2.0", id: message.id, result: message.params });
  } else if (message.method === "exit") {
    process.exit(0);
  }
});
