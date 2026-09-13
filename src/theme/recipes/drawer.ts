import { defineSlotRecipe } from "@chakra-ui/react";
import { drawerAnatomy } from "@chakra-ui/react/anatomy";

import { menuButtonStyle } from "./shared";

/**
 * ドロワー (デジタル庁デザインシステム「ドロワー」)
 * https://design.digital.go.jp/dads/components/drawer/
 * 公式 React 実装のストーリー (左 / 右オーバーレイ) の見た目を Chakra の Drawer に移植したもの。
 */
export const drawerSlotRecipe = defineSlotRecipe({
  slots: drawerAnatomy.keys(),
  base: {
    backdrop: {
      bg: "opacityGray.100",
    },
    content: {
      height: "100dvh",
      maxH: "100dvh",
      bg: "white",
      color: "fg",
      textStyle: "std-16N-170",
      boxShadow: "elevation.2",
      borderInlineStartWidth: "1px",
      borderInlineStartStyle: "solid",
      borderColor: "transparent",
      scrollbarGutter: "stable",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      flex: "0 0 auto",
      px: "4",
      pt: "4",
      pb: "4",
    },
    title: {
      srOnly: true,
    },
    body: {
      flex: "1",
      overflow: "auto",
      px: "6",
      py: "4",
    },
    closeTrigger: menuButtonStyle,
  },
  variants: {
    size: {
      xs: {
        content: { maxW: "18rem" },
      },
    },
  },
  defaultVariants: {
    size: "xs",
  },
});
