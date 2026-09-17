import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { loadConfig } from "#/server/config";

import { scaffoldProject } from "./scaffold";

let root: string | undefined;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

const scaffold = (overrides: Partial<Parameters<typeof scaffoldProject>[0]> = {}) =>
  scaffoldProject({
    root: root ?? "",
    agent: "claude",
    locale: "ja",
    language: "日本語",
    packageName: "@akahoshi1421/sage",
    packageVersion: "1.2.3",
    packageRoot: fileURLToPath(new URL("../../..", import.meta.url)),
    ...overrides,
  });

const read = (file: string) => readFile(path.join(root ?? "", file), "utf8");

describe("学習環境の展開", () => {
  it("Claude Code を選ぶと、設定・questions/・.claude/skills の 2 つの SKILL・start スクリプトが用意される", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-create-"));

    // Act
    const result = await scaffold();

    // Assert
    expect(result.skillsDir).toBe(path.join(".claude", "skills"));
    await expect(loadConfig(path.join(root, "sage.config.json"))).resolves.toEqual({
      agent: "claude",
      locale: "ja",
      language: "日本語",
    });
    await expect(read(".claude/skills/sage-create/SKILL.md")).resolves.toMatch(
      /^---\nname: sage-create/,
    );
    await expect(read(".claude/skills/sage-mark/SKILL.md")).resolves.toContain("npx sage solved");
    const pkg = JSON.parse(await read("package.json")) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(pkg.scripts.start).toBe("sage start");
    expect(pkg.devDependencies["@akahoshi1421/sage"]).toBe("^1.2.3");
    await expect(read(".gitignore")).resolves.toContain(".sage/");
    await expect(read("sage.editor.js")).resolves.toContain("export const languageServers");
    await expect(read("playground/.gitkeep")).resolves.toBe("");
  });

  it("既にある sage.editor.js は上書きされない", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-create-"));
    await writeFile(path.join(root, "sage.editor.js"), "export function setup() {}\n", "utf8");

    // Act
    const result = await scaffold();

    // Assert
    await expect(read("sage.editor.js")).resolves.toBe("export function setup() {}\n");
    expect(result.files).not.toContain("sage.editor.js");
  });

  it("Codex を選ぶと SKILL は .agents/skills に置かれ、$sage-create の呼び方で案内される", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-create-"));

    // Act
    const result = await scaffold({ agent: "codex", locale: "en", language: "English" });

    // Assert
    expect(result.skillsDir).toBe(path.join(".agents", "skills"));
    const skill = await read(".agents/skills/sage-create/SKILL.md");
    expect(skill).toContain("$sage-create <technology>");
    expect(skill).not.toContain("$ARGUMENTS");
    expect(skill).not.toContain("argument-hint");
  });

  it("問題文の言語は SKILL に書き込まれる", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-create-"));

    // Act
    await scaffold({ locale: "en", language: "Français" });

    // Assert
    await expect(read(".claude/skills/sage-create/SKILL.md")).resolves.toContain("**Français**");
    await expect(read(".claude/skills/sage-mark/SKILL.md")).resolves.toContain("**Français**");
  });

  it("既にある package.json と .gitignore は必要な行だけ足され、他は保たれる", async () => {
    // Arrange
    root = await mkdtemp(path.join(os.tmpdir(), "sage-create-"));
    await writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ name: "my-app", scripts: { test: "vitest" }, dependencies: { vue: "^3" } }),
      "utf8",
    );
    await writeFile(path.join(root, ".gitignore"), "node_modules/\ndist/\n", "utf8");

    // Act
    await scaffold();

    // Assert
    const pkg = JSON.parse(await read("package.json")) as Record<string, unknown>;
    expect(pkg.name).toBe("my-app");
    expect(pkg.scripts).toEqual({ test: "vitest", start: "sage start" });
    expect(pkg.dependencies).toEqual({ vue: "^3" });
    await expect(read(".gitignore")).resolves.toBe("node_modules/\ndist/\n.sage/\n");
  });
});
