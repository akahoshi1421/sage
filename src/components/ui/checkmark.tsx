import { Checkmark as ChakraCheckmark } from "@chakra-ui/react";
import type { Ref } from "react";

export type CheckmarkSize = "sm" | "md" | "lg";

export type CheckmarkProps = {
  /** チェック済みかどうか (回答済みなら true) */
  checked: boolean;
  /** sm: 18px / md: 24px / lg: 33px (デジタル庁のチェックボックスの input 部分と同じ) */
  size?: CheckmarkSize;
  disabled?: boolean;
  /** 読み上げテキスト (例: 「正解済み」「未回答」)。操作できない表示専用なので、状態が伝わる言葉にする */
  label: string;
  className?: string;
  ref?: Ref<SVGSVGElement>;
};

/**
 * チェックマーク (デジタル庁デザインシステム「チェックボックス」の見た目)。
 * 表示専用で操作はできない。チェック済み・未チェックの両方を表示して状態を示す。
 */
export function Checkmark({
  checked,
  size = "sm",
  disabled = false,
  label,
  className,
  ref,
}: CheckmarkProps) {
  return (
    <ChakraCheckmark
      ref={ref}
      checked={checked}
      disabled={disabled}
      size={size}
      // SVG に読み上げ名を付けるには role="img" が正しい (img 要素には置き換えられない)
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label={label}
      className={className}
      strokeWidth="4px"
    />
  );
}
