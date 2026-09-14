import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineGlobalStyles,
  defineSemanticTokens,
  defineTokens,
} from "@chakra-ui/react";

import { dadsTokens } from "./dads-tokens";
import { accordionSlotRecipe } from "./recipes/accordion";
import { checkmarkRecipe } from "./recipes/checkmark";
import { dialogSlotRecipe } from "./recipes/dialog";
import { drawerSlotRecipe } from "./recipes/drawer";
import { splitterSlotRecipe } from "./recipes/splitter";
import { textStyles } from "./text-styles";

type Scale = Record<string, string | number>;
type TokenScale = Record<string, { value: string }>;

/** `{ 50: "#fff" }` 形式のスケールを Chakra のトークン形式 `{ 50: { value: "#fff" } }` に変換する */
const toTokenScale = (scale: Scale): TokenScale =>
  Object.fromEntries(Object.entries(scale).map(([key, value]) => [key, { value: String(value) }]));

/** `{ 50: "#fff" }` 形式のスケールを、別のトークンを参照するセマンティックトークンに変換する */
const toTokenRefs = (scale: Scale, ref: string) =>
  Object.fromEntries(Object.keys(scale).map((key) => [key, { value: `{${ref}.${key}}` }]));

const { primitive, neutral } = dadsTokens.color;

const tokens = defineTokens({
  colors: {
    white: { value: neutral.white },
    black: { value: neutral.black },
    blue: toTokenScale(primitive.blue),
    lightBlue: toTokenScale(primitive.lightBlue),
    cyan: toTokenScale(primitive.cyan),
    green: toTokenScale(primitive.green),
    lime: toTokenScale(primitive.lime),
    yellow: toTokenScale(primitive.yellow),
    orange: toTokenScale(primitive.orange),
    red: toTokenScale(primitive.red),
    magenta: toTokenScale(primitive.magenta),
    purple: toTokenScale(primitive.purple),
    solidGray: toTokenScale(neutral.solidGray),
    opacityGray: toTokenScale(neutral.opacityGray),
  },
  fonts: {
    sans: { value: dadsTokens.fontFamily.sans },
    mono: { value: dadsTokens.fontFamily.mono },
    body: { value: dadsTokens.fontFamily.sans },
    heading: { value: dadsTokens.fontFamily.sans },
  },
  fontSizes: toTokenScale(dadsTokens.fontSize),
  /**
   * 余白のスケール。レイアウト部品の gap / padding / margin はこの 6 段階からだけ選ぶ。
   * (4px グリッド: xs 4 / sm 8 / md 16 / lg 24 / xl 32)
   */
  spacing: {
    none: { value: "0" },
    xs: { value: "0.25rem" },
    sm: { value: "0.5rem" },
    md: { value: "1rem" },
    lg: { value: "1.5rem" },
    xl: { value: "2rem" },
  },
  lineHeights: toTokenScale(dadsTokens.lineHeight),
  radii: toTokenScale(dadsTokens.borderRadius),
  shadows: {
    elevation: toTokenScale(dadsTokens.elevation),
  },
});

const semanticTokens = defineSemanticTokens({
  colors: {
    /** キーカラー (DADS では Blue) */
    key: {
      ...toTokenRefs(primitive.blue, "colors.blue"),
      contrast: { value: "{colors.white}" },
      fg: { value: "{colors.blue.1000}" },
      subtle: { value: "{colors.blue.50}" },
      muted: { value: "{colors.blue.100}" },
      emphasized: { value: "{colors.blue.200}" },
      solid: { value: "{colors.blue.900}" },
      focusRing: { value: "{colors.yellow.300}" },
      border: { value: "{colors.blue.900}" },
    },
    success: {
      1: { value: "{colors.green.600}" },
      2: { value: "{colors.green.800}" },
    },
    error: {
      1: { value: "{colors.red.800}" },
      2: { value: "{colors.red.900}" },
    },
    warningYellow: {
      1: { value: "{colors.yellow.700}" },
      2: { value: "{colors.yellow.900}" },
    },
    warningOrange: {
      1: { value: "{colors.orange.600}" },
      2: { value: "{colors.orange.800}" },
    },
    /** フォーカスリング (黒のアウトライン + 黄色のリング) */
    focus: {
      outline: { value: "{colors.black}" },
      ring: { value: "{colors.yellow.300}" },
    },
    bg: {
      DEFAULT: { value: "{colors.white}" },
      subtle: { value: "{colors.solidGray.50}" },
      muted: { value: "{colors.solidGray.100}" },
      emphasized: { value: "{colors.solidGray.200}" },
      inverted: { value: "{colors.black}" },
      panel: { value: "{colors.white}" },
      error: { value: "{colors.red.50}" },
      warning: { value: "{colors.yellow.50}" },
      success: { value: "{colors.green.50}" },
      info: { value: "{colors.blue.50}" },
    },
    fg: {
      DEFAULT: { value: "{colors.solidGray.800}" },
      muted: { value: "{colors.solidGray.536}" },
      subtle: { value: "{colors.solidGray.420}" },
      inverted: { value: "{colors.white}" },
      error: { value: "{colors.red.800}" },
      warning: { value: "{colors.yellow.900}" },
      success: { value: "{colors.green.800}" },
      info: { value: "{colors.blue.1000}" },
      link: { value: "{colors.blue.1000}" },
      linkVisited: { value: "{colors.magenta.900}" },
      linkActive: { value: "{colors.orange.800}" },
    },
    border: {
      DEFAULT: { value: "{colors.solidGray.420}" },
      muted: { value: "{colors.solidGray.200}" },
      subtle: { value: "{colors.solidGray.100}" },
      emphasized: { value: "{colors.solidGray.536}" },
      inverted: { value: "{colors.white}" },
      error: { value: "{colors.red.800}" },
      warning: { value: "{colors.yellow.700}" },
      success: { value: "{colors.green.600}" },
      info: { value: "{colors.blue.900}" },
    },
  },
});

const globalCss = defineGlobalStyles({
  "*": {
    fontFeatureSettings: "normal",
  },
  html: {
    fontFamily: "sans",
    color: "fg",
    bg: "bg",
    colorPalette: "key",
    scrollbarGutter: "stable",
  },
  body: {
    textStyle: "std-16N-170",
  },
});

const config = defineConfig({
  globalCss,
  theme: {
    tokens,
    semanticTokens,
    textStyles,
    recipes: {
      checkmark: checkmarkRecipe,
    },
    slotRecipes: {
      accordion: accordionSlotRecipe,
      dialog: dialogSlotRecipe,
      drawer: drawerSlotRecipe,
      splitter: splitterSlotRecipe,
    },
  },
});

/** sage の UI 全体で使う Chakra UI のシステム (デジタル庁デザインシステム準拠) */
export const system = createSystem(defaultConfig, config);
