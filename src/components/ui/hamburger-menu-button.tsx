import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

import { focusVisibleTextStyle } from "#/theme/focus";

import { Icon } from "./icon";

/**
 * ハンバーガーメニューボタン (デジタル庁デザインシステム「ハンバーガーメニューボタン」)
 * https://design.digital.go.jp/dads/components/hamburger-menu-button/
 */
const hamburgerMenuButtonRecipe = defineRecipe({
  className: "sage-hamburger-menu-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "1",
    width: "fit-content",
    appearance: "none",
    borderWidth: 0,
    bg: "transparent",
    color: "fg",
    touchAction: "manipulation",
    cursor: "pointer",
    _focusVisible: focusVisibleTextStyle,
  },
  variants: {
    variant: {
      label: {
        rounded: "6",
        px: "3",
        pt: "1",
        pb: "1.5",
        textStyle: "oln-16N-100",
        _hover: {
          bg: "solidGray.50",
          textDecoration: "underline",
          textUnderlineOffset: "0.1875rem",
        },
        _icon: {
          color: "black",
        },
      },
      icon: {
        rounded: "4",
        p: "1",
        color: "black",
        _hover: {
          bg: "solidGray.50",
        },
      },
    },
  },
  defaultVariants: {
    variant: "label",
  },
});

const StyledButton = chakra("button", hamburgerMenuButtonRecipe);

export type HamburgerMenuButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "color" | "style" | "children"
> & {
  /** 表示するアイコン (メニューを開く: hamburger / 閉じる: close) */
  icon?: "hamburger" | "close";
  /** ラベル。iconOnly のときは読み上げ用 (aria-label) として使う */
  label?: string;
  /** アイコンだけを表示する (狭い画面向け) */
  iconOnly?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

/** ハンバーガーメニューボタン。ドロワーなどのメニューを開閉する */
export function HamburgerMenuButton({
  icon = "hamburger",
  label = "メニュー",
  iconOnly = false,
  type = "button",
  ...rest
}: HamburgerMenuButtonProps) {
  return (
    <StyledButton
      type={type}
      variant={iconOnly ? "icon" : "label"}
      aria-label={iconOnly ? label : undefined}
      {...rest}
    >
      <Icon name={icon} />
      {iconOnly ? null : label}
    </StyledButton>
  );
}
