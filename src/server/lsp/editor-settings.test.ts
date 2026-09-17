import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { EMPTY_EDITOR_SETTINGS, loadEditorSettings } from "./editor-settings";
import { resolveLanguageServer } from "./language-servers";

let root: string | undefined;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("sage.editor.js の宣言", () => {
  it("languages と languageServers が読める", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-lsp-"));
    await writeFile(
      path.join(root, "sage.editor.js"),
      'export const languages = { mbt: "moonbit" };\nexport const languageServers = { moonbit: { command: "moon", args: ["lsp"] }, c: { command: "clangd" } };\n',
    );

    // Act
    const settings = await loadEditorSettings(root);

    // Assert
    expect(settings).toEqual({
      languages: { mbt: "moonbit" },
      languageServers: {
        moonbit: { command: "moon", args: ["lsp"] },
        c: { command: "clangd", args: [] },
      },
    });
  });

  it("sage.editor.js が無ければ何も宣言されていない扱いで、形が違えばエラーになる", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-lsp-"));

    // Act / Assert
    await expect(loadEditorSettings(root)).resolves.toEqual(EMPTY_EDITOR_SETTINGS);
    await writeFile(
      path.join(root, "sage.editor.js"),
      "export const languageServers = { c: 'clangd' };\n",
    );
    await expect(loadEditorSettings(root)).rejects.toThrow(/expected object/);
  });
});

describe("言語サーバーの選択", () => {
  it("宣言があればそれを使い、無ければ PATH にある既定の候補を使う", async () => {
    // Arrange: 偽の PATH に gopls だけ置く
    root = await mkdtemp(path.join(os.tmpdir(), "sage-path-"));
    await writeFile(path.join(root, "gopls"), "#!/bin/sh\n");
    await chmod(path.join(root, "gopls"), 0o755);
    const options = { envPath: root, platform: "darwin" as const };
    const settings = { languages: {}, languageServers: { c: { command: "my-clangd", args: [] } } };

    // Act / Assert
    expect(resolveLanguageServer(settings, "c", options)).toEqual({
      command: "my-clangd",
      args: [],
    });
    expect(resolveLanguageServer(settings, "go", options)).toEqual({ command: "gopls", args: [] });
    expect(resolveLanguageServer(settings, "python", options)).toBeNull();
    expect(resolveLanguageServer(settings, "moonbit", options)).toBeNull();
  });
});
