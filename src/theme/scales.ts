/**
 * UI 全体で共有する「選択肢」のスケール。
 * 任意の数値ではなく、この中から選ぶことでレイアウトと文字の大きさを揃える。
 */

/** 余白 (gap / padding / margin) のスケール。値は src/theme/system.ts の spacing トークンに対応する */
export const SPACE_SCALE = ["none", "xs", "sm", "md", "lg", "xl"] as const;
export type SpaceScale = (typeof SPACE_SCALE)[number];

/** 文字サイズのスケール。Text の size に対応する */
export const TEXT_SIZE_SCALE = ["xs", "sm", "md", "lg", "xl"] as const;
export type TextSizeScale = (typeof TEXT_SIZE_SCALE)[number];

/** ブレークポイントごとに値を変えるときの形 (例: `{ base: "sm", md: "lg" }`) */
export type Responsive<T> = T | Partial<Record<"base" | "sm" | "md" | "lg" | "xl" | "2xl", T>>;
