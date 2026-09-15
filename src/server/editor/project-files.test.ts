import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { readProjectFile, readProjectFiles } from "./project-files";

let root: string | undefined;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("アダプタ向けのプロジェクトファイルの読み込み", () => {
  it("ディレクトリ以下から拡張子の合うファイルだけが相対パス付きで返る", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-files-"));
    await mkdir(path.join(root, "node_modules", "zod", "v4"), { recursive: true });
    await writeFile(
      path.join(root, "node_modules", "zod", "package.json"),
      '{"types":"./index.d.ts"}',
    );
    await writeFile(path.join(root, "node_modules", "zod", "index.d.ts"), "export const z: 1;");
    await writeFile(path.join(root, "node_modules", "zod", "index.js"), "module.exports = {}");
    await writeFile(path.join(root, "node_modules", "zod", "v4", "core.d.ts"), "export {};");

    // Act
    const files = await readProjectFiles(root, "node_modules/zod", [".d.ts", "package.json"]);

    // Assert
    expect(files).toEqual({
      "node_modules/zod/package.json": '{"types":"./index.d.ts"}',
      "node_modules/zod/index.d.ts": "export const z: 1;",
      "node_modules/zod/v4/core.d.ts": "export {};",
    });
  });

  it("プロジェクトの外を指すパスは読めない", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-files-"));

    // Act / Assert
    await expect(readProjectFiles(root, "../", [".d.ts"])).rejects.toThrow(/プロジェクトの外/);
    await expect(readProjectFile(root, "/etc/hosts")).rejects.toThrow(/プロジェクトの外/);
    await expect(readProjectFile(root, "missing.js")).resolves.toBeNull();
  });
});
