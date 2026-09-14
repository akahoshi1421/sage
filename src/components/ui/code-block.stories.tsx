import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock } from "./code-block";
import { VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    language: "ts",
    code: `export const add = (a: number, b: number): number => {
  return a + b;
};`,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const samples = [
  {
    language: "ts",
    label: "TypeScript",
    code: `import { ref } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => {
    count.value++;
  };
  return { count, increment };
}`,
  },
  {
    language: "vue",
    label: "Vue (template.vue)",
    code: `<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>`,
  },
  {
    language: "python",
    label: "Python",
    code: `import numpy as np

def normalize(values: list[float]) -> np.ndarray:
    array = np.asarray(values, dtype=float)
    return (array - array.mean()) / array.std()`,
  },
  {
    language: "sh",
    label: "シェル",
    code: `#!/usr/bin/env bash
set -euo pipefail

npm ci
npm run storybook -- --port 6006`,
  },
  {
    language: "json",
    label: "JSON",
    code: `{
  "name": "sage",
  "difficulty": ["warm-up", "easy", "medium", "hard", "extreme"],
  "solved": true
}`,
  },
];

export const Languages: Story = {
  name: "言語ごとの色分け",
  render: () => (
    <VStack align="stretch" gap="6">
      {samples.map((sample) => (
        <VStack key={sample.language} align="stretch" gap="2">
          <Text textStyle="std-16B-170">{sample.label}</Text>
          <CodeBlock code={sample.code} language={sample.language} />
        </VStack>
      ))}
    </VStack>
  ),
};

export const Unsupported: Story = {
  name: "対応していない言語 (そのまま表示)",
  args: {
    language: "not-a-language",
    code: `これは shiki が知らない言語のコードです。
色分けはされませんが、内容はそのまま等幅で表示されます。`,
  },
};

export const NoLanguage: Story = {
  name: "言語の指定なし",
  args: {
    language: undefined,
    code: `言語を指定しないコードブロックです。`,
  },
};

export const LongLines: Story = {
  name: "長い行 (横スクロール)",
  args: {
    language: "ts",
    code: `export const questions = [{ number: 1, slug: "1-hello-world", title: "Hello World", difficulty: "warm-up", solved: true }, { number: 2, slug: "2-text-interpolation", title: "テキスト補間", difficulty: "warm-up", solved: false }];`,
  },
};
