import type { StatusBadgeStatus } from "#/components/ui";
import type { Verdict } from "#/features/questions/types";
import type { Messages } from "#/i18n/messages";

/** 採点結果の判定 → StatusBadge の色 */
export const verdictStatus: Record<Verdict, StatusBadgeStatus> = {
  correct: "success",
  close: "warning",
  incorrect: "error",
};

/** 採点結果の判定 → 表示文言 */
export const verdictLabel = (messages: Messages, verdict: Verdict): string =>
  ({
    correct: messages.result.correct,
    close: messages.result.close,
    incorrect: messages.result.incorrect,
  })[verdict];
