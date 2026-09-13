import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./divider";
import { VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: {
    color: "gray-420",
  },
  argTypes: {
    color: { control: "radio", options: ["gray-420", "gray-536", "black"] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Colors: Story = {
  name: "色",
  render: () => (
    <VStack align="stretch" gap="4">
      <Text>gray-420 (既定)</Text>
      <Divider color="gray-420" />
      <Text>gray-536</Text>
      <Divider color="gray-536" />
      <Text>black</Text>
      <Divider color="black" />
    </VStack>
  ),
};
