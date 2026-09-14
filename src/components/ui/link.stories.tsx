import type { Meta, StoryObj } from "@storybook/react-vite";

import { VStack } from "./layout";
import { Link } from "./link";
import { Text } from "./text";

const meta = {
  title: "UI/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    href: "#",
    children: "リンクテキスト",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const External: Story = {
  name: "新規タブで開くリンク",
  render: () => (
    <Link href="https://design.digital.go.jp/dads/" target="_blank">
      デジタル庁デザインシステム
    </Link>
  ),
};

export const InText: Story = {
  name: "文中のリンク",
  render: () => (
    <VStack align="start" gap="md" maxW="40rem">
      <Text>
        <Link href="https://vuejs.org/" target="_blank">
          vue.js
        </Link>
        とは、ユーザーインターフェース構築のための JavaScript フレームワークです。
        <Link href="#">公式ドキュメント</Link>
        を読みながら問題を解いてみましょう。
      </Text>
      <Text color="muted">
        訪問済みは magenta、押下中は orange、フォーカス時は黄色の背景と黒い枠で表示されます。
      </Text>
    </VStack>
  ),
};

export const AsChild: Story = {
  name: "別のリンク部品をリンクの見た目で表示",
  render: () => (
    <Link asChild>
      <a href="#questions-1">warm-up 1. Hello World</a>
    </Link>
  ),
};
