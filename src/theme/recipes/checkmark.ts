import { defineRecipe } from "@chakra-ui/react";

const checkedStyle = {
  bg: "key.900",
  borderColor: "key.900",
  color: "white",
} as const;

/**
 * チェックマーク (デジタル庁デザインシステム「チェックボックス」のチェック部分の見た目)
 * https://design.digital.go.jp/dads/components/checkbox/
 *
 * Chakra の既定レシピと deep merge されるため、見た目に関わる既定値
 * (variant / filled / size / フォーカスリング / disabled の透過) はここで明示的に上書きしている。
 * variant は solid だけを使う。
 */
export const checkmarkRecipe = defineRecipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    verticalAlign: "middle",
    boxSizing: "border-box",
    bg: "white",
    color: "white",
    borderStyle: "solid",
    borderColor: "solidGray.600",
    borderRadius: "calc(2 / 18 * 100%)",
    cursor: "default",
    focusVisibleRing: "none",
    _invalid: {
      colorPalette: "key",
      borderColor: "solidGray.600",
    },
    _disabled: {
      opacity: 1,
      cursor: "default",
      bg: "solidGray.50",
      borderColor: "solidGray.300",
    },
    "&:is([data-state=checked], [data-state=indeterminate])": checkedStyle,
    "&:is([data-state=checked], [data-state=indeterminate])[data-disabled]": {
      bg: "solidGray.300",
      borderColor: "solidGray.300",
      color: "white",
    },
  },
  variants: {
    /** 箱の大きさ (公式のチェックボックス sm / md / lg の input 部分と同じ) */
    size: {
      xs: { boxSize: "1.125rem", borderWidth: "2px", p: 0 },
      sm: { boxSize: "1.125rem", borderWidth: "2px", p: 0 },
      md: { boxSize: "1.5rem", borderWidth: "2px", p: 0 },
      lg: { boxSize: "2.0625rem", borderWidth: "3px", p: 0 },
    },
    variant: {
      solid: {
        borderColor: "solidGray.600",
        "&:is([data-state=checked], [data-state=indeterminate])": checkedStyle,
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "solid",
  },
});
