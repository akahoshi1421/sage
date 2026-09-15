import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

/**
 * ディバイダー (デジタル庁デザインシステム「ディバイダー」)
 * https://design.digital.go.jp/dads/components/divider/
 */
const dividerRecipe = defineRecipe({
  className: "sage-divider",
  base: {
    height: 0,
    margin: 0,
    borderStyle: "solid",
    borderTopWidth: "1px",
    borderBottomWidth: 0,
    borderInlineWidth: 0,
  },
  variants: {
    tone: {
      "gray-420": { borderColor: "solidGray.420" },
      "gray-536": { borderColor: "solidGray.536" },
      black: { borderColor: "black" },
    },
  },
  defaultVariants: {
    tone: "gray-420",
  },
});

const StyledDivider = chakra("hr", dividerRecipe);

export type DividerColor = "gray-420" | "gray-536" | "black";

export type DividerProps = Omit<ComponentPropsWithoutRef<"hr">, "color" | "style"> & {
  /** 線の色 (既定は gray-420) */
  color?: DividerColor;
  ref?: Ref<HTMLHRElement>;
};

/** 区切り線。上下の余白はレイアウト側で付ける */
export function Divider({ color = "gray-420", ...rest }: DividerProps) {
  return <StyledDivider tone={color} {...rest} />;
}
