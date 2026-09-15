import { defineConfig } from "tsdown";

/** CLI (bin/sage.js から読み込まれる) を 1 ファイルにまとめる */
export default defineConfig({
  entry: ["src/cli/index.ts"],
  outDir: "dist/cli",
  format: "esm",
  platform: "node",
  target: "node22",
  dts: false,
  clean: true,
});
