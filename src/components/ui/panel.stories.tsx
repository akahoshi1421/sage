import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, HStack, VStack } from "./layout";
import { Panel } from "./panel";
import { Text } from "./text";

const meta = {
  title: "UI/Panel",
  component: Panel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    variant: "outline",
    size: "md",
    title: "warm-up",
    children: "パネルの中身",
  },
  argTypes: {
    variant: { control: "radio", options: ["outline", "subtle", "plain"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: "バリエーション",
  render: () => (
    <HStack gap="4" align="stretch" wrap="wrap">
      <Panel variant="outline" title="outline">
        <Text>枠線付き (既定)</Text>
      </Panel>
      <Panel variant="subtle" title="subtle">
        <Text>薄い背景</Text>
      </Panel>
      <Panel variant="plain" title="plain">
        <Text>装飾なし</Text>
      </Panel>
    </HStack>
  ),
};

export const Sizes: Story = {
  name: "余白のサイズ",
  render: () => (
    <VStack gap="4" align="stretch">
      <Panel size="sm" title="sm">
        <Text>余白 12px</Text>
      </Panel>
      <Panel size="md" title="md">
        <Text>余白 16px</Text>
      </Panel>
      <Panel size="lg" title="lg">
        <Text>余白 24px</Text>
      </Panel>
    </VStack>
  ),
};

export const WithoutTitle: Story = {
  name: "タイトルなし",
  args: { title: undefined },
};

export const Scrollable: Story = {
  name: "内側だけスクロール (問題一覧のカード)",
  render: () => (
    <Box h="16rem" w="20rem">
      <Panel title="easy" scrollable h="100%">
        <VStack as="ol" align="stretch" gap="2" pl="6">
          {Array.from({ length: 20 }, (_, index) => (
            <Text key={index} as="li">
              問題のタイトル {index + 1}
            </Text>
          ))}
        </VStack>
      </Panel>
    </Box>
  ),
};
