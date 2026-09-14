import {
  Box as ChakraBox,
  type BoxProps as ChakraBoxProps,
  Center as ChakraCenter,
  Container as ChakraContainer,
  type ContainerProps as ChakraContainerProps,
  Flex as ChakraFlex,
  type FlexProps as ChakraFlexProps,
  Grid as ChakraGrid,
  GridItem as ChakraGridItem,
  type GridItemProps as ChakraGridItemProps,
  type GridProps as ChakraGridProps,
  HStack as ChakraHStack,
  Spacer as ChakraSpacer,
  Stack as ChakraStack,
  type StackProps as ChakraStackProps,
  VStack as ChakraVStack,
} from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, ElementType, FC, Ref } from "react";

import type { Responsive, SpaceScale } from "#/theme/scales";

/** 余白 (gap / padding) を受け付ける props。値はスケール (none / xs / sm / md / lg / xl) から選ぶ */
type SpacingKey =
  | "gap"
  | "rowGap"
  | "columnGap"
  | "p"
  | "px"
  | "py"
  | "pt"
  | "pb"
  | "pl"
  | "pr"
  | "ps"
  | "pe";

/** マージンを受け付ける props。スケールに加えて中央寄せ用の auto を許可する */
type MarginKey = "m" | "mx" | "my" | "mt" | "mb" | "ml" | "mr" | "ms" | "me";

/** 位置指定 (position と組み合わせる) の props */
type InsetKey = "top" | "right" | "bottom" | "left" | "inset" | "insetX" | "insetY";

/**
 * レイアウト部品で使えるスタイル props のうち、値に制限を付けないもの。
 * 配置・サイズ・スクロール・重なりに関するものだけを許可し、
 * 色や文字などの見た目はコンポーネントのレシピ側で決める。
 */
type FreeLayoutStyleKey =
  | "display"
  | "flex"
  | "flexGrow"
  | "flexShrink"
  | "flexBasis"
  | "flexDirection"
  | "flexWrap"
  | "alignItems"
  | "justifyContent"
  | "alignSelf"
  | "justifySelf"
  | "alignContent"
  | "justifyItems"
  | "placeItems"
  | "placeContent"
  | "order"
  | "w"
  | "h"
  | "minW"
  | "minH"
  | "maxW"
  | "maxH"
  | "boxSize"
  | "overflow"
  | "overflowX"
  | "overflowY"
  | "position"
  | "zIndex"
  | "gridTemplateColumns"
  | "gridTemplateRows"
  | "gridTemplateAreas"
  | "gridColumn"
  | "gridRow"
  | "gridArea"
  | "gridAutoFlow"
  | "gridAutoColumns"
  | "gridAutoRows"
  | "hideBelow"
  | "hideFrom"
  | "textAlign";

/** 余白・マージン・位置は選択肢 (スケール) からだけ選べる */
type ScaledLayoutProps = {
  [K in SpacingKey]?: Responsive<SpaceScale>;
} & {
  [K in MarginKey]?: Responsive<SpaceScale | "auto">;
} & {
  [K in InsetKey]?: Responsive<SpaceScale | "auto">;
};

type HtmlDivProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "color" | "style" | "translate" | "content"
>;

type PolymorphicProps = {
  /** 描画する要素を変える (例: `as="section"`) */
  as?: ElementType;
  /** 子要素にスタイルを委譲する */
  asChild?: boolean;
  ref?: Ref<HTMLDivElement>;
};

/** レイアウト部品に共通のスタイル props */
export type LayoutProps = Pick<ChakraBoxProps, FreeLayoutStyleKey> & ScaledLayoutProps;

export type BoxProps = HtmlDivProps & PolymorphicProps & LayoutProps;
/** 最小のレイアウト要素 */
export const Box: FC<BoxProps> = ChakraBox;

export type FlexProps = HtmlDivProps &
  PolymorphicProps &
  LayoutProps &
  Pick<
    ChakraFlexProps,
    "align" | "justify" | "direction" | "wrap" | "basis" | "grow" | "shrink" | "inline"
  >;
/** display: flex の要素 */
export const Flex: FC<FlexProps> = ChakraFlex;

export type StackProps = HtmlDivProps &
  PolymorphicProps &
  LayoutProps &
  Pick<ChakraStackProps, "align" | "justify" | "direction" | "wrap" | "separator">;
/** 子要素を等間隔に並べる (既定は縦) */
export const Stack: FC<StackProps> = ChakraStack;
/** 子要素を横に等間隔に並べる */
export const HStack: FC<StackProps> = ChakraHStack;
/** 子要素を縦に等間隔に並べる */
export const VStack: FC<StackProps> = ChakraVStack;

export type GridProps = HtmlDivProps &
  PolymorphicProps &
  LayoutProps &
  Pick<
    ChakraGridProps,
    | "templateColumns"
    | "templateRows"
    | "templateAreas"
    | "column"
    | "row"
    | "autoFlow"
    | "autoColumns"
    | "autoRows"
    | "inline"
  >;
/** display: grid の要素 */
export const Grid: FC<GridProps> = ChakraGrid;

export type GridItemProps = HtmlDivProps &
  PolymorphicProps &
  LayoutProps &
  Pick<
    ChakraGridItemProps,
    "area" | "colSpan" | "colStart" | "colEnd" | "rowSpan" | "rowStart" | "rowEnd"
  >;
/** Grid の子要素 */
export const GridItem: FC<GridItemProps> = ChakraGridItem;

export type ContainerProps = HtmlDivProps &
  PolymorphicProps &
  LayoutProps &
  Pick<ChakraContainerProps, "centerContent" | "fluid">;
/** ページ幅を制限して中央に寄せるコンテナ */
export const Container: FC<ContainerProps> = ChakraContainer;

export type CenterProps = BoxProps;
/** 子要素を上下左右中央に配置する */
export const Center: FC<CenterProps> = ChakraCenter;

export type SpacerProps = BoxProps;
/** Flex / Stack 内で余った空間を埋める */
export const Spacer: FC<SpacerProps> = ChakraSpacer;
