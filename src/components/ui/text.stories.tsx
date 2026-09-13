import type { Meta, StoryObj } from "@storybook/react-vite";

import { VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children:
      "vue.js は、ユーザーインターフェース構築のための、親しみやすく、パフォーマンスと汎用性の高いフレームワークです。",
    textStyle: "std-16N-170",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "muted", "subtle", "error", "success", "warning", "info", "link"],
    },
    align: { control: "radio", options: ["start", "center", "end"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  name: "文字色",
  render: () => (
    <VStack align="start" gap="2">
      <Text>default: 本文の文字色</Text>
      <Text color="muted">muted: 補足説明などの控えめな文字色</Text>
      <Text color="subtle">subtle: さらに控えめな文字色 (大きな文字向け)</Text>
      <Text color="error">error: エラーメッセージ</Text>
      <Text color="success">success: 成功メッセージ</Text>
      <Text color="warning">warning: 警告メッセージ</Text>
      <Text color="info">info: 情報メッセージ</Text>
      <Text color="link">link: リンクの文字色</Text>
    </VStack>
  ),
};

export const Truncate: Story = {
  name: "省略表示",
  render: () => (
    <VStack align="stretch" gap="4" maxW="20rem">
      <Text truncate>1 行に収まらない長いテキストは末尾が省略記号で省略されます。</Text>
      <Text lineClamp={2}>
        指定した行数を超えるテキストは省略記号で省略されます。指定した行数を超えるテキストは省略記号で省略されます。指定した行数を超えるテキストは省略記号で省略されます。
      </Text>
    </VStack>
  ),
};
