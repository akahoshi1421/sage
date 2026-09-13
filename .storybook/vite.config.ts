import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Storybook 専用の Vite 設定 (TanStack Start のプラグインは含めない) */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [viteReact()],
});
