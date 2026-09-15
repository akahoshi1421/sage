import { createFileRoute, notFound } from "@tanstack/react-router";

import { useQuestionEditor } from "#/features/question/hooks/use-question-editor";
import { QuestionPage } from "#/features/question/question-page";
import { nextQuestionHrefOf } from "#/features/question/utils/next-question-href";
import type { QuestionDetail, QuestionSummary } from "#/features/questions/types";
import { getQuestionPageData } from "#/server/functions";

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
  const editor = useQuestionEditor(question);

  return (
    <QuestionPage
      question={question}
      questions={questions}
      questionHref={questionHref}
      code={editor.code}
      onCodeChange={editor.setCode}
      onSave={editor.save}
      onReset={editor.reset}
      onSubmit={editor.submit}
      submitting={editor.submitting}
      result={editor.result}
      onResultClose={editor.closeResult}
      nextQuestionHref={nextQuestionHrefOf(questions, question.number, questionHref)}
      errorMessage={editor.errorMessage}
    />
  );
}
