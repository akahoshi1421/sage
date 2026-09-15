import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * テストは 2 種類に分ける。
 * - ui: `*.test.tsx` — React 部品・画面のテスト (jsdom + Testing Library)
 * - logic: `*.test.ts` — サーバー処理や純粋なロジックのテスト (Node)
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "ui",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.test.tsx"],
          css: false,
          // ダイアログやアコーディオンの開閉を待つテストは CI の負荷で遅くなることがある
          testTimeout: 15_000,
        },
      },
      {
        extends: true,
        test: {
          name: "logic",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
    ],
  },
});
