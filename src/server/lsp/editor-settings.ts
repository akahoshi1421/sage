import { stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { z } from "zod";

import { EDITOR_ADAPTER_FILE } from "../paths";

const languageServerSchema = z.object({
  /** 起動コマンド (PATH から探す) */
  command: z.string().min(1),
  args: z.array(z.string()).default([]),
  /** 起動ディレクトリ (プロジェクトのルートからの相対パス、例: `playground`)。言語サーバーのワークスペースもここになる */
  cwd: z.string().optional(),
});

export type LanguageServerSpec = z.infer<typeof languageServerSchema>;

const editorSettingsSchema = z.object({
  /** 拡張子 (ドット無し) → Monaco の言語 ID。sage が知らない言語のために宣言する */
  languages: z.record(z.string(), z.string().min(1)).default({}),
  /** Monaco の言語 ID → 言語サーバーの起動方法 */
  languageServers: z.record(z.string(), languageServerSchema).default({}),
});

/** `sage.editor.js` がトップレベルで宣言する設定 (サーバー側で読む分) */
export type EditorSettings = z.infer<typeof editorSettingsSchema>;

export const EMPTY_EDITOR_SETTINGS: EditorSettings = { languages: {}, languageServers: {} };

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

/**
 * `sage.editor.js` の `languages` と `languageServers` を読む (ファイルが無ければ空)。
 * ブラウザ向けのファイルだが、言語 ID の解決と起動コマンドはサーバー側で決めるのでここでも読み込む。
 */
export async function loadEditorSettings(root: string): Promise<EditorSettings> {
  const file = path.join(root, EDITOR_ADAPTER_FILE);
  let modifiedAt: number;
  try {
    modifiedAt = (await stat(file)).mtimeMs;
  } catch (error) {
    if (isMissingFile(error)) return EMPTY_EDITOR_SETTINGS;
    throw error;
  }
  // import はキャッシュされるので、編集後に読み直せるよう更新時刻をクエリに付ける
  const adapter = (await import(`${pathToFileURL(file).href}?mtime=${modifiedAt}`)) as {
    languages?: unknown;
    languageServers?: unknown;
  };
  return editorSettingsSchema.parse({
    languages: adapter.languages ?? {},
    languageServers: adapter.languageServers ?? {},
  });
}
