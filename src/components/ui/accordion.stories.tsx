import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion } from "./accordion";
import { Box, VStack } from "./layout";
import { Text } from "./text";

const questionList = (titles: string[]) => (
  <Box as="ol" pl="6">
    {titles.map((title) => (
      <Box key={title} as="li" py="1">
        <Text as="span" textStyle="dns-16N-130">
          {title}
        </Text>
      </Box>
    ))}
  </Box>
);

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    items: [
      {
        value: "hint",
        title: "ヒントを見る",
        content: (
          <VStack align="stretch" gap="2">
            <Text>配列の各要素を変換するには `map` を使います。</Text>
            <Text>戻り値の配列の長さは元の配列と同じになります。</Text>
          </VStack>
        ),
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Hint: Story = {
  name: "ヒントを見る (回答ページ)",
};

export const QuestionList: Story = {
  name: "問題一覧 (ドロワー内)",
  args: {
    defaultValue: ["warm-up"],
    items: [
      {
        value: "warm-up",
        title: "warm-up",
        content: questionList(["Hello World", "リアクティブな値"]),
      },
      {
        value: "easy",
        title: "easy",
        content: questionList(["算出プロパティ", "ウォッチャー", "条件付きレンダリング"]),
      },
      {
        value: "medium",
        title: "medium",
        content: questionList(["コンポーネント間の通信", "スロット"]),
      },
    ],
  },
};

export const Single: Story = {
  name: "同時に 1 つだけ開く",
  args: {
    multiple: false,
    items: [
      { value: "a", title: "質問 1", content: <Text>回答 1</Text> },
      { value: "b", title: "質問 2", content: <Text>回答 2</Text> },
      { value: "c", title: "質問 3", content: <Text>回答 3</Text> },
    ],
  },
};
