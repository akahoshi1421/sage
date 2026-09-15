import { createFileRoute } from "@tanstack/react-router";

import { TopPage } from "#/features/top/top-page";
import { getTopPageData } from "#/server/functions";

export const Route = createFileRoute("/")({
  loader: () => getTopPageData(),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.subject.name} | sage` : "sage" }],
  }),
  component: Home,
});

function Home() {
  const { subject, questions } = Route.useLoaderData();
  return (
    <TopPage
      subject={subject}
      questions={questions}
      questionHref={(question) => `/questions/${question.slug}`}
    />
  );
}
