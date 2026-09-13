import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Icon } from "./icon";
import { HStack, VStack } from "./layout";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "ボタン",
    variant: "solid-fill",
    size: "md",
    disabled: false,
  },
  argTypes: {
    variant: { control: "radio", options: ["solid-fill", "outline", "text"] },
    size: { control: "radio", options: ["lg", "md", "sm", "xs"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: "バリエーション",
  render: () => (
    <HStack gap="4" wrap="wrap">
      <Button variant="solid-fill">塗りボタン</Button>
      <Button variant="outline">アウトラインボタン</Button>
      <Button variant="text">テキストボタン</Button>
    </HStack>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <VStack align="start" gap="6">
      {(["solid-fill", "outline", "text"] as const).map((variant) => (
        <HStack key={variant} gap="4" align="center" wrap="wrap">
          <Button variant={variant} size="lg">
            Large
          </Button>
          <Button variant={variant} size="md">
            Medium
          </Button>
          <Button variant={variant} size="sm">
            Small
          </Button>
          <Button variant={variant} size="xs">
            X-Small
          </Button>
        </HStack>
      ))}
    </VStack>
  ),
};

export const Disabled: Story = {
  name: "無効",
  render: () => (
    <HStack gap="4" wrap="wrap">
      <Button variant="solid-fill" disabled>
        塗りボタン
      </Button>
      <Button variant="outline" disabled>
        アウトラインボタン
      </Button>
      <Button variant="text" disabled>
        テキストボタン
      </Button>
    </HStack>
  ),
};

export const WithIcon: Story = {
  name: "アイコン付き",
  render: () => (
    <HStack gap="4" wrap="wrap">
      <Button>
        <Icon name="complete_line" />
        回答する
      </Button>
      <Button variant="outline">
        次の問題へ
        <Icon name="arrow_right_line" />
      </Button>
      <Button variant="text" size="sm">
        <Icon name="help_line" size="sm" />
        ヒントを見る
      </Button>
    </HStack>
  ),
};

export const AsLink: Story = {
  name: "リンクをボタンとして表示",
  render: () => (
    <Button asChild variant="outline">
      <a href="#next">次の問題へ</a>
    </Button>
  ),
};
