import type { SystemStyleObject } from "@chakra-ui/react";

/**
 * デジタル庁デザインシステム共通のフォーカス表示。
 * 黒 4px のアウトラインを 2px 外側に描き、その隙間を黄色 (yellow.300) のリングで埋める。
 */
export const focusVisibleStyle: SystemStyleObject = {
  outlineWidth: "4px",
  outlineStyle: "solid",
  outlineColor: "focus.outline",
  outlineOffset: "0.125rem",
  boxShadow: "0 0 0 0.125rem var(--chakra-colors-focus-ring)",
};

/** テキスト系 (リンク・テキストボタン・アコーディオンの見出しなど) はフォーカス時に背景も黄色にする */
export const focusVisibleTextStyle: SystemStyleObject = {
  ...focusVisibleStyle,
  bg: "focus.ring",
};
