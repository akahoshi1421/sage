export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["oxfmt", "oxlint"],
  "*.{json,jsonc,css,md,yml,yaml,html}": ["oxfmt"],
  "*.{ts,tsx}": () => "tsc --noEmit",
};
