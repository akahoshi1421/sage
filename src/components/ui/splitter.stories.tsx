import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, VStack } from "./layout";
import { Splitter } from "./splitter";
import { Text } from "./text";

const meta = {
  title: "UI/Splitter",
  component: Splitter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    start: "左",
    end: "右",
    defaultSize: [50, 50],
    minSize: 20,
    orientation: "horizontal",
  },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
  decorators: [
    (Story) => (
      <Box h="28rem" p="md">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

const paragraphs = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <Text key={index}>
      これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
    </Text>
  ));

const questionPane = (
  <VStack align="stretch" gap="md" p="md">
    <Text size="xl" weight="bold">
      warm-up 1 Hello World
    </Text>
    {paragraphs(8)}
  </VStack>
);

const codePane = (
  <Box p="md">
    <Text as="span" size="sm">
      {"export const message = 'Hello World';"}
    </Text>
  </Box>
);

export const Playground: Story = {};

export const AnswerPage: Story = {
  name: "左右分割 (回答ページ)",
  args: {
    start: questionPane,
    end: codePane,
    defaultSize: [40, 60],
  },
};

export const Vertical: Story = {
  name: "上下分割",
  args: {
    start: questionPane,
    end: codePane,
    orientation: "vertical",
  },
};
