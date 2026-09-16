import { Server } from "node:http";
import path from "node:path";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

import { attachLspBridge } from "./src/server/lsp/bridge";

/** 開発サーバーでも言語サーバーの中継 (WebSocket) を使えるようにする (本番は sage start が行う) */
const sageLspBridge = (): Plugin => ({
  name: "sage-lsp-bridge",
  configureServer(server) {
    if (server.httpServer instanceof Server) {
      attachLspBridge(server.httpServer, { root: path.resolve(process.env.SAGE_ROOT ?? process.cwd()) });
    }
  },
});

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), viteReact(), sageLspBridge()],
});
