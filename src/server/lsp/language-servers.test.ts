import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadLanguageServers } from "./language-servers";

let root: string | undefined;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("言語サーバーの宣言の読み込み", () => {
  it("sage.editor.js の languageServers が言語ごとの起動コマンドとして読める", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-lsp-"));
    await writeFile(
      path.join(root, "sage.editor.js"),
      'export function setup() {}\nexport const languageServers = { c: { command: "clangd" }, python: { command: "pyright-langserver", args: ["--stdio"] } };\n',
    );

    // Act
    const servers = await loadLanguageServers(root);

    // Assert
    expect(servers).toEqual({
      c: { command: "clangd", args: [] },
      python: { command: "pyright-langserver", args: ["--stdio"] },
    });
  });

  it("sage.editor.js が無ければ何も宣言されていない扱いになる", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-lsp-"));

    // Act / Assert
    await expect(loadLanguageServers(root)).resolves.toEqual({});
  });

  it("宣言の形が違えばエラーになる", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-lsp-"));
    await writeFile(
      path.join(root, "sage.editor.js"),
      "export const languageServers = { c: 'clangd' };\n",
    );

    // Act / Assert
    await expect(loadLanguageServers(root)).rejects.toThrow(/expected object/);
  });
});
