import { chakra } from "@chakra-ui/react";
import type { Ref } from "react";

import { type DadsIconName, dadsIcons } from "./icons/dads-icons";
import { type GlyphIconName, glyphIcons } from "./icons/glyph-icons";

export type IconName = DadsIconName | GlyphIconName;
export type IconSize = "sm" | "md" | "lg";

const icons = { ...dadsIcons, ...glyphIcons };

const sizeMap: Record<IconSize, string> = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

export type IconProps = {
  name: IconName;
  /** sm: 16px / md: 24px / lg: 32px */
  size?: IconSize;
  /**
   * 読み上げ用のラベル。指定しない場合は装飾扱い (aria-hidden) になるので、
   * アイコン単体で意味を持つときは必ず指定する。
   */
  label?: string;
  className?: string;
  ref?: Ref<SVGSVGElement>;
};

/** アイコン (デジタル庁のアイコン素材 + UI 用のグリフ)。色は文字色 (currentColor) に従う */
export function Icon({ name, size = "md", label, ...rest }: IconProps) {
  const icon = icons[name];
  return (
    <chakra.svg
      viewBox={icon.viewBox}
      width={sizeMap[size]}
      height={sizeMap[size]}
      display="inline-block"
      flexShrink={0}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {icon.paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          fill="currentColor"
          fillRule={"fillRule" in path ? path.fillRule : undefined}
          clipRule={"clipRule" in path ? path.clipRule : undefined}
        />
      ))}
    </chakra.svg>
  );
}

/** 利用できるアイコン名の一覧 (Storybook などの一覧表示用) */
export const iconNames = Object.keys(icons) as IconName[];
