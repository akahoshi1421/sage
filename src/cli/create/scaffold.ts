import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SageConfig } from "#/server/config";
import { EDITOR_ADAPTER_FILE } from "#/server/paths";

export type ScaffoldOptions = {
  /** 展開先 (通常はカレントディレクトリ) */
  root: string;
  agent: SageConfig["agent"];
  locale: SageConfig["locale"];
  language: string;
  /** package.json の devDependencies に追加する sage パッケージ */
  packageName: string;
  packageVersion: string;
  /** sage パッケージ自身のルート (templates/ がある場所) */
  packageRoot: string;
};

export type ScaffoldResult = {
  /** 書き込んだファイル (root からの相対パス) */
  files: string[];
  /** スキルを置いたディレクトリ (root からの相対パス) */
  skillsDir: string;
};

type PackageJson = Record<string, unknown> & {
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const SKILLS = ["sage-create", "sage-mark"] as const;

/** エージェントごとのスキルの置き場所 */
export const skillsDirectoryFor = (agent: SageConfig["agent"]) =>
  agent === "claude" ? path.join(".claude", "skills") : path.join(".agents", "skills");

/** Claude Code だけが解釈するフロントマターの項目 (Codex 向けの SKILL からは除く) */
const CLAUDE_ONLY_FRONTMATTER = /^(argument-hint|disable-model-invocation|allowed-tools):/;

/** Codex には $ARGUMENTS の展開がないので、引数の在り処を書く */
const ARGUMENTS_NOTE: Record<SageConfig["locale"], string> = {
  ja: "(スキル名の後に書かれたもの)",
  en: "(what is written after the skill name)",
};

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

async function readTextIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

/** templates/ 配下のテンプレートを読む */
const readTemplate = (packageRoot: string, ...segments: string[]) =>
  readFile(path.join(packageRoot, "templates", ...segments), "utf8");

/** テンプレートの `{{key}}` を values で埋める */
const render = (template: string, values: Record<string, string>) =>
  template.replaceAll(/\{\{(\w+)\}\}/g, (placeholder, key: string) => values[key] ?? placeholder);

/** SKILL.md をエージェントに合わせて作る (Claude Code は /名前 と $ARGUMENTS、Codex は $名前) */
async function renderSkill(name: (typeof SKILLS)[number], options: ScaffoldOptions) {
  const { packageRoot, agent, locale, language } = options;
  const template = await readTemplate(packageRoot, "skills", locale, name, "SKILL.md.template");
  const rendered = render(template, {
    call: agent === "claude" ? `/${name}` : `$${name}`,
    arguments: agent === "claude" ? "$ARGUMENTS" : ARGUMENTS_NOTE[locale],
    language,
  });
  if (agent === "claude") return rendered;
  return rendered
    .split("\n")
    .filter((line) => !CLAUDE_ONLY_FRONTMATTER.test(line))
    .join("\n");
}

/** package.json にテンプレートの scripts と devDependencies を足す (無ければテンプレートから作る)。他の項目は変えない */
async function upsertPackageJson(options: ScaffoldOptions): Promise<void> {
  const file = path.join(options.root, "package.json");
  const template = JSON.parse(
    render(await readTemplate(options.packageRoot, "project", "package.json.template"), {
      name:
        path
          .basename(options.root)
          .toLowerCase()
          .replaceAll(/[^a-z0-9-]/g, "-") || "sage-project",
      packageName: options.packageName,
      packageVersion: options.packageVersion,
    }),
  ) as PackageJson;
  const existingText = await readTextIfExists(file);
  const existing = existingText === null ? null : (JSON.parse(existingText) as PackageJson);
  const merged = existing
    ? {
        ...existing,
        scripts: { ...existing.scripts, ...template.scripts },
        devDependencies: { ...existing.devDependencies, ...template.devDependencies },
      }
    : template;
  await writeFile(file, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

/** .gitignore にテンプレートの行を足す (既にあれば触らない) */
async function ensureGitignore(options: ScaffoldOptions): Promise<void> {
  const file = path.join(options.root, ".gitignore");
  const template = await readTemplate(options.packageRoot, "project", ".gitignore.template");
  const existing = (await readTextIfExists(file)) ?? "";
  const lines = existing.split(/\r?\n/);
  const additions = template.split("\n").filter((entry) => entry !== "" && !lines.includes(entry));
  if (additions.length === 0) return;
  const separator = existing === "" || existing.endsWith("\n") ? "" : "\n";
  await writeFile(file, `${existing}${separator}${additions.join("\n")}\n`, "utf8");
}

/** 学習環境をディレクトリに展開する (プロンプトは含まない純粋な処理) */
export async function scaffoldProject(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const { root, agent, locale, language } = options;
  const skillsDir = skillsDirectoryFor(agent);
  const config: SageConfig = { agent, locale, language };

  await Promise.all(
    ["questions", "playground"].map((dir) => mkdir(path.join(root, dir), { recursive: true })),
  );
  await Promise.all(
    SKILLS.map((name) => mkdir(path.join(root, skillsDir, name), { recursive: true })),
  );

  const files: Array<[string, string]> = [
    ["sage.config.json", `${JSON.stringify(config, null, 2)}\n`],
    [path.join("questions", ".gitkeep"), ""],
    [path.join("playground", ".gitkeep"), ""],
    ...(await Promise.all(
      SKILLS.map(async (name): Promise<[string, string]> => [
        path.join(skillsDir, name, "SKILL.md"),
        await renderSkill(name, options),
      ]),
    )),
  ];
  if ((await readTextIfExists(path.join(root, EDITOR_ADAPTER_FILE))) === null) {
    files.push([
      EDITOR_ADAPTER_FILE,
      await readTemplate(options.packageRoot, "editor", locale, `${EDITOR_ADAPTER_FILE}.template`),
    ]);
  }
  await Promise.all(
    files.map(([file, content]) => writeFile(path.join(root, file), content, "utf8")),
  );
  await upsertPackageJson(options);
  await ensureGitignore(options);

  return { files: [...files.map(([file]) => file), "package.json", ".gitignore"], skillsDir };
}
