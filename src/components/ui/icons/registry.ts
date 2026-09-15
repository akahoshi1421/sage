import { dadsIcons } from "./dads-icons";
import { glyphIcons } from "./glyph-icons";

/** 利用できるアイコン (デジタル庁のアイコン素材 + UI 用のグリフ) */
export const icons = { ...dadsIcons, ...glyphIcons };

export type IconName = keyof typeof icons;

/** 利用できるアイコン名の一覧 (Storybook などの一覧表示用) */
export const iconNames = Object.keys(icons) as IconName[];
