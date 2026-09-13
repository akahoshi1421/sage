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

/**
 * レイアウト部品で使えるスタイル props。
 * 配置・余白・サイズ・スクロール・重なりに関するものだけを許可し、
 * 色や文字などの見た目はコンポーネントのレシピ側で決める。
 */
type LayoutStyleKey =
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
  | "pe"
  | "m"
  | "mx"
  | "my"
  | "mt"
  | "mb"
  | "ml"
  | "mr"
  | "ms"
  | "me"
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
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inset"
  | "insetX"
  | "insetY"
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

export type LayoutProps = Pick<ChakraBoxProps, LayoutStyleKey>;

export type BoxProps = HtmlDivProps & PolymorphicProps & LayoutProps;
/** 最小のレイアウト要素 */
export const Box: FC<BoxProps> = ChakraBox;

export type FlexProps = HtmlDivProps &
  PolymorphicProps &
  Pick<
    ChakraFlexProps,
    | LayoutStyleKey
    | "align"
    | "justify"
    | "direction"
    | "wrap"
    | "basis"
    | "grow"
    | "shrink"
    | "inline"
  >;
/** display: flex の要素 */
export const Flex: FC<FlexProps> = ChakraFlex;

export type StackProps = HtmlDivProps &
  PolymorphicProps &
  Pick<ChakraStackProps, LayoutStyleKey | "align" | "justify" | "direction" | "wrap" | "separator">;
/** 子要素を等間隔に並べる (既定は縦) */
export const Stack: FC<StackProps> = ChakraStack;
/** 子要素を横に等間隔に並べる */
export const HStack: FC<StackProps> = ChakraHStack;
/** 子要素を縦に等間隔に並べる */
export const VStack: FC<StackProps> = ChakraVStack;

export type GridProps = HtmlDivProps &
  PolymorphicProps &
  Pick<
    ChakraGridProps,
    | LayoutStyleKey
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
  Pick<
    ChakraGridItemProps,
    LayoutStyleKey | "area" | "colSpan" | "colStart" | "colEnd" | "rowSpan" | "rowStart" | "rowEnd"
  >;
/** Grid の子要素 */
export const GridItem: FC<GridItemProps> = ChakraGridItem;

export type ContainerProps = HtmlDivProps &
  PolymorphicProps &
  Pick<ChakraContainerProps, LayoutStyleKey | "centerContent" | "fluid">;
/** ページ幅を制限して中央に寄せるコンテナ */
export const Container: FC<ContainerProps> = ChakraContainer;

export type CenterProps = BoxProps;
/** 子要素を上下左右中央に配置する */
export const Center: FC<CenterProps> = ChakraCenter;

export type SpacerProps = BoxProps;
/** Flex / Stack 内で余った空間を埋める */
export const Spacer: FC<SpacerProps> = ChakraSpacer;
