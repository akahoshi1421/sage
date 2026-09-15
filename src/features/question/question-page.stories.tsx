import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { MarkResult, Verdict } from "#/features/questions/types";
import { questionDetailFixture, questionsFixture } from "#/test/fixtures/questions";

import { QuestionPage } from "./question-page";

const meta = {
  title: "Pages/QuestionPage",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const questionHref = (question: { slug: string }) => `/questions/${question.slug}`;

const comments: Record<Verdict, string> = {
  correct: "`ref` と `.value` の使い方が正しく理解できています。",
  close: "`count` の更新はできていますが、`.value` を介さずに代入している箇所があります。",
  incorrect: '`ref` が使われていません。`import { ref } from "vue"` から始めてみましょう。',
};

/** 回答ボタンを押すと擬似的に採点して結果を返すデモ */
function QuestionPageDemo({ verdict }: { verdict: Verdict }) {
  const [code, setCode] = useState(questionDetailFixture.answerCode);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MarkResult | null>(null);

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setResult({ verdict, comment: comments[verdict] });
    }, 800);
  };

  return (
    <QuestionPage
      question={questionDetailFixture}
      questions={questionsFixture}
      questionHref={questionHref}
      code={code}
      onCodeChange={setCode}
      onSave={() => {}}
      onReset={() => setCode(questionDetailFixture.templateCode)}
      onSubmit={submit}
      submitting={submitting}
      result={result}
      onResultClose={() => setResult(null)}
      nextQuestionHref="/questions/8-computed"
    />
  );
}

export const Correct: Story = {
  name: "既定 (回答すると正解になる)",
  render: () => <QuestionPageDemo verdict="correct" />,
};

export const Close: Story = {
  name: "回答すると惜しいになる",
  render: () => <QuestionPageDemo verdict="close" />,
};

export const Incorrect: Story = {
  name: "回答すると不正解になる",
  render: () => <QuestionPageDemo verdict="incorrect" />,
};

export const ResultOpen: Story = {
  name: "採点結果ダイアログを開いた状態 (正解)",
  render: () => (
    <QuestionPage
      question={questionDetailFixture}
      questions={questionsFixture}
      questionHref={questionHref}
      code={questionDetailFixture.answerCode}
      onCodeChange={() => {}}
      onSave={() => {}}
      onReset={() => {}}
      onSubmit={() => {}}
      result={{ verdict: "correct", comment: comments.correct }}
      onResultClose={() => {}}
      nextQuestionHref="/questions/8-computed"
    />
  ),
};

export const Submitting: Story = {
  name: "採点中",
  render: () => (
    <QuestionPage
      question={questionDetailFixture}
      questions={questionsFixture}
      questionHref={questionHref}
      code={questionDetailFixture.answerCode}
      onCodeChange={() => {}}
      onSave={() => {}}
      onReset={() => {}}
      onSubmit={() => {}}
      submitting
      result={null}
      onResultClose={() => {}}
    />
  ),
};
