import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SageConfig } from "#/server/config";

import { sageCreateSkill, sageMarkSkill } from "./skill-templates";

export type ScaffoldOptions = {
  /** 展開先 (通常はカレントディレクトリ) */
  root: string;
  agent: SageConfig["agent"];
  locale: SageConfig["locale"];
  language: string;
  /** package.json の devDependencies に追加する sage パッケージ */
  packageName: string;
  packageVersion: string;
};

export type ScaffoldResult = {
  /** 書き込んだファイル (root からの相対パス) */
  files: string[];
  /** スキルを置いたディレクトリ (root からの相対パス) */
  skillsDir: string;
};

/** エージェントごとのスキルの置き場所 */
export const skillsDirectoryFor = (agent: SageConfig["agent"]) =>
  agent === "claude" ? path.join(".claude", "skills") : path.join(".agents", "skills");

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

async function readJsonIfExists(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

async function readTextIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

/** package.json に start スクリプトと sage の依存を足す (無ければ作る)。他の項目は変えない */
async function upsertPackageJson(options: ScaffoldOptions): Promise<void> {
  const file = path.join(options.root, "package.json");
  const existing = await readJsonIfExists(file);
  const base = existing ?? {
    name:
      path
        .basename(options.root)
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]/g, "-") || "sage-project",
    private: true,
    type: "module",
  };
  const scripts = { ...(base.scripts as Record<string, string> | undefined), start: "sage start" };
  const devDependencies = {
    ...(base.devDependencies as Record<string, string> | undefined),
    [options.packageName]: `^${options.packageVersion}`,
  };
  await writeFile(
    file,
    `${JSON.stringify({ ...base, scripts, devDependencies }, null, 2)}\n`,
    "utf8",
  );
}

/** .gitignore に sage の作業ディレクトリと node_modules を足す (既にあれば触らない) */
async function ensureGitignore(root: string): Promise<void> {
  const file = path.join(root, ".gitignore");
  const existing = (await readTextIfExists(file)) ?? "";
  const lines = existing.split(/\r?\n/);
  const additions = ["node_modules/", ".sage/"].filter((entry) => !lines.includes(entry));
  if (additions.length === 0) return;
  const separator = existing === "" || existing.endsWith("\n") ? "" : "\n";
  await writeFile(file, `${existing}${separator}${additions.join("\n")}\n`, "utf8");
}

/** 学習環境をディレクトリに展開する (プロンプトは含まない純粋な処理) */
export async function scaffoldProject(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const { root, agent, locale, language } = options;
  const skillsDir = skillsDirectoryFor(agent);
  const config: SageConfig = { agent, locale, language };

  await mkdir(path.join(root, "questions"), { recursive: true });
  await Promise.all([
    mkdir(path.join(root, skillsDir, "sage-create"), { recursive: true }),
    mkdir(path.join(root, skillsDir, "sage-mark"), { recursive: true }),
  ]);

  const files: Array<[string, string]> = [
    ["sage.config.json", `${JSON.stringify(config, null, 2)}\n`],
    [path.join("questions", ".gitkeep"), ""],
    [path.join(skillsDir, "sage-create", "SKILL.md"), sageCreateSkill({ agent, locale, language })],
    [path.join(skillsDir, "sage-mark", "SKILL.md"), sageMarkSkill({ agent, locale, language })],
  ];
  await Promise.all(
    files.map(([file, content]) => writeFile(path.join(root, file), content, "utf8")),
  );
  await upsertPackageJson(options);
  await ensureGitignore(root);

  return { files: [...files.map(([file]) => file), "package.json", ".gitignore"], skillsDir };
}
