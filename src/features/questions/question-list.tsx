import { Icon, Link, List, ListItem, Text } from "#/components/ui";
import { useMessages } from "#/i18n/locale";

import type { QuestionSummary } from "./types";

export type QuestionListProps = {
  questions: QuestionSummary[];
  /** 問題の回答ページへのリンク先 */
  questionHref: (question: QuestionSummary) => string;
  /** 表示中の問題番号 (現在地として示す) */
  currentNumber?: number;
};

/** 問題番号付きの問題一覧。正解済みの問題には印が付く */
export function QuestionList({ questions, questionHref, currentNumber }: QuestionListProps) {
  const messages = useMessages();

  return (
    <List as="ol" spacing="4">
      {questions.map((question) => (
        <ListItem key={question.number} value={question.number}>
          {question.solved && (
            <Text as="span" color="success">
              <Icon name="complete_fill" size="sm" label={messages.question.solved} />{" "}
            </Text>
          )}
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
