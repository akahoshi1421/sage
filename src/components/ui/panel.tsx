import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { type ComponentPropsWithoutRef, type ReactNode, type Ref, useId } from "react";

import { Heading, type HeadingLevel } from "./heading";
import type { LayoutProps } from "./layout";

/** 枠付きの汎用コンテナ (問題一覧のカード、概要説明、コードペインなど) */
const panelRecipe = defineSlotRecipe({
  className: "sage-panel",
  slots: ["root", "header", "body"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      minW: 0,
      "--panel-padding": "spacing.4",
    },
    header: {
      flexShrink: 0,
      pt: "var(--panel-padding)",
      px: "var(--panel-padding)",
    },
    body: {
      minW: 0,
      p: "var(--panel-padding)",
    },
  },
  variants: {
    variant: {
      outline: {
        root: {
          bg: "white",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border",
          rounded: "8",
        },
      },
      subtle: {
        root: { bg: "bg.subtle", rounded: "8" },
      },
      plain: {},
    },
    size: {
      sm: { root: { "--panel-padding": "spacing.3" } },
      md: { root: { "--panel-padding": "spacing.4" } },
      lg: { root: { "--panel-padding": "spacing.6" } },
    },
    /** 内側だけを縦スクロールさせる (親で高さを制限して使う) */
    scrollable: {
      true: {
        root: { minH: 0 },
        body: { flex: "1 1 auto", minH: 0, overflowY: "auto" },
      },
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

const { withProvider, withContext } = createSlotRecipeContext({ recipe: panelRecipe });

type PanelRootProps = HTMLChakraProps<"section"> & RecipeVariantProps<typeof panelRecipe>;
const PanelRoot = withProvider<HTMLElement, PanelRootProps>("section", "root");
const PanelHeader = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "header");
const PanelBody = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "body");

export type PanelVariant = "outline" | "subtle" | "plain";
export type PanelSize = "sm" | "md" | "lg";

export type PanelProps = Omit<ComponentPropsWithoutRef<"section">, "color" | "style" | "title"> &
  LayoutProps & {
    variant?: PanelVariant;
    /** 内側の余白 */
    size?: PanelSize;
    /** 内側だけを縦スクロールさせる (親で高さを制限して使う) */
    scrollable?: boolean;
    /** 見出し (指定するとリージョンの名前にもなる) */
    title?: ReactNode;
    /** 見出しの文書上のレベル */
    titleLevel?: HeadingLevel;
    as?: "section" | "div" | "article" | "aside";
    ref?: Ref<HTMLElement>;
  };

/** 枠付きの汎用コンテナ */
export function Panel({
  variant = "outline",
  size = "md",
  scrollable = false,
  title,
  titleLevel = "h2",
  children,
  ...rest
}: PanelProps) {
  const titleId = useId();
  const hasTitle = title !== undefined && title !== null;

  return (
    <PanelRoot
      variant={variant}
      size={size}
      scrollable={scrollable}
      aria-labelledby={hasTitle ? titleId : undefined}
      {...rest}
    >
      {hasTitle && (
        <PanelHeader>
          <Heading id={titleId} level={titleLevel} size="20">
            {title}
          </Heading>
        </PanelHeader>
      )}
      <PanelBody>{children}</PanelBody>
    </PanelRoot>
  );
}
