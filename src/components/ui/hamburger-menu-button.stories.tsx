import type { Meta, StoryObj } from "@storybook/react-vite";

import { HamburgerMenuButton } from "./hamburger-menu-button";
import { HStack } from "./layout";

const meta = {
  title: "UI/HamburgerMenuButton",
  component: HamburgerMenuButton,
  tags: ["autodocs"],
  args: {
    label: "メニュー",
    icon: "hamburger",
    iconOnly: false,
  },
  argTypes: {
    icon: { control: "radio", options: ["hamburger", "close"] },
  },
} satisfies Meta<typeof HamburgerMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  name: "バリエーション",
  render: () => (
    <HStack gap="6" wrap="wrap">
      <HamburgerMenuButton />
      <HamburgerMenuButton icon="close" label="閉じる" />
      <HamburgerMenuButton iconOnly label="メニューを開く" />
      <HamburgerMenuButton iconOnly icon="close" label="メニューを閉じる" />
    </HStack>
  ),
};
