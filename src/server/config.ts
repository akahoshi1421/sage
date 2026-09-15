import { readFile } from "node:fs/promises";

import { z } from "zod";

/** `sage.config.json` の内容 (`npx sage create` の対話で決まる) */
export const sageConfigSchema = z.object({
  /** 問題生成と採点に使うコーディングエージェント */
  agent: z.enum(["claude", "codex"]),
  /** Web 版 UI の表示言語 */
  locale: z.enum(["ja", "en"]).default("en"),
  /** 問題文・ヒント・答え・採点の一言を書く言語 (自由記述。例: 日本語 / English / Français) */
  language: z.string().min(1).default("English"),
});

export type SageConfig = z.infer<typeof sageConfigSchema>;

export const DEFAULT_CONFIG: SageConfig = { agent: "claude", locale: "en", language: "English" };

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

/** 設定ファイルを読む。無ければ既定値、壊れていればエラー */
export async function loadConfig(configFile: string): Promise<SageConfig> {
  let raw: string;
  try {
    raw = await readFile(configFile, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return DEFAULT_CONFIG;
    throw error;
  }
  return sageConfigSchema.parse(JSON.parse(raw));
}
