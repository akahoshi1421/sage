# sage (セージ)

AI 時代に新しいライブラリを効率的に学ぶためのフレームワークです。任意の技術・ライブラリについて、type-challenges 風の問題を AI エージェントが生成し、ローカルの CLI または Web UI で解いて採点できます。

設計ドキュメントは [`docs/README.md`](docs/README.md) を参照してください。

## 必要なもの

- Node.js 24 以上 (`.node-version`)
- npm

## セットアップ

```bash
npm ci
```

`npm ci` の後処理 (`prepare`) で husky の git hook と Chakra UI の型生成が行われます。

## 開発用スクリプト

| コマンド                                  | 内容                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run dev`                             | Web 版 (TanStack Start) の開発サーバーを http://localhost:3000 で起動                                  |
| `npm run build`                           | Web 版のビルド                                                                                         |
| `npm run storybook`                       | デザインシステム (Storybook) を http://localhost:6006 で起動                                           |
| `npm run build-storybook`                 | Storybook の静的ビルド                                                                                 |
| `npm run lint` / `npm run lint:fix`       | oxlint                                                                                                 |
| `npm run format` / `npm run format:check` | oxfmt                                                                                                  |
| `npm run typecheck`                       | `tsc --noEmit`                                                                                         |
| `npm test` / `npm run test:watch`         | vitest                                                                                                 |
| `npm run generate:tokens`                 | デジタル庁デザイントークンから `src/theme/dads-tokens.ts` を再生成                                     |
| `npm run generate:icons`                  | `docs/designsystem-assets/icon/svg` (git 管理外) から `src/components/ui/icons/dads-icons.ts` を再生成 |

commit 時には lint-staged が oxfmt / oxlint / `tsc --noEmit` を実行します。CI (GitHub Actions) では lint / format check / typecheck / test / Storybook build を実行します。

## コード規約

- `.tsx` (コンポーネント・ルート) にはレンダリングだけを書き、ロジックは同じ機能ディレクトリの `hooks/` (カスタムフック、1 フック 1 ファイル) と `utils/` (純粋関数、1 関数 1 ファイル) に分けます
- アプリ本体は `src/components/ui` の部品だけを使い、`@chakra-ui/react` を直接 import しません
- テストは目的駆動 (「ユーザがこの操作をした結果こうなる」) で書きます。`*.test.tsx` は jsdom、`*.test.ts` は Node で実行されます
- コミットは 1 小タスクごと、英語で `add:` / `fix:` などのプレフィックスを付けます

## ディレクトリ構成

```
src/
  components/ui/   デザインシステムの部品 (アプリ本体はここだけを使う)
  theme/           Chakra UI のテーマ (デジタル庁デザインシステム準拠)
  features/        画面・機能ごとのコンポーネントとロジック
  i18n/            Web 版 UI の文言 (ja / en)
  routes/          TanStack Start のルート
  test/            テスト用ヘルパーとフィクスチャ
scripts/           トークン・アイコンの生成スクリプト
docs/              設計ドキュメント
```

## 利用者プロジェクトの構成 (Web 版が読む場所)

`npx @akahoshi1421/sage create` で展開されるプロジェクトは次の構成です。開発中は `npm run dev` が `example/` をこの構成のサンプルとして使います (環境変数 `SAGE_ROOT` で切り替え)。

| パス                                      | 内容                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `sage.config.json`                        | `{ "agent": "claude" \| "codex", "locale": "ja" \| "en" }`                    |
| `questions/README.md`                     | 学習対象の名前 (先頭の `# 見出し`) と概要 (Markdown)                          |
| `questions/{難易度}/{番号}-{slug}/`       | 難易度は `warm-up` / `easy` / `medium` / `hard` / `extreme`。番号は全体で一意 |
| 　`QUESTION.md` / `HINT.md` / `ANSWER.md` | 問題文 (先頭の `# 見出し` がタイトル) / ヒント / 答えと解説                   |
| 　`template.{拡張子}`                     | テンプレート。リセット時の戻し先                                              |
| 　`answer.{拡張子}`                       | 回答ファイル。無ければテンプレートから作られる                                |
| `.sage/progress.db`                       | 正解済みの記録 (sqlite)                                                       |

### 採点コマンドの契約

Web 版の「回答」ボタンは、プロジェクトのルートで `claude -p "/sage-mark {番号}"` (codex なら `codex exec "/sage-mark {番号}"`) を実行し、出力の最後にある次の形式の行を判定として読み取ります。

- `🟢 正解 (一言)`
- `🟡 惜しい (一言)`
- `🔴 不正解 (一言)`

正解のときは Web 版が `.sage/progress.db` に記録します。

## デザインシステム

見た目は[デジタル庁デザインシステム](https://design.digital.go.jp/dads/)に準拠しています。

### スケール (選択肢)

任意の数値ではなく、次の選択肢から選びます。

| 対象                                | 選択肢                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 余白 (`gap` / `padding` / `margin`) | `none` / `xs` (4px) / `sm` (8px) / `md` (16px) / `lg` (24px) / `xl` (32px)                                          |
| 文字サイズ (`Text` の `size`)       | `xs` (14px 密) / `sm` (16px 密) / `md` (16px 本文) / `lg` (18px) / `xl` (20px)、太さは `weight` (`normal` / `bold`) |
| 見出し (`Heading` の `size`)        | デジタル庁の見出しサイズ `64` 〜 `16`                                                                               |

- 出典: デジタル庁デザインシステムウェブサイト https://design.digital.go.jp/dads/
- アイコンは「イラストレーション・アイコン素材」(デジタル庁) を元に、塗り色を `currentColor` に置き換える加工をしています。

## ライセンス

MIT
