import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { QuestionPage } from "#/features/question/question-page";
import type { MarkResult, QuestionDetail, QuestionSummary } from "#/features/questions/types";
import { useMessages } from "#/i18n/locale";
import {
  getQuestionPageData,
  markQuestionFn,
  resetAnswerFn,
  saveAnswerFn,
} from "#/server/functions";

export const Route = createFileRoute("/questions/$slug")({
  loader: async ({ params }) => {
    const data = await getQuestionPageData({ data: params.slug });
    if (!data.question) throw notFound();
    return { question: data.question, questions: data.questions };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.question.title} | sage` : "sage" }],
  }),
  component: QuestionRoute,
});

const questionHref = (question: QuestionSummary) => `/questions/${question.slug}`;

/** 現在の問題の次 (番号順) の問題へのリンク先 */
function nextQuestionHrefOf(questions: QuestionSummary[], current: QuestionDetail) {
  const sorted = questions.toSorted((a, b) => a.number - b.number);
  const index = sorted.findIndex((question) => question.number === current.number);
  const next = index === -1 ? undefined : sorted[index + 1];
  return next ? questionHref(next) : undefined;
}

function QuestionRoute() {
  const { question, questions } = Route.useLoaderData();
  // 問題が変わったらエディタの状態を作り直す
  return <QuestionEditor key={question.slug} question={question} questions={questions} />;
}

function QuestionEditor({
  question,
  questions,
}: {
  question: QuestionDetail;
  questions: QuestionSummary[];
}) {
  const router = useRouter();
  const messages = useMessages();
  const [code, setCode] = useState(question.answerCode);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MarkResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const save = async (nextCode: string) => {
    await saveAnswerFn({ data: { slug: question.slug, code: nextCode } });
  };

  const reset = async () => {
    const restored = await resetAnswerFn({ data: question.slug });
    setCode(restored.code);
  };

  const submit = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await save(code);
      const outcome = await markQuestionFn({ data: question.slug });
      if (!outcome.ok) {
        setErrorMessage(`${messages.error.markFailed}: ${outcome.message}`);
        return;
      }
      setResult(outcome.result);
      if (outcome.result.verdict === "correct") {
        await router.invalidate();
      }
    } catch (error) {
      setErrorMessage(
        `${messages.error.markFailed}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QuestionPage
      question={question}
      questions={questions}
      questionHref={questionHref}
      code={code}
      onCodeChange={setCode}
      onSave={(saved) => void save(saved)}
      onReset={() => void reset()}
      onSubmit={() => void submit()}
      submitting={submitting}
      result={result}
      onResultClose={() => setResult(null)}
      nextQuestionHref={nextQuestionHrefOf(questions, question)}
      errorMessage={errorMessage}
    />
  );
}
