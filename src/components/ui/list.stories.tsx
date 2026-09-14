import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "./icon";
import { HStack, VStack } from "./layout";
import { Link } from "./link";
import { List, ListItem } from "./list";
import { Text } from "./text";

const meta = {
  title: "UI/List",
  component: List,
  tags: ["autodocs"],
  args: {
    as: "ul",
    spacing: "none",
  },
  argTypes: {
    as: { control: "radio", options: ["ul", "ol"] },
    marker: { control: "radio", options: [undefined, "disc", "decimal", "none"] },
    spacing: { control: "radio", options: ["none", "xs", "sm", "md"] },
  },
  render: (args) => (
    <List {...args}>
      <ListItem>Hello World</ListItem>
      <ListItem>Reactive State</ListItem>
      <ListItem>Computed Properties</ListItem>
    </List>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Ordered: Story = {
  name: "番号付き",
  args: { as: "ol" },
};

export const Nested: Story = {
  name: "入れ子",
  render: () => (
    <List spacing="xs">
      <ListItem>
        warm-up
        <List spacing="xs">
          <ListItem>Hello World</ListItem>
          <ListItem>Reactive State</ListItem>
        </List>
      </ListItem>
      <ListItem>
        easy
        <List spacing="xs">
          <ListItem>Computed Properties</ListItem>
          <ListItem>Watchers</ListItem>
        </List>
      </ListItem>
    </List>
  ),
};

export const Spacing: Story = {
  name: "項目間の余白",
  render: () => (
    <HStack align="start" gap="xl">
      {(["none", "xs", "sm", "md"] as const).map((spacing) => (
        <VStack key={spacing} align="start" gap="sm">
          <Text weight="bold">spacing={spacing}</Text>
          <List spacing={spacing}>
            <ListItem>Hello World</ListItem>
            <ListItem>Reactive State</ListItem>
            <ListItem>Computed Properties</ListItem>
          </List>
        </VStack>
      ))}
    </HStack>
  ),
};

export const QuestionList: Story = {
  name: "問題一覧 (正解済みにチェック)",
  render: () => (
    <List as="ol" spacing="xs">
      <ListItem>
        <HStack gap="xs" as="span" display="inline-flex" align="center">
          <Icon name="complete_fill" size="sm" label="正解済み" />
          <Link href="#">Hello World</Link>
        </HStack>
      </ListItem>
      <ListItem>
        <HStack gap="xs" as="span" display="inline-flex" align="center">
          <Icon name="complete_fill" size="sm" label="正解済み" />
          <Link href="#">Reactive State</Link>
        </HStack>
      </ListItem>
      <ListItem>
        <Link href="#">Computed Properties</Link>
      </ListItem>
    </List>
  ),
};
