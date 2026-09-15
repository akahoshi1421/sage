import { Checkmark, Link, List, ListItem } from "#/components/ui";
import { useMessages } from "#/i18n/hooks/use-messages";

import type { QuestionSummary } from "./types";

export type QuestionListProps = {
  questions: QuestionSummary[];
  /** 問題の回答ページへのリンク先 */
  questionHref: (question: QuestionSummary) => string;
  /** 表示中の問題番号 (現在地として示す) */
  currentNumber?: number;
};

/** 問題番号付きの問題一覧。各問題の先頭に回答済み (チェック済み) / 未回答 (未チェック) の印が付く */
export function QuestionList({ questions, questionHref, currentNumber }: QuestionListProps) {
  const messages = useMessages();

  return (
    <List as="ol" spacing="xs">
      {questions.map((question) => (
        <ListItem key={question.number} value={question.number}>
          <Checkmark
            checked={question.solved}
            label={question.solved ? messages.question.solved : messages.question.unsolved}
          />{" "}
          <Link
            href={questionHref(question)}
            aria-current={question.number === currentNumber ? "page" : undefined}
          >
            {question.title}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
