import { chakra } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

import type { DadsTextStyle } from "#/theme/text-styles";

const colorTokens = {
  default: "fg",
  muted: "fg.muted",
  subtle: "fg.subtle",
  inverted: "fg.inverted",
  error: "fg.error",
  success: "fg.success",
  warning: "fg.warning",
  info: "fg.info",
  link: "fg.link",
} as const;

export type TextColor = keyof typeof colorTokens;

export type TextProps = Omit<ComponentPropsWithoutRef<"p">, "color" | "style"> & {
  /** 描画する要素 (既定は p) */
  as?:
    | "p"
    | "span"
    | "div"
    | "strong"
    | "em"
    | "small"
    | "label"
    | "li"
    | "dt"
    | "dd"
    | "time"
    | "figcaption";
  /** デジタル庁デザインシステムのタイポグラフィ (未指定なら親から継承) */
  textStyle?: DadsTextStyle;
  /** 文字色 (未指定なら親から継承) */
  color?: TextColor;
  align?: "start" | "center" | "end";
  /** 1 行に収めて末尾を省略する */
  truncate?: boolean;
  /** 指定行数で省略する */
  lineClamp?: number;
  ref?: Ref<HTMLParagraphElement>;
};

/** 本文などのテキスト */
export function Text({
  as = "p",
  textStyle,
  color,
  align,
  truncate,
  lineClamp,
  ...rest
}: TextProps) {
  return (
    <chakra.p
      as={as}
      textStyle={textStyle}
      color={color ? colorTokens[color] : undefined}
      textAlign={align}
      truncate={truncate}
      lineClamp={lineClamp}
      {...rest}
    />
  );
}
