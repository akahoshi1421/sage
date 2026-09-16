import { stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { z } from "zod";

import { EDITOR_ADAPTER_FILE } from "../paths";

const specSchema = z.object({
  /** 起動コマンド (PATH から探す) */
  command: z.string().min(1),
  args: z.array(z.string()).default([]),
});

export type LanguageServerSpec = z.infer<typeof specSchema>;

/** Monaco の言語 ID → 言語サーバーの起動方法 */
const languageServersSchema = z.record(z.string(), specSchema);

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

/**
 * `sage.editor.js` が export する `languageServers` を読む (無ければ空)。
 * ブラウザ向けのファイルだが、起動コマンドはサーバー側で決める必要があるのでここでも読み込む。
 */
export async function loadLanguageServers(
  root: string,
): Promise<Record<string, LanguageServerSpec>> {
  const file = path.join(root, EDITOR_ADAPTER_FILE);
  let modifiedAt: number;
  try {
    modifiedAt = (await stat(file)).mtimeMs;
  } catch (error) {
    if (isMissingFile(error)) return {};
    throw error;
  }
  // import はキャッシュされるので、編集後に読み直せるよう更新時刻をクエリに付ける
  const adapter = (await import(`${pathToFileURL(file).href}?mtime=${modifiedAt}`)) as {
    languageServers?: unknown;
  };
  return languageServersSchema.parse(adapter.languageServers ?? {});
}
