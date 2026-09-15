import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon, iconNames } from "./icon";
import { Grid, HStack, VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: {
    name: "menu_line",
    size: "md",
  },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const All: Story = {
  name: "一覧",
  render: () => (
    <Grid templateColumns="repeat(auto-fill, minmax(9rem, 1fr))" gap="md">
      {iconNames.map((name) => (
        <VStack key={name} gap="xs">
          <Icon name={name} size="lg" />
          <Text size="xs" color="muted">
            {name}
          </Text>
        </VStack>
      ))}
    </Grid>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <HStack gap="md" align="center">
      <Icon name="menu_line" size="sm" />
      <Icon name="menu_line" size="md" />
      <Icon name="menu_line" size="lg" />
    </HStack>
  ),
};

export const WithLabel: Story = {
  name: "意味を持つアイコン (ラベル付き)",
  render: () => (
    <HStack gap="sm" align="center">
      <Icon name="complete_fill" label="正解" />
      <Text>ラベルを付けると読み上げ対象になります</Text>
    </HStack>
  ),
};
