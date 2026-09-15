import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkmark } from "./checkmark";
import { HStack, VStack } from "./layout";
import { Link } from "./link";
import { List, ListItem } from "./list";
import { Text } from "./text";

const meta = {
  title: "UI/Checkmark",
  component: Checkmark,
  tags: ["autodocs"],
  args: {
    checked: true,
    label: "正解済み",
    size: "sm",
    disabled: false,
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Checkmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  name: "状態",
  render: () => (
    <HStack gap="lg" wrap="wrap">
      <HStack gap="sm" align="center">
        <Checkmark checked label="正解済み" />
        <Text>正解済み (checked)</Text>
      </HStack>
      <HStack gap="sm" align="center">
        <Checkmark checked={false} label="未回答" />
        <Text>未回答 (unchecked)</Text>
      </HStack>
      <HStack gap="sm" align="center">
        <Checkmark checked disabled label="正解済み (無効)" />
        <Text>無効 (checked)</Text>
      </HStack>
      <HStack gap="sm" align="center">
        <Checkmark checked={false} disabled label="未回答 (無効)" />
        <Text>無効 (unchecked)</Text>
      </HStack>
    </HStack>
  ),
};

export const Sizes: Story = {
  name: "サイズ",
  render: () => (
    <VStack align="start" gap="md">
      {(["sm", "md", "lg"] as const).map((size) => (
        <HStack key={size} gap="md" align="center">
          <Checkmark checked size={size} label="正解済み" />
          <Checkmark checked={false} size={size} label="未回答" />
          <Text>{size}</Text>
        </HStack>
      ))}
    </VStack>
  ),
};

export const InQuestionList: Story = {
  name: "問題一覧での使用例",
  render: () => (
    <List as="ol" spacing="xs">
      <ListItem>
        <Checkmark checked label="正解済み" /> <Link href="#">Hello World</Link>
      </ListItem>
      <ListItem>
        <Checkmark checked label="正解済み" /> <Link href="#">テキスト補間</Link>
      </ListItem>
      <ListItem>
        <Checkmark checked={false} label="未回答" /> <Link href="#">v-bind で属性を束縛する</Link>
      </ListItem>
    </List>
  ),
};
