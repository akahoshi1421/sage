import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./heading";
import { VStack } from "./layout";

const meta = {
  title: "UI/Heading",
  component: Heading,
  tags: ["autodocs"],
  args: {
    level: "h2",
    size: "24",
    children: "見出しのサンプル",
    chip: false,
  },
  argTypes: {
    level: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    size: {
      control: "select",
      options: ["64", "57", "45", "36", "32", "28", "24", "20", "18", "16"],
    },
    rule: { control: "select", options: [undefined, "8", "6", "4", "2"] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <VStack align="stretch" gap="lg">
      {(["64", "57", "45", "36", "32", "28", "24", "20", "18", "16"] as const).map((size) => (
        <Heading key={size} level="h2" size={size}>
          見出し {size}
        </Heading>
      ))}
    </VStack>
  ),
};

export const WithChip: Story = {
  name: "チップ付き",
  render: () => (
    <VStack align="stretch" gap="lg">
      <Heading level="h2" size="32" chip>
        チップ付きの見出し
      </Heading>
      <Heading level="h3" size="24" chip>
        チップ付きの見出し
      </Heading>
    </VStack>
  ),
};

export const WithRule: Story = {
  name: "罫線付き",
  render: () => (
    <VStack align="stretch" gap="xl">
      <Heading level="h2" size="36" rule="8">
        罫線 8
      </Heading>
      <Heading level="h2" size="28" rule="4">
        罫線 4
      </Heading>
      <Heading level="h3" size="20" rule="2">
        罫線 2
      </Heading>
    </VStack>
  ),
};
