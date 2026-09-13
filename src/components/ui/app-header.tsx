import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { focusVisibleTextStyle } from "#/theme/focus";

import { Spacer } from "./layout";

/**
 * アプリ共通ヘッダー (デジタル庁デザインシステム「ヘッダーコンテナ」に倣う)
 * https://design.digital.go.jp/dads/components/header-container/
 */
const appHeaderRecipe = defineSlotRecipe({
  className: "sage-app-header",
  slots: ["root", "inner", "title", "slot"],
  base: {
    root: {
      w: "100%",
      bg: "white",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderColor: "border.muted",
    },
    inner: {
      display: "flex",
      alignItems: "center",
      gap: "3",
      minH: { base: "14", md: "16" },
      px: { base: "4", md: "6" },
    },
    title: {
      textStyle: "std-20B-150",
      color: "fg",
      "& a": {
        color: "inherit",
        textDecoration: "none",
        rounded: "4",
        _hover: { textDecoration: "underline", textUnderlineOffset: "0.1875rem" },
        _focusVisible: focusVisibleTextStyle,
      },
    },
    slot: {
      display: "flex",
      alignItems: "center",
      gap: "2",
    },
  },
  variants: {
    sticky: {
      true: {
        root: { position: "sticky", top: 0, zIndex: "sticky" },
      },
    },
  },
});

const { withProvider, withContext } = createSlotRecipeContext({ recipe: appHeaderRecipe });

type RootProps = HTMLChakraProps<"header"> & RecipeVariantProps<typeof appHeaderRecipe>;
const HeaderRoot = withProvider<HTMLElement, RootProps>("header", "root");
const HeaderInner = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "inner");
const HeaderTitle = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "title");
const HeaderSlot = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "slot");

export type AppHeaderProps = {
  /** サイト名 (既定は sage) */
  title?: ReactNode;
  /** 指定するとサイト名がトップページへのリンクになる */
  homeHref?: string;
  /** サイト名の左に置く要素 (ハンバーガーメニューボタンなど) */
  startSlot?: ReactNode;
  /** 右端に置く要素 */
  endSlot?: ReactNode;
  /** 画面上部に固定する */
  sticky?: boolean;
  className?: string;
};

/** アプリ共通ヘッダー */
export function AppHeader({
  title = "sage",
  homeHref,
  startSlot,
  endSlot,
  sticky = false,
  className,
}: AppHeaderProps) {
  return (
    <HeaderRoot sticky={sticky} className={className}>
      <HeaderInner>
        {startSlot && <HeaderSlot>{startSlot}</HeaderSlot>}
        <HeaderTitle>{homeHref ? <a href={homeHref}>{title}</a> : title}</HeaderTitle>
        <Spacer />
        {endSlot && <HeaderSlot>{endSlot}</HeaderSlot>}
      </HeaderInner>
    </HeaderRoot>
  );
}
