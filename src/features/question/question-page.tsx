import { useState } from "react";

import {
  Accordion,
  AppHeader,
  Box,
  Button,
  CodeEditor,
  Dialog,
  DialogCloseButton,
  Divider,
  Drawer,
  Flex,
  HamburgerMenuButton,
  Heading,
  languageFromFilename,
  Markdown,
  Splitter,
  StatusBadge,
  Text,
  VStack,
} from "#/components/ui";
import { groupQuestionsByDifficulty } from "#/features/questions/group-by-difficulty";
import { QuestionList } from "#/features/questions/question-list";
import type {
  MarkResult,
  QuestionDetail,
  QuestionSummary,
  Verdict,
} from "#/features/questions/types";
import { useMessages } from "#/i18n/locale";

export type QuestionPageProps = {
  question: QuestionDetail;
  /** ドロワーの問題一覧に表示する全問題 */
  questions: QuestionSummary[];
  /** 問題の回答ページへのリンク先 */
  questionHref: (question: QuestionSummary) => string;
  /** エディタの内容 (制御コンポーネント) */
  code: string;
  onCodeChange: (code: string) => void;
  /** Cmd/Ctrl+S で呼ばれる */
  onSave: (code: string) => void;
  /** 「回答」ボタンで呼ばれる (採点の開始) */
  onSubmit: () => void;
  /** 採点中 */
  submitting?: boolean;
  /** 採点結果 (null なら結果ダイアログを表示しない) */
  result: MarkResult | null;
  onResultClose: () => void;
  /** 正解時の「次の問題へ」のリンク先 (最後の問題なら省略) */
  nextQuestionHref?: string;
};

const verdictStatus: Record<Verdict, "success" | "warning" | "error"> = {
  correct: "success",
  close: "warning",
  incorrect: "error",
};

/** 回答ページ: 左に問題文・ヒント・答え、右にコードエディタと回答ボタン */
export function QuestionPage({
  question,
  questions,
  questionHref,
  code,
  onCodeChange,
  onSave,
  onSubmit,
  submitting = false,
  result,
  onResultClose,
  nextQuestionHref,
}: QuestionPageProps) {
  const messages = useMessages();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const groups = groupQuestionsByDifficulty(questions);

  const verdictLabels: Record<Verdict, string> = {
    correct: messages.result.correct,
    close: messages.result.close,
    incorrect: messages.result.incorrect,
  };

  const questionPane = (
    <Box h="100%" overflowY="auto" px={{ base: "4", md: "6" }} py="6">
      <VStack align="stretch" gap="6">
        <Heading level="h1" size="24">
          {messages.difficulty[question.difficulty]} {question.number} {question.title}
        </Heading>
        <Markdown>{question.question}</Markdown>
        <Accordion
          items={[
            {
              value: "hint",
              title: messages.question.hint,
              content: <Markdown>{question.hint}</Markdown>,
            },
          ]}
        />
        <Box>
          <Button variant="outline" onClick={() => setAnswerOpen(true)}>
            {messages.question.showAnswer}
          </Button>
        </Box>
      </VStack>
    </Box>
  );

  const editorPane = (
    <Flex direction="column" h="100%">
      <Box flex="1" minH="0">
        <CodeEditor
          value={code}
          language={languageFromFilename(question.templateFileName)}
          onChange={onCodeChange}
          onSave={onSave}
          label={question.templateFileName}
        />
      </Box>
      <Box position="sticky" bottom="0">
        <Divider />
        <Flex justify="flex-end" align="center" gap="4" px="4" py="3">
          <Text as="span" color="muted" textStyle="dns-14N-130">
            {question.templateFileName}
          </Text>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? messages.question.submitting : messages.question.submit}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );

  const resultFooter =
    result?.verdict === "correct" && nextQuestionHref ? (
      <>
        <DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>
        <Button asChild>
          <a href={nextQuestionHref}>{messages.question.next}</a>
        </Button>
      </>
    ) : (
      <DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>
    );

  return (
    <Flex direction="column" h="100dvh">
      <AppHeader
        homeHref="/"
        startSlot={
          <HamburgerMenuButton label={messages.nav.menu} onClick={() => setMenuOpen(true)} />
        }
      />
      <Drawer
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title={messages.nav.questionList}
        closeLabel={messages.nav.close}
      >
        <Accordion
          defaultValue={[question.difficulty]}
          items={groups.map((group) => ({
            value: group.difficulty,
            title: messages.difficulty[group.difficulty],
            content: (
              <QuestionList
                questions={group.questions}
                questionHref={questionHref}
                currentNumber={question.number}
              />
            ),
          }))}
        />
      </Drawer>

      <Box as="main" flex="1" minH="0">
        <Splitter
          start={questionPane}
          end={editorPane}
          defaultSize={[45, 55]}
          minSize={25}
          resizeLabel={messages.nav.resizePanes}
        />
      </Box>

      <Dialog
        open={answerOpen}
        onOpenChange={setAnswerOpen}
        title={messages.question.answerTitle}
        size="lg"
        scrollBehavior="inside"
        footer={<DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>}
      >
        <Markdown>{question.answer}</Markdown>
      </Dialog>

      <Dialog
        open={result !== null}
        onOpenChange={(open) => {
          if (!open) onResultClose();
        }}
        title={messages.result.title}
        footer={resultFooter}
      >
        {result && (
          <VStack align="start" gap="3">
            <StatusBadge status={verdictStatus[result.verdict]}>
              {verdictLabels[result.verdict]}
            </StatusBadge>
            <Text>{result.comment}</Text>
          </VStack>
        )}
      </Dialog>
    </Flex>
  );
}
