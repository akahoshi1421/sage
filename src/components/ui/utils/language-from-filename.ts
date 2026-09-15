const EXTENSION_LANGUAGES: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  kt: "kotlin",
  kts: "kotlin",
  cs: "csharp",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  php: "php",
  swift: "swift",
  dart: "dart",
  scala: "scala",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  sql: "sql",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  md: "markdown",
  html: "html",
  vue: "html",
  svelte: "html",
  css: "css",
  scss: "scss",
  less: "less",
  xml: "xml",
  graphql: "graphql",
  gql: "graphql",
  lua: "lua",
  r: "r",
  pl: "perl",
  ps1: "powershell",
  toml: "ini",
  ini: "ini",
};

/** ファイル名 (例: `answer.ts`) から Monaco の言語 ID を推定する。不明なら plaintext */
export function languageFromFilename(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  if (/^dockerfile$/i.test(base)) return "dockerfile";
  const dot = base.lastIndexOf(".");
  const extension = dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
  return EXTENSION_LANGUAGES[extension] ?? "plaintext";
}
