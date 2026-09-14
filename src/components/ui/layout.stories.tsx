import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Container, Flex, Grid, GridItem, HStack, Spacer, VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "Layout/Layout",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** ストーリー内で領域を見せるための枠 (レイアウト部品自体に色は付かない) */
const Block = ({ children }: { children: string }) => (
  <Box p="md" minW="6rem" className="layout-demo-block">
    <Text size="xs" align="center">
      {children}
    </Text>
  </Box>
);

const demoStyle = `
  .layout-demo-block { background: #e8f1fe; border: 1px solid #9db7f9; border-radius: 0.25rem; }
`;

export const StackStory: Story = {
  name: "Stack / HStack / VStack",
  render: () => (
    <VStack align="stretch" gap="xl">
      <style>{demoStyle}</style>
      <VStack align="start" gap="sm">
        <Text weight="bold">HStack (gap=4)</Text>
        <HStack gap="md">
          <Block>1</Block>
          <Block>2</Block>
          <Block>3</Block>
        </HStack>
      </VStack>
      <VStack align="start" gap="sm">
        <Text weight="bold">VStack (gap=2)</Text>
        <VStack gap="sm" align="start">
          <Block>1</Block>
          <Block>2</Block>
          <Block>3</Block>
        </VStack>
      </VStack>
    </VStack>
  ),
};

export const FlexStory: Story = {
  name: "Flex + Spacer",
  render: () => (
    <Flex align="center" gap="md">
      <style>{demoStyle}</style>
      <Block>左</Block>
      <Spacer />
      <Block>右</Block>
    </Flex>
  ),
};

export const GridStory: Story = {
  name: "Grid",
  render: () => (
    <Grid templateColumns="repeat(3, 1fr)" gap="md">
      <style>{demoStyle}</style>
      <GridItem colSpan={2}>
        <Block>colSpan=2</Block>
      </GridItem>
      <Block>1</Block>
      <Block>2</Block>
      <Block>3</Block>
      <Block>4</Block>
    </Grid>
  ),
};

export const ContainerStory: Story = {
  name: "Container",
  render: () => (
    <Container maxW="4xl">
      <style>{demoStyle}</style>
      <Block>maxW=4xl の中央寄せコンテナ</Block>
    </Container>
  ),
};
