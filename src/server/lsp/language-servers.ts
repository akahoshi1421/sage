import { DEFAULT_LANGUAGE_SERVERS, isOnPath } from "./default-language-servers";
import type { EditorSettings, LanguageServerSpec } from "./editor-settings";

/**
 * 言語に使う言語サーバーを決める。プロジェクトの宣言が最優先 (入っていなくてもそのまま使い、失敗は接続時に分かる)。
 * 宣言が無ければ既定の候補のうち PATH にあるものを使い、無ければ null (言語サーバーなしで動く)。
 */
export function resolveLanguageServer(
  settings: EditorSettings,
  language: string,
  options: { envPath?: string; platform?: NodeJS.Platform } = {},
): LanguageServerSpec | null {
  const declared = settings.languageServers[language];
  if (declared) return declared;
  const candidates = DEFAULT_LANGUAGE_SERVERS[language] ?? [];
  return candidates.find((candidate) => isOnPath(candidate.command, options)) ?? null;
}
