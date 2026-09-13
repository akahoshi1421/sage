import type { Meta, StoryObj } from "@storybook/react-vite";

import { Markdown } from "./markdown";

const meta = {
  title: "UI/Markdown",
  component: Markdown,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const question = `# 1. Hello World

Vue のコンポーネントを作成し、画面に **Hello World** と表示してください。

## 要件

- \`template.vue\` の \`<template>\` に見出し (\`<h1>\`) を追加する
- 見出しの文言は \`Hello World\` とする
- \`<script setup>\` は変更しなくてよい

## 補足

1. まずは公式ドキュメントの [はじめに](https://ja.vuejs.org/guide/introduction) を読みましょう
2. 分からなければ [ヒント](#hint) を開いてください

\`\`\`vue
<script setup lang="ts">
const message = "Hello World";
</script>

<template>
  <!-- ここに見出しを追加 -->
</template>
\`\`\`
`;

const answer = `## 解答

\`\`\`vue
<script setup lang="ts">
const message = "Hello World";
</script>

<template>
  <h1>{{ message }}</h1>
</template>
\`\`\`

## 解説

\`{{ }}\` (マスタッシュ構文) を使うと、\`<script setup>\` で宣言した変数をそのまま描画できます。

| 構文 | 用途 |
| --- | --- |
| \`{{ value }}\` | テキストとして描画する |
| \`v-bind:attr="value"\` | 属性に値を束縛する |
| \`v-html="value"\` | HTML として描画する (注意して使う) |

> テンプレート内では JavaScript の式が書けますが、複雑なロジックは \`computed\` に切り出しましょう。
`;

const elements = `# 見出し 1

## 見出し 2

### 見出し 3

#### 見出し 4

##### 見出し 5

###### 見出し 6

段落のテキストです。**太字**、*斜体*、~~取り消し線~~、\`インラインコード\`、[内部リンク](#top)、[外部リンク](https://design.digital.go.jp/dads/) を含みます。

- 箇条書き 1
- 箇条書き 2
  - 入れ子の箇条書き
- [x] 完了したタスク
- [ ] 未完了のタスク

1. 番号付き 1
2. 番号付き 2

> 引用のテキストです。

---

| 列 A | 列 B | 列 C |
| --- | --- | --- |
| a | b | c |
| d | e | f |

\`\`\`ts
export const add = (a: number, b: number): number => a + b;
\`\`\`
`;

export const Question: Story = {
  name: "問題文 (QUESTION.md)",
  args: { children: question },
};

export const Answer: Story = {
  name: "解答と解説 (ANSWER.md)",
  args: { children: answer },
};

export const Elements: Story = {
  name: "全要素",
  args: { children: elements },
};
