import type { QuestionSummary } from "#/features/questions/types";

/** 番号順で次の問題へのリンク先。最後の問題なら undefined */
export function nextQuestionHrefOf(
  questions: QuestionSummary[],
  currentNumber: number,
  questionHref: (question: QuestionSummary) => string,
): string | undefined {
  const sorted = questions.toSorted((a, b) => a.number - b.number);
  const index = sorted.findIndex((question) => question.number === currentNumber);
  const next = index === -1 ? undefined : sorted[index + 1];
  return next ? questionHref(next) : undefined;
}
