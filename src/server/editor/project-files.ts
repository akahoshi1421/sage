import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/** 一度に読み込むファイルの合計サイズの上限 (型定義の読み込みを想定) */
export const MAX_TOTAL_BYTES = 32 * 1024 * 1024;

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

/** root の中を指す相対パスなら絶対パスに、外に出るなら null */
export function resolveInsideRoot(root: string, relative: string): string | null {
  const resolved = path.resolve(root, relative);
  return resolved === root || resolved.startsWith(root + path.sep) ? resolved : null;
}

const toPosix = (root: string, file: string) => path.relative(root, file).split(path.sep).join("/");

/** プロジェクト内の 1 ファイルを読む (無ければ null) */
export async function readProjectFile(root: string, relative: string): Promise<string | null> {
  const file = resolveInsideRoot(root, relative);
  if (!file) throw new Error(`プロジェクトの外は読めません: ${relative}`);
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return null;
    throw error;
  }
}

/**
 * dir 以下を再帰的に辿り、名前が suffixes のどれかで終わるファイルを { 相対パス: 内容 } で返す
 * (例: `node_modules/zod` の `.d.ts` と `package.json`)。シンボリックリンクは辿らない
 */
export async function readProjectFiles(
  root: string,
  dir: string,
  suffixes: readonly string[],
): Promise<Record<string, string>> {
  const start = resolveInsideRoot(root, dir);
  if (!start) throw new Error(`プロジェクトの外は読めません: ${dir}`);

  const files: Record<string, string> = {};
  let total = 0;
  const walk = async (current: string): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const file = path.join(current, entry.name);
        if (entry.isDirectory()) return walk(file);
        if (!entry.isFile() || !suffixes.some((suffix) => entry.name.endsWith(suffix))) return;
        const content = await readFile(file, "utf8");
        total += content.length;
        if (total > MAX_TOTAL_BYTES) {
          throw new Error(`読み込むファイルが大きすぎます (${dir}: ${MAX_TOTAL_BYTES} バイトまで)`);
        }
        files[toPosix(root, file)] = content;
      }),
    );
  };
  await walk(start);
  return files;
}
