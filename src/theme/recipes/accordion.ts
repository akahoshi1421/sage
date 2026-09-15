import { defineSlotRecipe } from "@chakra-ui/react";
import { accordionAnatomy } from "@chakra-ui/react/anatomy";

import { focusVisibleTextOutline } from "./shared";

const triggerPadding = {
  py: { base: "2", md: "3.5" },
  pl: {
    base: "calc(var(--accordion-icon-size) + 0.75rem)",
    md: "calc(var(--accordion-icon-size) + 1.25rem)",
  },
  pr: { base: "2", md: "4" },
} as const;

/** 既定レシピの size バリアント (余白・文字サイズ) を DADS の値で上書きする */
const sizeStyle = {
  root: {
    "--accordion-padding-x": "0",
    "--accordion-padding-y": "0",
  },
  itemTrigger: {
    textStyle: "std-16B-170",
    ...triggerPadding,
  },
} as const;

/**
 * アコーディオン (デジタル庁デザインシステム「アコーディオン」)
 * https://design.digital.go.jp/dads/components/accordion/
 * 公式 React 実装 (details/summary) の見た目を Chakra の Accordion に移植したもの。
 */
export const accordionSlotRecipe = defineSlotRecipe({
  slots: accordionAnatomy.keys(),
  base: {
    root: {
      width: "full",
      "--accordion-radius": "radii.4",
      "--accordion-icon-size": { base: "1.25rem", md: "2rem" },
    },
    item: {
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderColor: "solidGray.420",
    },
    itemTrigger: {
      position: "relative",
      display: "block",
      width: "full",
      textAlign: "start",
      gap: "0",
      fontWeight: 700,
      color: "fg",
      borderRadius: "var(--accordion-radius)",
      outline: "0",
      ...triggerPadding,
      _hover: {
        bg: "solidGray.50",
      },
      _focusVisible: focusVisibleTextOutline,
    },
    itemIndicator: {
      position: "absolute",
      top: { base: "2", md: "3.5" },
      left: { base: "0.5", md: "1.5" },
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSize: "var(--accordion-icon-size)",
      mt: "calc((1lh - var(--accordion-icon-size)) / 2)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "currentColor",
      bg: "white",
      color: "key.1000",
      rounded: "full",
      transition: "rotate 0.2s",
      transformOrigin: "center",
      _open: {
        rotate: "180deg",
      },
      _icon: {
        width: { base: "4", md: "5" },
        height: { base: "4", md: "5" },
        mt: "0.5",
      },
      "[data-part=item-trigger]:hover &": {
        outline: "2px solid currentColor",
      },
    },
    itemContent: {
      pl: triggerPadding.pl,
      pr: triggerPadding.pr,
    },
    itemBody: {
      pt: { base: "4", md: "6" },
      pb: { base: "4", md: "6" },
    },
  },
  variants: {
    size: {
      sm: sizeStyle,
      md: sizeStyle,
      lg: sizeStyle,
    },
  },
  defaultVariants: {
    size: "md",
  },
});
