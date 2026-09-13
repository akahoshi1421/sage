// oxfmt 側で無視しているファイル (docs/**, routeTree.gen.ts) だけがステージされた場合に
// 「対象ファイルなし」でエラー終了しないよう --no-error-on-unmatched-pattern を付ける
const oxfmt = "oxfmt --no-error-on-unmatched-pattern";

export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": [oxfmt, "oxlint"],
  "*.{json,jsonc,css,md,yml,yaml,html}": [oxfmt],
  "*.{ts,tsx}": () => "tsc --noEmit",
};
