import { defineSlotRecipe } from "@chakra-ui/react";
import { dialogAnatomy } from "@chakra-ui/react/anatomy";

import { menuButtonStyle } from "./shared";

/**
 * モーダルダイアログ (デジタル庁デザインシステム「モーダルダイアログ」)
 * https://design.digital.go.jp/dads/components/modal-dialog/
 * 公式 React 実装 (ModalDialog.tsx) の見た目を Chakra の Dialog に移植したもの。
 */
export const dialogSlotRecipe = defineSlotRecipe({
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      bg: "opacityGray.600",
    },
    positioner: {
      px: "4",
    },
    content: {
      width: "100%",
      minW: "min(30rem, calc(100vw - 2rem))",
      gap: { base: "3", md: "4" },
      bg: "white",
      color: "fg",
      textStyle: "std-16N-170",
      borderRadius: "8",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black",
      boxShadow: "elevation.3",
      overflowWrap: "break-word",
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      gap: "4",
      minW: 0,
      flex: "0 0 auto",
      pt: { base: "2", md: "6" },
      px: { base: "4", md: "6" },
      pb: "0",
    },
    title: {
      flex: "1",
      minW: 0,
      textStyle: { base: "std-24B-150", md: "std-28B-150" },
      fontWeight: 700,
      outline: "none",
      _focusVisible: {
        outline: "none",
        boxShadow: "none",
      },
    },
    body: {
      flex: "0 1 auto",
      minW: 0,
      px: { base: "4", md: "6" },
      pt: "0",
      pb: "8",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: "4",
      px: { base: "4", md: "6" },
      pt: "0",
      pb: { base: "4", md: "6" },
    },
    closeTrigger: menuButtonStyle,
  },
  variants: {
    size: {
      md: {
        content: { maxW: "40rem" },
      },
      lg: {
        content: { maxW: "64rem" },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
