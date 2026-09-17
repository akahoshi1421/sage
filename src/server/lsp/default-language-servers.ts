import { accessSync, constants } from "node:fs";
import path from "node:path";

import type { LanguageServerSpec } from "./editor-settings";

/**
 * 宣言が無いときに試す、よく知られた言語サーバー (Monaco の言語 ID ごと、先頭から順に PATH にあるものを使う)。
 * 入れるのは利用者側の仕事で、sage は候補を知っているだけ。
 */
export const DEFAULT_LANGUAGE_SERVERS: Record<string, LanguageServerSpec[]> = {
  python: [
    { command: "pyright-langserver", args: ["--stdio"] },
    { command: "pylsp", args: [] },
  ],
  go: [{ command: "gopls", args: [] }],
  c: [{ command: "clangd", args: [] }],
  cpp: [{ command: "clangd", args: [] }],
  rust: [{ command: "rust-analyzer", args: [] }],
  typescript: [{ command: "typescript-language-server", args: ["--stdio"] }],
  javascript: [{ command: "typescript-language-server", args: ["--stdio"] }],
  java: [{ command: "jdtls", args: [] }],
  kotlin: [{ command: "kotlin-language-server", args: [] }],
  csharp: [{ command: "csharp-ls", args: [] }],
  ruby: [
    { command: "ruby-lsp", args: [] },
    { command: "solargraph", args: ["stdio"] },
  ],
  php: [{ command: "intelephense", args: ["--stdio"] }],
  swift: [{ command: "sourcekit-lsp", args: [] }],
  dart: [{ command: "dart", args: ["language-server", "--protocol=lsp"] }],
  scala: [{ command: "metals", args: [] }],
  shell: [{ command: "bash-language-server", args: ["start"] }],
  html: [{ command: "vscode-html-language-server", args: ["--stdio"] }],
  css: [{ command: "vscode-css-language-server", args: ["--stdio"] }],
  json: [{ command: "vscode-json-language-server", args: ["--stdio"] }],
  yaml: [{ command: "yaml-language-server", args: ["--stdio"] }],
};

const isExecutable = (file: string) => {
  try {
    accessSync(file, constants.X_OK);
    return true;
  } catch {
    return false;
  }
};

/** コマンドが PATH (または絶対パス) にあるか */
export function isOnPath(
  command: string,
  { envPath = process.env.PATH ?? "", platform = process.platform } = {},
): boolean {
  const names = platform === "win32" ? [command, `${command}.exe`, `${command}.cmd`] : [command];
  if (path.isAbsolute(command)) return names.some(isExecutable);
  return envPath
    .split(path.delimiter)
    .filter(Boolean)
    .some((dir) => names.some((name) => isExecutable(path.join(dir, name))));
}
