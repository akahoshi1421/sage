import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";

import { focusVisibleStyle } from "#/theme/focus";

/** sm / xs サイズでも 44px 以上のタップ領域を確保するための疑似要素 */
const tapTargetStyle = {
  content: '""',
  position: "absolute",
  insetInline: 0,
  insetBlock: "-100%",
  margin: "auto",
  height: "44px",
} as const;

/**
 * ボタン (デジタル庁デザインシステム「ボタン」)
 * https://design.digital.go.jp/dads/components/button/
 */
const buttonRecipe = defineRecipe({
  className: "sage-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1",
    width: "fit-content",
    maxWidth: "100%",
    flexShrink: 0,
    appearance: "none",
    borderWidth: 0,
    bg: "transparent",
    fontFamily: "sans",
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "0.02em",
    textAlign: "center",
    textDecoration: "none",
    textUnderlineOffset: "0.1875rem",
    cursor: "pointer",
    _focusVisible: focusVisibleStyle,
    "&[aria-disabled=true]": {
      pointerEvents: "none",
    },
  },
  variants: {
    variant: {
      "solid-fill": {
        borderWidth: "4px",
        borderStyle: "double",
        borderColor: "transparent",
        bg: "key.900",
        color: "white",
        _hover: { bg: "key.1000", textDecoration: "underline" },
        _active: { bg: "key.1200", textDecoration: "underline" },
        "&[aria-disabled=true]": { bg: "solidGray.300", color: "solidGray.50" },
      },
      outline: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "currentColor",
        bg: "white",
        color: "key.900",
        _hover: { bg: "key.200", color: "key.1000", textDecoration: "underline" },
        _active: { bg: "key.300", color: "key.1200", textDecoration: "underline" },
        "&[aria-disabled=true]": { bg: "white", color: "solidGray.300" },
      },
      text: {
        color: "key.900",
        textDecoration: "underline",
        _hover: { bg: "key.50", color: "key.1000", textDecorationThickness: "0.1875rem" },
        _active: { bg: "key.100", color: "key.1200" },
        _focusVisible: { bg: "focus.ring" },
        "&[aria-disabled=true]": { bg: "transparent", color: "solidGray.300" },
      },
    },
    size: {
      lg: { minW: "8.5rem", minH: "3.5rem", rounded: "8", px: "4", py: "3", fontSize: "16" },
      md: { minW: "6rem", minH: "3rem", rounded: "8", px: "4", py: "2", fontSize: "16" },
      sm: {
        position: "relative",
        minW: "5rem",
        minH: "2.25rem",
        rounded: "6",
        px: "3",
        py: "0.5",
        fontSize: "16",
        _after: tapTargetStyle,
      },
      xs: {
        position: "relative",
        minW: "4.5rem",
        minH: "1.75rem",
        rounded: "4",
        px: "2",
        py: "0.5",
        fontSize: "14",
        _after: tapTargetStyle,
      },
    },
  },
  defaultVariants: {
    variant: "solid-fill",
    size: "md",
  },
});

const StyledButton = chakra("button", buttonRecipe);

export type ButtonVariant = "solid-fill" | "outline" | "text";
export type ButtonSize = "lg" | "md" | "sm" | "xs";

export type ButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "color" | "style" | "disabled"
> & {
  /** 塗り (最重要) / アウトライン / テキスト の順に重要度が下がる */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * 無効状態。DADS の推奨に従い aria-disabled で表現し、フォーカスは受け付けたまま操作だけを無効にする。
   * (可能なら無効化せず、必要な操作をユーザに伝えることを推奨)
   */
  disabled?: boolean;
  /** 子要素 (リンクなど) をボタンとして描画する */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

const preventDefault = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

/** ボタン */
export function Button({
  variant = "solid-fill",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  asChild,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      type={asChild ? undefined : type}
      variant={variant}
      size={size}
      aria-disabled={disabled || undefined}
      onClick={disabled ? preventDefault : onClick}
      asChild={asChild}
      {...rest}
    />
  );
}
