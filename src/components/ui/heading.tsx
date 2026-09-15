import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "64" | "57" | "45" | "36" | "32" | "28" | "24" | "20" | "18" | "16";
export type HeadingRule = "8" | "6" | "4" | "2";

/**
 * 見出し (デジタル庁デザインシステム「見出し」)
 * https://design.digital.go.jp/dads/components/heading/
 */
const headingRecipe = defineRecipe({
  className: "sage-heading",
  base: {
    color: "fg",
    fontFamily: "sans",
  },
  variants: {
    size: {
      "64": { textStyle: "dsp-64B-140" },
      "57": { textStyle: "dsp-57B-140" },
      "45": { textStyle: "std-45B-140" },
      "36": { textStyle: "std-36B-140" },
      "32": { textStyle: "std-32B-150" },
      "28": { textStyle: "std-28B-150" },
      "24": { textStyle: "std-24B-150" },
      "20": { textStyle: "std-20B-150" },
      "18": { textStyle: "std-18B-160" },
      "16": { textStyle: "std-16B-170" },
    },
    /** 左側にキーカラーの短冊 (チップ) を付ける */
    chip: {
      true: {
        position: "relative",
        paddingInlineStart: "calc(1em / 3 + 0.5em)",
        _before: {
          content: '""',
          position: "absolute",
          left: 0,
          width: "calc(1em / 3)",
          bg: "key.900",
          top: "0.2em",
          bottom: "0.1em",
        },
        "@supports (top: 1lh)": {
          _before: {
            top: "calc(0.5lh - 0.45em)",
            bottom: "calc(0.5lh - 0.55em)",
          },
        },
      },
    },
    /** 下線 (罫線) の太さ */
    rule: {
      "8": {
        borderBottomWidth: "0.5rem",
        borderBottomStyle: "solid",
        borderColor: "key.900",
        pb: "8",
      },
      "6": {
        borderBottomWidth: "0.375rem",
        borderBottomStyle: "solid",
        borderColor: "key.900",
        pb: "6",
      },
      "4": {
        borderBottomWidth: "0.25rem",
        borderBottomStyle: "solid",
        borderColor: "key.900",
        pb: "4",
      },
      "2": {
        borderBottomWidth: "0.125rem",
        borderBottomStyle: "solid",
        borderColor: "key.900",
        pb: "2",
      },
    },
  },
  defaultVariants: {
    size: "24",
  },
});

const StyledHeading = chakra("h2", headingRecipe);

export type HeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "color" | "style"> & {
  /** 見出しレベル (文書構造)。見た目は size で決める */
  level: HeadingLevel;
  /** 文字サイズ (px 相当) */
  size?: HeadingSize;
  chip?: boolean;
  rule?: HeadingRule;
  ref?: Ref<HTMLHeadingElement>;
};

/** 見出し */
export function Heading({ level, size, chip, rule, ...rest }: HeadingProps) {
  return <StyledHeading as={level} size={size} chip={chip} rule={rule} {...rest} />;
}
