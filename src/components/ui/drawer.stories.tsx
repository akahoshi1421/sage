import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Accordion } from "./accordion";
import { Drawer } from "./drawer";
import { HamburgerMenuButton } from "./hamburger-menu-button";
import { Box, Flex } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: false,
    onOpenChange: () => {},
    title: "問題一覧",
    children: "内容",
  },
  argTypes: {
    placement: { control: "radio", options: ["start", "end"] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const questionList = (titles: string[]) => (
  <Box as="ol" pl="lg">
    {titles.map((title) => (
      <Box key={title} as="li" py="xs">
        <Text as="span" size="sm">
          {title}
        </Text>
      </Box>
    ))}
  </Box>
);

const questionMenu = (
  <Accordion
    defaultValue={["warm-up"]}
    items={[
      {
        value: "warm-up",
        title: "warm-up",
        content: questionList(["Hello World", "リアクティブな値"]),
      },
      { value: "easy", title: "easy", content: questionList(["算出プロパティ", "ウォッチャー"]) },
      { value: "medium", title: "medium", content: questionList(["コンポーネント間の通信"]) },
    ]}
  />
);

export const FromStart: Story = {
  name: "左から (問題一覧)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Flex p="md">
        <Drawer
          {...args}
          open={open}
          onOpenChange={setOpen}
          placement="start"
          title="問題一覧"
          trigger={<HamburgerMenuButton />}
        >
          {questionMenu}
        </Drawer>
      </Flex>
    );
  },
};

export const FromEnd: Story = {
  name: "右から",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Flex p="md" justify="flex-end">
        <Drawer
          {...args}
          open={open}
          onOpenChange={setOpen}
          placement="end"
          title="問題一覧"
          trigger={<HamburgerMenuButton />}
        >
          {questionMenu}
        </Drawer>
      </Flex>
    );
  },
};

export const IconOnlyTrigger: Story = {
  name: "アイコンのみのボタンから開く",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Flex p="md">
        <Drawer
          {...args}
          open={open}
          onOpenChange={setOpen}
          placement="start"
          title="問題一覧"
          trigger={<HamburgerMenuButton iconOnly label="問題一覧を開く" />}
        >
          {questionMenu}
        </Drawer>
      </Flex>
    );
  },
};
