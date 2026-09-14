import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Storybook 専用の Vite 設定 (TanStack Start のプラグインは含めない) */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  optimizeDeps: {
    // ストーリーが使う依存をあらかじめまとめて最適化しておく。
    // 後から見つかった依存を再最適化すると、古い React と新しい React が混在して
    // 部品が反応しなくなることがあるため。
    include: [
      "@chakra-ui/react",
      "@chakra-ui/react/anatomy",
      "@emotion/react",
      "@monaco-editor/react",
      "jotai",
      "react-markdown",
      "remark-gfm",
      "shiki",
      "shiki/engine/javascript",
    ],
  },
});
