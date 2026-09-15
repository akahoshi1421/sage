import type { TextSizeScale } from "#/theme/scales";
import type { DadsTextStyle } from "#/theme/text-styles";

export type TextWeight = "normal" | "bold";

/**
 * size × weight → デジタル庁デザインシステムのタイポグラフィ。
 * xs / sm は密度の高い UI 向け (dns)、md 以上は本文向け (std)。
 */
const textStyles: Record<TextSizeScale, Record<TextWeight, DadsTextStyle>> = {
  xs: { normal: "dns-14N-130", bold: "dns-14B-130" },
  sm: { normal: "dns-16N-130", bold: "dns-16B-130" },
  md: { normal: "std-16N-170", bold: "std-16B-170" },
  lg: { normal: "std-18N-160", bold: "std-18B-160" },
  xl: { normal: "std-20N-150", bold: "std-20B-150" },
};

/** Text の size / weight から使うタイポグラフィを決める。どちらも未指定なら親から継承 (undefined) */
export function textStyleFor(
  size: TextSizeScale | undefined,
  weight: TextWeight | undefined,
): DadsTextStyle | undefined {
  if (size === undefined && weight === undefined) return undefined;
  return textStyles[size ?? "md"][weight ?? "normal"];
}
