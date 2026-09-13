import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader } from "./app-header";
import { Button } from "./button";
import { Icon } from "./icon";
import { Box, VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "sage",
    homeHref: "#",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定 (トップページ)",
};

export const WithSlots: Story = {
  name: "メニューボタンと右端の要素 (回答ページ)",
  args: {
    startSlot: (
      <Button variant="text" size="sm" aria-label="メニューを開く">
        <Icon name="hamburger" />
      </Button>
    ),
    endSlot: (
      <Button variant="outline" size="sm">
        <Icon name="documents_line" size="sm" />
        問題一覧
      </Button>
    ),
  },
};

export const Sticky: Story = {
  name: "上部に固定",
  args: { sticky: true },
  render: (args) => (
    <VStack align="stretch" gap="0">
      <AppHeader {...args} />
      <Box p="6">
        <VStack align="start" gap="4">
          {Array.from({ length: 30 }, (_, index) => (
            <Text key={index}>スクロールしてもヘッダーが画面上部に残ります ({index + 1})</Text>
          ))}
        </VStack>
      </Box>
    </VStack>
  ),
};
