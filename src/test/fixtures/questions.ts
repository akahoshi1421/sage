import type { QuestionDetail, QuestionSummary, Subject } from "#/features/questions/types";

/** ストーリーやテストで使うダミーの学習対象 */
export const subjectFixture: Subject = {
  name: "vue.js",
  description: `[vue.js](https://vuejs.org/) は、ユーザーインターフェース構築のための、親しみやすく、パフォーマンスと汎用性の高いフレームワークです。

この教材では、テンプレート構文・リアクティビティ・コンポーネント設計を、問題を解きながら段階的に学びます。

- **warm-up**: テンプレート構文の基本
- **easy**: リアクティブな状態と算出プロパティ
- **medium**: コンポーネント間のデータ受け渡し
- **hard**: Composition API と再利用可能なロジック`,
};

/** ストーリーやテストで使うダミーの問題一覧 */
export const questionsFixture: QuestionSummary[] = [
  { number: 1, slug: "1-hello-world", title: "Hello World", difficulty: "warm-up", solved: true },
  {
    number: 2,
    slug: "2-text-interpolation",
    title: "テキスト補間",
    difficulty: "warm-up",
    solved: true,
  },
  {
    number: 3,
    slug: "3-v-bind",
    title: "v-bind で属性を束縛する",
    difficulty: "easy",
    solved: true,
  },
  { number: 4, slug: "4-v-if", title: "v-if で条件分岐する", difficulty: "easy", solved: true },
  {
    number: 5,
    slug: "5-v-for",
    title: "v-for でリストを描画する",
    difficulty: "easy",
    solved: true,
  },
  {
    number: 6,
    slug: "6-event-handling",
    title: "イベントを処理する",
    difficulty: "easy",
    solved: true,
  },
  {
    number: 7,
    slug: "7-ref",
    title: "ref でリアクティブな値を作る",
    difficulty: "easy",
    solved: false,
  },
  { number: 8, slug: "8-computed", title: "算出プロパティ", difficulty: "easy", solved: false },
  {
    number: 9,
    slug: "9-watch",
    title: "watch で変更を監視する",
    difficulty: "easy",
    solved: false,
  },
  {
    number: 10,
    slug: "10-v-model",
    title: "v-model で双方向バインディング",
    difficulty: "easy",
    solved: false,
  },
  {
    number: 11,
    slug: "11-props",
    title: "props で親から子へ渡す",
    difficulty: "medium",
    solved: false,
  },
  {
    number: 12,
    slug: "12-emits",
    title: "emits で子から親へ伝える",
    difficulty: "medium",
    solved: false,
  },
  { number: 13, slug: "13-slots", title: "スロット", difficulty: "hard", solved: false },
  {
    number: 14,
    slug: "14-composables",
    title: "コンポーザブルでロジックを再利用する",
    difficulty: "hard",
    solved: false,
  },
];

/** ストーリーやテストで使うダミーの問題詳細 */
export const questionDetailFixture: QuestionDetail = {
  number: 7,
  slug: "7-ref",
  title: "ref でリアクティブな値を作る",
  difficulty: "easy",
  solved: false,
  question: `# ref でリアクティブな値を作る

\`ref\` を使ってカウンターを作ってください。

## 要件

1. \`count\` という名前のリアクティブな値を \`0\` で初期化する
2. \`increment\` 関数を呼ぶと \`count\` が 1 増える
3. テンプレートに現在の \`count\` を表示する

\`\`\`ts
import { ref } from "vue";
\`\`\`

> **メモ**: \`ref\` で作った値は \`<script setup>\` の中では \`.value\` でアクセスします。`,
  hint: `- \`ref(0)\` の戻り値は \`{ value: 0 }\` の形をしたオブジェクトです
- テンプレートでは \`.value\` を付けずに \`{{ count }}\` と書けます`,
  answer: `## 解答例

\`\`\`vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const increment = () => {
  count.value++;
};
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
\`\`\`

## 解説

\`ref\` はプリミティブな値をリアクティブにするための関数です。
\`<script setup>\` の中では \`.value\` を通して読み書きしますが、テンプレート内では自動的にアンラップされます。`,
  templateFileName: "template.vue",
  templateCode: `<script setup lang="ts">
import { ref } from "vue";

// ここに実装してください
</script>

<template>
  <button>0</button>
</template>
`,
};
