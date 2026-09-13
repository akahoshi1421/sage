import type { Meta, StoryObj } from "@storybook/react-vite";

import type { QuestionSummary } from "#/features/questions/types";
import { questionsFixture, subjectFixture } from "#/test/fixtures/questions";

import { TopPage } from "./top-page";

const meta = {
  title: "Pages/TopPage",
  component: TopPage,
  parameters: { layout: "fullscreen" },
  args: {
    subject: subjectFixture,
    questions: questionsFixture,
    questionHref: (question) => `/questions/${question.slug}`,
  },
} satisfies Meta<typeof TopPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定",
};

const manyQuestions: QuestionSummary[] = [
  ...questionsFixture,
  ...Array.from({ length: 24 }, (_, index) => {
    const number = 100 + index;
    return {
      number,
      slug: `${number}-extra`,
      title: `easy の追加問題 ${index + 1}: 長いタイトルは折り返して表示されます`,
      difficulty: "easy" as const,
      solved: index % 3 === 0,
    };
  }),
  {
    number: 200,
    slug: "200-extreme",
    title: "extreme の問題",
    difficulty: "extreme",
    solved: false,
  },
];

export const ManyQuestions: Story = {
  name: "問題が多い場合 (列の縦スクロール・横スクロール)",
  args: { questions: manyQuestions },
};

export const Empty: Story = {
  name: "問題がない場合",
  args: { questions: [] },
};
