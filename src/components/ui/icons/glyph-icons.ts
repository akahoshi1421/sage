/**
 * UI 部品専用の小さな図形 (グリフ)。
 * デジタル庁デザインシステム公式の React 実装 (MIT License) の SVG を元にしています。
 * https://github.com/digital-go-jp/design-system-example-components
 */
export const glyphIcons = {
  /** 閉じる (ハンバーガーメニュー / ダイアログ) */
  close: {
    viewBox: "0 0 120 120",
    paths: [
      {
        d: "M32 95L25 88L53 60L25 32L32 25L60 53L88 25L95 32L67 60L95 88L88 95L60 67L32 95Z",
      },
    ],
  },
  /** ハンバーガーメニュー */
  hamburger: {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
      },
    ],
  },
  /** アコーディオンの開閉 (下向きシェブロン) */
  chevron_down: {
    viewBox: "0 0 20 20",
    paths: [
      {
        d: "M16.668 5.5L10.0013 12.1667L3.33464 5.5L2.16797 6.66667L10.0013 14.5L17.8346 6.66667L16.668 5.5Z",
      },
    ],
  },
  /** チェックボックスのチェック */
  check: {
    viewBox: "0 0 14 14",
    paths: [
      {
        d: "M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z",
      },
    ],
  },
  /** 外部リンク (新規タブで開く) */
  external_link: {
    viewBox: "0 0 16 17",
    paths: [
      {
        d: "M3 13.5H13V9.16667H14V14.5H2V2.5H7.33333V3.5H3V13.5ZM9.33333 3.5V2.5H14V7.16667H13V4.23333L7 10.1667L6.33333 9.5L12.2667 3.5H9.33333Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
      },
    ],
  },
} as const;

export type GlyphIconName = keyof typeof glyphIcons;
