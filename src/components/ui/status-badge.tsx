import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

/**
 * ステータスバッジ (デジタル庁デザインシステム「ステータスバッジ」)
 * 公式実装は灰色 1 種類のみ。sage では採点結果の表示用に success / warning / error を追加している。
 */
const statusBadgeRecipe = defineRecipe({
  className: "sage-status-badge",
  base: {
    display: "inline-block",
    rounded: "8",
    p: "2",
    textStyle: "oln-16N-100",
    color: "white",
    outlineWidth: "1px",
    outlineStyle: "solid",
    outlineColor: "transparent",
  },
  variants: {
    status: {
      neutral: { bg: "solidGray.536" },
      success: { bg: "success.2" },
      warning: { bg: "warningYellow.2" },
      error: { bg: "error.1" },
    },
  },
  defaultVariants: {
    status: "neutral",
  },
});

const StyledStatusBadge = chakra("span", statusBadgeRecipe);

export type StatusBadgeStatus = "neutral" | "success" | "warning" | "error";

export type StatusBadgeProps = Omit<ComponentPropsWithoutRef<"span">, "color" | "style"> & {
  /** neutral: 汎用 / success: 正解 / warning: 惜しい / error: 不正解 */
  status?: StatusBadgeStatus;
  ref?: Ref<HTMLSpanElement>;
};

/** 状態を示す小さなラベル */
export function StatusBadge({ status = "neutral", ...rest }: StatusBadgeProps) {
  return <StyledStatusBadge status={status} {...rest} />;
}
