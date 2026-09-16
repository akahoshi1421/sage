import {
  Accordion,
  AppHeader,
  Box,
  Button,
  CodeEditor,
  type CodeEditorMount,
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
import type { MarkResult, QuestionDetail, QuestionSummary } from "#/features/questions/types";
import { useMessages } from "#/i18n/hooks/use-messages";

import { useQuestionPageDialogs } from "./hooks/use-question-page-dialogs";
import { verdictLabel, verdictStatus } from "./utils/verdict-status";

export type QuestionPageProps = {
  question: QuestionDetail;
  /** ドロワーの問題一覧に表示する全問題 */
  questions: QuestionSummary[];
  /** 問題の回答ページへのリンク先 */
  questionHref: (question: QuestionSummary) => string;
  /** エディタの内容 (制御コンポーネント) */
  code: string;
  onCodeChange: (code: string) => void;
  /** エディタの内容が保存済みの内容と違う (ファイル名の横に未保存の印を出す) */
  dirty?: boolean;
  /** Cmd/Ctrl+S で呼ばれる */
  onSave: (code: string) => void;
  /** エディタが用意できたときに呼ばれる (sage.editor.js のアダプタを適用する) */
  onEditorMount?: CodeEditorMount;
  /** 回答ファイルをテンプレートの内容に戻す (確認ダイアログで確定したときに呼ばれる) */
  onReset: () => void;
  /** 「回答」ボタンで呼ばれる (採点の開始) */
  onSubmit: () => void;
  /** 採点中 */
  submitting?: boolean;
  /** 採点結果 (null なら結果ダイアログを表示しない) */
  result: MarkResult | null;
  onResultClose: () => void;
  /** 正解時の「次の問題へ」のリンク先 (最後の問題なら省略) */
  nextQuestionHref?: string;
  /** 採点などに失敗したときのメッセージ (回答バーの上に表示) */
  errorMessage?: string | null;
};

/** 回答ページ: 左に問題文・ヒント・答え、右にコードエディタと回答ボタン */
export function QuestionPage({
  question,
  questions,
  questionHref,
  code,
  onCodeChange,
  dirty = false,
  onSave,
  onEditorMount,
  onReset,
  onSubmit,
  submitting = false,
  result,
  onResultClose,
  nextQuestionHref,
  errorMessage,
}: QuestionPageProps) {
  const messages = useMessages();
  const dialogs = useQuestionPageDialogs();
  const groups = groupQuestionsByDifficulty(questions);

  const questionPane = (
    <Box h="100%" overflowY="auto" px={{ base: "md", md: "lg" }} py="lg">
      <VStack align="stretch" gap="lg">
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
          <Button variant="outline" onClick={() => dialogs.answer.setOpen(true)}>
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
          language={languageFromFilename(question.answerFileName)}
          onChange={onCodeChange}
          onSave={onSave}
          onMount={onEditorMount}
          path={`file:///${question.answerFilePath}`}
          label={question.answerFileName}
        />
      </Box>
      <Box position="sticky" bottom="none">
        <Divider />
        {errorMessage && (
          <Box px="md" pt="sm">
            <Text role="alert" color="error" size="sm">
              {errorMessage}
            </Text>
          </Box>
        )}
        <Flex justify="space-between" align="center" gap="md" px="md" py="md">
          <Button variant="text" size="sm" onClick={() => dialogs.reset.setOpen(true)}>
            {messages.question.reset}
          </Button>
          <Flex align="center" gap="md">
            <Flex align="center" gap="xs">
              <Text as="span" color="muted" size="xs">
                {question.answerFileName}
              </Text>
              {dirty && (
                <Text
                  as="span"
                  color="muted"
                  size="xs"
                  // 文字記号に読み上げ名を付けるには role="img" が正しい (img 要素には置き換えられない)
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  role="img"
                  aria-label={messages.question.unsaved}
                  title={messages.question.unsaved}
                >
                  ●
                </Text>
              )}
            </Flex>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? messages.question.submitting : messages.question.submit}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );

  const resultFooter =
    result?.verdict === "correct" && nextQuestionHref ? (
      <>
        <DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>
        <Button href={nextQuestionHref}>{messages.question.next}</Button>
      </>
    ) : (
      <DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>
    );

  return (
    <Flex direction="column" h="100dvh">
      <AppHeader
        homeHref="/"
        startSlot={
          <HamburgerMenuButton
            label={messages.nav.menu}
            onClick={() => dialogs.menu.setOpen(true)}
          />
        }
      />
      <Drawer
        open={dialogs.menu.open}
        onOpenChange={dialogs.menu.setOpen}
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
        open={dialogs.answer.open}
        onOpenChange={dialogs.answer.setOpen}
        title={messages.question.answerTitle}
        size="lg"
        scrollBehavior="inside"
        footer={<DialogCloseButton variant="outline">{messages.nav.close}</DialogCloseButton>}
      >
        <Markdown>{question.answer}</Markdown>
      </Dialog>

      <Dialog
        open={dialogs.reset.open}
        onOpenChange={dialogs.reset.setOpen}
        role="alertdialog"
        title={messages.question.resetConfirmTitle}
        footer={
          <>
            <DialogCloseButton variant="outline">{messages.nav.cancel}</DialogCloseButton>
            <Button
              onClick={() => {
                onReset();
                dialogs.reset.setOpen(false);
              }}
            >
              {messages.question.resetConfirm}
            </Button>
          </>
        }
      >
        <Text>
          {messages.question.resetConfirmBody(question.answerFileName, question.templateFileName)}
        </Text>
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
          <VStack align="start" gap="md">
            <StatusBadge status={verdictStatus[result.verdict]}>
              {verdictLabel(messages, result.verdict)}
            </StatusBadge>
            <Text>{result.comment}</Text>
          </VStack>
        )}
      </Dialog>
    </Flex>
  );
}
