import type { Messages } from "#/i18n/messages";

import type { LanguageServerStatus } from "../hooks/use-editor-adapter";

/** 言語サーバーの接続状態の表示文言 */
export function languageServerLabel(messages: Messages, status: LanguageServerStatus): string {
  const labels = messages.question.languageServer;
  switch (status.state) {
    case "connecting":
      return labels.connecting(status.command);
    case "ready":
      return labels.ready(status.command);
    case "error":
      return labels.error(status.command, status.reason);
  }
}
