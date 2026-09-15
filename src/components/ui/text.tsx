import { chakra } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

import type { TextSizeScale } from "#/theme/scales";
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
export type TextSize = TextSizeScale;
export type TextWeight = "normal" | "bold";

/**
 * size × weight → デジタル庁デザインシステムのタイポグラフィ。
 * xs / sm は密度の高い UI 向け (dns)、md 以上は本文向け (std)。
 */
const textStyles: Record<TextSize, Record<TextWeight, DadsTextStyle>> = {
  xs: { normal: "dns-14N-130", bold: "dns-14B-130" },
  sm: { normal: "dns-16N-130", bold: "dns-16B-130" },
  md: { normal: "std-16N-170", bold: "std-16B-170" },
  lg: { normal: "std-18N-160", bold: "std-18B-160" },
  xl: { normal: "std-20N-150", bold: "std-20B-150" },
};

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
  /** 文字サイズ (xs: 14px 密 / sm: 16px 密 / md: 16px 本文 / lg: 18px / xl: 20px)。未指定なら親から継承 */
  size?: TextSize;
  /** 太さ。size と組み合わせて使う (size 未指定で bold だけ指定した場合は md 相当) */
  weight?: TextWeight;
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
  size,
  weight,
  color,
  align,
  truncate,
  lineClamp,
  ...rest
}: TextProps) {
  const textStyle = size || weight ? textStyles[size ?? "md"][weight ?? "normal"] : undefined;

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
