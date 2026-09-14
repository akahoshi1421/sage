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
