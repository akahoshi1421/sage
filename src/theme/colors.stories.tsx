import { Box, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { dadsTokens } from "./dads-tokens";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ScaleProps = { name: string; scale: Record<string, string> };

const Swatch = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Box h="12" rounded="8" bg={value} borderWidth="1px" borderColor="border.muted" />
    <Text textStyle="dns-14N-130" mt="1">
      {label}
    </Text>
    <Text textStyle="mono-14N-150" color="fg.muted">
      {value}
    </Text>
  </Box>
);

const ColorScale = ({ name, scale }: ScaleProps) => (
  <Stack gap="2">
    <Heading as="h3" textStyle="std-18B-160">
      {name}
    </Heading>
    <Grid templateColumns="repeat(auto-fill, minmax(6rem, 1fr))" gap="3">
      {Object.entries(scale).map(([key, value]) => (
        <Swatch key={key} label={`${name}.${key}`} value={value} />
      ))}
    </Grid>
  </Stack>
);

const { primitive, neutral, semantic } = dadsTokens.color;

export const Primitive: Story = {
  name: "プリミティブカラー",
  render: () => (
    <Stack gap="8">
      {Object.entries(primitive).map(([name, scale]) => (
        <ColorScale key={name} name={name} scale={scale} />
      ))}
    </Stack>
  ),
};

export const Neutral: Story = {
  name: "ニュートラルカラー",
  render: () => (
    <Stack gap="8">
      <Flex gap="3">
        <Box w="24">
          <Swatch label="white" value={neutral.white} />
        </Box>
        <Box w="24">
          <Swatch label="black" value={neutral.black} />
        </Box>
      </Flex>
      <ColorScale name="solidGray" scale={neutral.solidGray} />
      <ColorScale name="opacityGray" scale={neutral.opacityGray} />
    </Stack>
  ),
};

export const Semantic: Story = {
  name: "セマンティックカラー",
  render: () => (
    <Stack gap="8">
      <ColorScale name="key" scale={dadsTokens.color.key} />
      <ColorScale name="success" scale={semantic.success} />
      <ColorScale name="error" scale={semantic.error} />
      <ColorScale name="warning.yellow" scale={semantic.warning.yellow} />
      <ColorScale name="warning.orange" scale={semantic.warning.orange} />
    </Stack>
  ),
};
