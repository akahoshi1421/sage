import type { Meta, StoryObj } from "@storybook/react-vite";

import { HStack } from "./layout";
import { StatusBadge } from "./status-badge";
import { Text } from "./text";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  args: {
    children: "未回答",
    status: "neutral",
  },
  argTypes: {
    status: { control: "radio", options: ["neutral", "success", "warning", "error"] },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  name: "状態",
  render: () => (
    <HStack gap="md" wrap="wrap">
      <StatusBadge status="neutral">未回答</StatusBadge>
      <StatusBadge status="success">正解</StatusBadge>
      <StatusBadge status="warning">惜しい</StatusBadge>
      <StatusBadge status="error">不正解</StatusBadge>
    </HStack>
  ),
};

export const WithLabel: Story = {
  name: "見出しの横に付ける",
  render: () => (
    <HStack gap="sm" align="center">
      <Text size="xl" weight="bold">
        warm-up 1. Hello World
      </Text>
      <StatusBadge status="success">正解</StatusBadge>
    </HStack>
  ),
};
