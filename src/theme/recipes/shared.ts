import type { SystemStyleObject } from "@chakra-ui/react";

/**
 * スロットレシピ (Chakra の既定レシピと deep merge される) 向けのフォーカス表示。
 * 既定レシピが `outline` のショートハンドを使っているため、同じくショートハンドで上書きする。
 */
export const focusVisibleOutline: SystemStyleObject = {
  outline: "4px solid",
  outlineColor: "focus.outline",
  outlineOffset: "0.125rem",
  boxShadow: "0 0 0 0.125rem var(--chakra-colors-focus-ring)",
};

/** テキスト系の要素はフォーカス時に背景も黄色にする */
export const focusVisibleTextOutline: SystemStyleObject = {
  ...focusVisibleOutline,
  bg: "focus.ring",
};

/** DADS「閉じる」ボタン / ハンバーガーメニューボタン (ラベル付き) のスタイル */
export const menuButtonStyle: SystemStyleObject = {
  position: "static",
  top: "auto",
  insetEnd: "auto",
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  gap: "1",
  width: "fit-content",
  rounded: "6",
  pt: "1",
  px: "3",
  pb: "1.5",
  bg: "transparent",
  color: "fg",
  textStyle: "oln-16N-100",
  touchAction: "manipulation",
  cursor: "pointer",
  _hover: {
    bg: "solidGray.50",
    textDecoration: "underline",
    textUnderlineOffset: "0.1875rem",
  },
  _focusVisible: focusVisibleTextOutline,
  _icon: {
    color: "black",
  },
};
