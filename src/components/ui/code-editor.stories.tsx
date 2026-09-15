import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { CodeEditor, languageFromFilename } from "./code-editor";
import { Box } from "./layout";

const meta = {
  title: "UI/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    onChange: fn(),
    onSave: fn(),
  },
  decorators: [
    (Story) => (
      <Box h="24rem">
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof CodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const templateTs = `// template.ts
// 問題: 2 つの数値を受け取り、合計を返す関数 add を実装してください。

export const add = (a: number, b: number): number => {
  // ここに実装を書く
  return 0;
};
`;

const templatePy = `# template.py
# 問題: リストの平均値を返す関数 mean を実装してください。

def mean(values: list[float]) -> float:
    ...
`;

export const TypeScript: Story = {
  name: "TypeScript (template.ts)",
  args: {
    value: templateTs,
    language: languageFromFilename("template.ts"),
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <CodeEditor
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const Python: Story = {
  name: "Python (template.py)",
  args: {
    value: templatePy,
    language: languageFromFilename("template.py"),
  },
};

export const ReadOnly: Story = {
  name: "読み取り専用",
  args: {
    value: templateTs,
    language: "typescript",
    readOnly: true,
  },
};
