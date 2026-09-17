import { accessSync, constants, readdirSync } from "node:fs";
import os from "node:os";
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

export type CommandLookup = {
  envPath?: string;
  platform?: NodeJS.Platform;
  home?: string;
  /** Go の GOPATH (無ければ ~/go) */
  goPath?: string;
};

/**
 * PATH に無くても言語サーバーがよく置かれる場所 (go install、rustup、pip の user install)。
 * 利用者が PATH を通し忘れていても見つけるための候補で、言語の知識は増やさない
 */
export function usualInstallDirs({
  home = os.homedir(),
  goPath = process.env.GOPATH,
}: Pick<CommandLookup, "home" | "goPath"> = {}): string[] {
  const dirs = [
    path.join(goPath ?? path.join(home, "go"), "bin"),
    path.join(home, ".cargo", "bin"),
    path.join(home, ".local", "bin"),
  ];
  // macOS の pip --user は ~/Library/Python/{version}/bin に入る
  try {
    for (const version of readdirSync(path.join(home, "Library", "Python"))) {
      dirs.push(path.join(home, "Library", "Python", version, "bin"));
    }
  } catch {
    // Python の user install が無いだけ
  }
  return dirs;
}

/** コマンドを PATH とよくある置き場所から探し、見つかった実行ファイルのパスを返す (絶対パスならそのまま) */
export function findCommand(
  command: string,
  {
    envPath = process.env.PATH ?? "",
    platform = process.platform,
    home,
    goPath,
  }: CommandLookup = {},
): string | null {
  const names = platform === "win32" ? [command, `${command}.exe`, `${command}.cmd`] : [command];
  if (path.isAbsolute(command)) return names.find(isExecutable) ?? null;
  const dirs = [
    ...envPath.split(path.delimiter).filter(Boolean),
    ...usualInstallDirs({ home, goPath }),
  ];
  for (const dir of dirs) {
    const found = names.map((name) => path.join(dir, name)).find(isExecutable);
    if (found) return found;
  }
  return null;
}
