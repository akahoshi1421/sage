import { createFileRoute, notFound } from "@tanstack/react-router";

import { useEditorAdapter } from "#/features/question/hooks/use-editor-adapter";
import { useQuestionEditor } from "#/features/question/hooks/use-question-editor";
import { QuestionPage } from "#/features/question/question-page";
import type { LanguageServerSpec } from "#/features/question/utils/load-editor-adapter";
import { nextQuestionHrefOf } from "#/features/question/utils/next-question-href";
import type { QuestionDetail, QuestionSummary } from "#/features/questions/types";
import { getQuestionPageData } from "#/server/functions";

export const Route = createFileRoute("/questions/$slug")({
  loader: async ({ params }) => {
    const data = await getQuestionPageData({ data: params.slug });
    if (!data.question) throw notFound();
    return {
      question: data.question,
      questions: data.questions,
      rootUri: data.rootUri,
      languageServer: data.languageServer,
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.question.title} | sage` : "sage" }],
  }),
  component: QuestionRoute,
});

const questionHref = (question: QuestionSummary) => `/questions/${question.slug}`;

function QuestionRoute() {
  const { question, questions, rootUri, languageServer } = Route.useLoaderData();
  // 問題が変わったらエディタの状態を作り直す
  return (
    <QuestionEditor
      key={question.slug}
      question={question}
      questions={questions}
      rootUri={rootUri}
      languageServer={languageServer}
    />
  );
}

function QuestionEditor({
  question,
  questions,
  rootUri,
  languageServer,
}: {
  question: QuestionDetail;
  questions: QuestionSummary[];
  rootUri: string;
  languageServer: LanguageServerSpec | null;
}) {
  const editor = useQuestionEditor(question);
  const adapter = useEditorAdapter(question, rootUri, languageServer);

  return (
    <QuestionPage
      question={question}
      questions={questions}
      questionHref={questionHref}
      code={editor.code}
      onCodeChange={editor.setCode}
      dirty={editor.dirty}
      onSave={editor.save}
      rootUri={rootUri}
      onEditorMount={adapter.onMount}
      languageServer={adapter.languageServer}
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
