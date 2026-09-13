import { defineTextStyles } from "@chakra-ui/react";

import { dadsTokens } from "./dads-tokens";

/**
 * デジタル庁デザインシステムのタイポグラフィ定義。
 * 命名規則: `{種別}-{フォントサイズ}{B(太字)|N(標準)}-{行送り(%)}`
 * - dsp: Display (大見出し)
 * - std: Standard (本文・見出し)
 * - dns: Dense (密度の高い UI)
 * - oln: Oneline (ボタンラベルなど 1 行のテキスト)
 * - mono: Monospace (コード)
 *
 * 出典: https://github.com/digital-go-jp/tailwind-theme-plugin (MIT License) の fontSize 定義
 */
export const DADS_TEXT_STYLE_NAMES = [
  "dsp-64B-140",
  "dsp-57B-140",
  "dsp-48B-140",
  "dsp-64N-140",
  "dsp-57N-140",
  "dsp-48N-140",
  "std-45B-140",
  "std-36B-140",
  "std-32B-150",
  "std-28B-150",
  "std-26B-150",
  "std-24B-150",
  "std-22B-150",
  "std-20B-160",
  "std-20B-150",
  "std-18B-160",
  "std-17B-170",
  "std-16B-170",
  "std-16B-175",
  "std-45N-140",
  "std-36N-140",
  "std-32N-150",
  "std-28N-150",
  "std-26N-150",
  "std-24N-150",
  "std-22N-150",
  "std-20N-150",
  "std-18N-160",
  "std-17N-170",
  "std-16N-170",
  "std-16N-175",
  "dns-17B-130",
  "dns-17B-120",
  "dns-16B-130",
  "dns-16B-120",
  "dns-14B-130",
  "dns-14B-120",
  "dns-17N-130",
  "dns-17N-120",
  "dns-16N-130",
  "dns-16N-120",
  "dns-14N-130",
  "dns-14N-120",
  "oln-17B-100",
  "oln-16B-100",
  "oln-14B-100",
  "oln-17N-100",
  "oln-16N-100",
  "oln-14N-100",
  "mono-17B-150",
  "mono-16B-150",
  "mono-14B-150",
  "mono-17N-150",
  "mono-16N-150",
  "mono-14N-150",
] as const;

export type DadsTextStyle = (typeof DADS_TEXT_STYLE_NAMES)[number];

type Family = "dsp" | "std" | "dns" | "oln" | "mono";
type FontSizeKey = keyof typeof dadsTokens.fontSize;
type LineHeightKey = keyof typeof dadsTokens.lineHeight;

function letterSpacingOf(family: Family, size: number): string {
  switch (family) {
    case "dsp":
    case "dns":
    case "mono":
      return "0";
    case "oln":
      return "0.02em";
    case "std":
      if (size >= 45) return "0";
      if (size >= 28) return "0.01em";
      return "0.02em";
  }
}

function toTextStyle(name: DadsTextStyle) {
  const [family, spec, lineHeight] = name.split("-") as [Family, string, LineHeightKey];
  const size = spec.slice(0, -1) as FontSizeKey;
  const isBold = spec.endsWith("B");

  return {
    value: {
      fontFamily: family === "mono" ? "mono" : "sans",
      fontSize: dadsTokens.fontSize[size],
      fontWeight: isBold ? dadsTokens.fontWeight[700] : dadsTokens.fontWeight[400],
      lineHeight: dadsTokens.lineHeight[lineHeight],
      letterSpacing: letterSpacingOf(family, Number(size)),
    },
  };
}

export const textStyles = defineTextStyles(
  Object.fromEntries(DADS_TEXT_STYLE_NAMES.map((name) => [name, toTextStyle(name)])),
);
