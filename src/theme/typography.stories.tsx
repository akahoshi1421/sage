import { Box, Stack, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DADS_TEXT_STYLE_NAMES, type DadsTextStyle } from "./text-styles";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE =
  "あらゆる技術を、問いを解きながら学ぶ。 The quick brown fox jumps over the lazy dog.";

const Sample = ({ name }: { name: DadsTextStyle }) => (
  <Box borderBottomWidth="1px" borderColor="border.subtle" py="3">
    <Text textStyle="mono-14N-150" color="fg.muted">
      {name}
    </Text>
    <Text textStyle={name}>{SAMPLE}</Text>
  </Box>
);

const byFamily = (prefix: string) => DADS_TEXT_STYLE_NAMES.filter((n) => n.startsWith(prefix));

const Family = ({ title, prefix }: { title: string; prefix: string }) => (
  <Stack gap="0">
    <Text textStyle="std-20B-160" mb="2">
      {title}
    </Text>
    {byFamily(prefix).map((name) => (
      <Sample key={name} name={name} />
    ))}
  </Stack>
);

export const Display: Story = {
  name: "Display (dsp)",
  render: () => <Family title="Display" prefix="dsp-" />,
};

export const Standard: Story = {
  name: "Standard (std)",
  render: () => <Family title="Standard" prefix="std-" />,
};

export const Dense: Story = {
  name: "Dense (dns)",
  render: () => <Family title="Dense" prefix="dns-" />,
};

export const Oneline: Story = {
  name: "Oneline (oln)",
  render: () => <Family title="Oneline" prefix="oln-" />,
};

export const Mono: Story = {
  name: "Mono (mono)",
  render: () => <Family title="Mono" prefix="mono-" />,
};
