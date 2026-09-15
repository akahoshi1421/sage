# components/ui

sage の UI で使う部品の置き場所です。デジタル庁デザインシステム (DADS) に準拠した見た目を、
Chakra UI v3 のテーマ (`src/theme/`) とレシピで実装しています。

## ルール

- アプリ本体 (`src/routes`, `src/features` など) では `@chakra-ui/react` を直接 import しません。
  必ずここの部品 (`#/components/ui`) を使います (oxlint の `no-restricted-imports` で検出されます)。
- 見た目 (色・文字・枠線・影) は部品のレシピや `variant` / `size` で決めます。
  レイアウト部品 (`Box`, `Flex`, `Stack`, `Grid`, `Container`) が受け付ける style props は、
  配置・余白・サイズ・スクロール・重なりに関するものだけです (`LayoutProps`)。
- 余白 (`gap` / `p` / `m` など) は `none` / `xs` / `sm` / `md` / `lg` / `xl` から、
  文字サイズは `Text` の `size` (`xs` 〜 `xl`) と `weight` から選びます (`src/theme/scales.ts`)。
  任意の px や rem は指定できません。
- 部品を追加するときは、次の 4 点をセットで用意します。
  1. `defineRecipe` / `defineSlotRecipe` によるスタイル (DADS の仕様を参照)
  2. 必要な props だけを公開する薄いラッパー
  3. `*.stories.tsx` (Storybook で全バリエーションを確認できるように)
  4. `*.test.tsx` (ユーザ操作の結果を検証する目的駆動のテスト)
- 部品の外部 API では Chakra の型を再 export せず、必要な props を明示的に定義します。
- `.tsx` にはレンダリングだけを書きます。ロジックは `hooks/` (カスタムフック、1 フック 1 ファイル) と
  `utils/` (純粋関数、1 関数 1 ファイル) に分け、`*.test.ts` で検証します。

## アプリ内リンク

`Link` と `Button` の `href` は、`NavigationProvider` (アプリのルートで TanStack Router に接続) の配下ではページを読み込み直さずに遷移します。
Storybook などプロバイダが無い場所では通常のリンクとして動きます。

## 参考

- デジタル庁デザインシステム: https://design.digital.go.jp/dads/
- 公式 React 実装 (Tailwind 版): https://github.com/digital-go-jp/design-system-example-components
- Chakra UI Theming: https://chakra-ui.com/docs/theming/overview
