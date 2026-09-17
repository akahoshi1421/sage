import {
  type CommandLookup,
  DEFAULT_LANGUAGE_SERVERS,
  findCommand,
} from "./default-language-servers";
import type { EditorSettings, LanguageServerSpec } from "./editor-settings";

/**
 * 言語に使う言語サーバーを決める。プロジェクトの宣言が最優先 (入っていなくてもそのまま使い、失敗は接続時に分かる)。
 * 宣言が無ければ既定の候補のうち PATH かよくある置き場所にあるものを (見つかったパスで) 使い、無ければ null (言語サーバーなしで動く)。
 */
export function resolveLanguageServer(
  settings: EditorSettings,
  language: string,
  options: CommandLookup = {},
): LanguageServerSpec | null {
  const declared = settings.languageServers[language];
  if (declared) return declared;
  for (const candidate of DEFAULT_LANGUAGE_SERVERS[language] ?? []) {
    const command = findCommand(candidate.command, options);
    if (command) return { ...candidate, command };
  }
  return null;
}
