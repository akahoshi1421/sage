import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppFooter } from "./app-footer";

const meta = {
  title: "UI/AppFooter",
  component: AppFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "既定 (GitHub へのリンク)",
};

export const CustomLinks: Story = {
  name: "リンクを差し替え",
  args: {
    links: [
      { label: "GitHub", href: "https://github.com/akahoshi1421/sage" },
      { label: "デジタル庁デザインシステム", href: "https://design.digital.go.jp/dads/" },
      { label: "使い方", href: "/docs" },
    ],
  },
};

export const WithoutLinks: Story = {
  name: "リンクなし",
  args: { links: [] },
};
