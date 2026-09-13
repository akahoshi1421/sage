import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, Ref } from "react";

/**
 * リスト (デジタル庁デザインシステム「リスト」)
 * 公式実装では番号を span で手書きするが、sage では ol の decimal マーカーを使う。
 */
const listRecipe = defineRecipe({
  className: "sage-list",
  base: {
    margin: 0,
    paddingInlineStart: "8",
    listStylePosition: "outside",
    "--list-spacing": "0px",
    "& > li": {
      paddingBlock: "var(--list-spacing)",
    },
    "& ul, & ol": {
      marginTop: "var(--list-spacing)",
      marginBottom: "calc(-1 * var(--list-spacing))",
    },
  },
  variants: {
    marker: {
      disc: { listStyleType: "disc" },
      decimal: { listStyleType: "decimal" },
      none: { listStyleType: "none", paddingInlineStart: 0 },
    },
    spacing: {
      "0": { "--list-spacing": "0px" },
      "4": { "--list-spacing": "0.25rem" },
      "8": { "--list-spacing": "0.5rem" },
      "12": { "--list-spacing": "0.75rem" },
    },
  },
  defaultVariants: {
    marker: "disc",
    spacing: "0",
  },
});

const StyledList = chakra("ul", listRecipe);

export type ListMarker = "disc" | "decimal" | "none";
export type ListSpacing = "0" | "4" | "8" | "12";

export type ListProps = Omit<ComponentPropsWithoutRef<"ul">, "color" | "style"> & {
  /** ul (箇条書き) か ol (番号付き) か */
  as?: "ul" | "ol";
  /** マーカーの種類 (既定: ul は disc、ol は decimal) */
  marker?: ListMarker;
  /** 項目間の余白 (px 相当) */
  spacing?: ListSpacing;
  ref?: Ref<HTMLUListElement>;
};

/** 箇条書き・番号付きリスト。入れ子にもできる */
export function List({ as = "ul", marker, spacing = "0", ...rest }: ListProps) {
  return (
    <StyledList
      as={as}
      marker={marker ?? (as === "ol" ? "decimal" : "disc")}
      spacing={spacing}
      {...rest}
    />
  );
}

export type ListItemProps = Omit<ComponentPropsWithoutRef<"li">, "color" | "style"> & {
  ref?: Ref<HTMLLIElement>;
};

/** リストの項目 */
export function ListItem(props: ListItemProps) {
  return <chakra.li {...props} />;
}
