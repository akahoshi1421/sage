import { createSlotRecipeContext, defineSlotRecipe, type HTMLChakraProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { focusVisibleTextStyle } from "#/theme/focus";

import { Icon } from "./icon";

const appFooterRecipe = defineSlotRecipe({
  className: "sage-app-footer",
  slots: ["root", "inner", "title", "list", "link"],
  base: {
    root: {
      w: "100%",
      bg: "bg.subtle",
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderColor: "border.muted",
      px: { base: "4", md: "6" },
      py: "6",
    },
    inner: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      columnGap: "8",
      rowGap: "2",
    },
    title: {
      textStyle: "std-20B-150",
      color: "fg",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      columnGap: "4",
      rowGap: "2",
      listStyle: "none",
      m: 0,
      p: 0,
    },
    link: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1",
      textStyle: "dns-14N-130",
      color: "fg.muted",
      textDecoration: "underline",
      textUnderlineOffset: "0.1875rem",
      rounded: "4",
      _hover: { color: "fg", textDecorationThickness: "0.1875rem" },
      _focusVisible: { ...focusVisibleTextStyle, color: "fg" },
    },
  },
});

const { withProvider, withContext } = createSlotRecipeContext({ recipe: appFooterRecipe });

const FooterRoot = withProvider<HTMLElement, HTMLChakraProps<"footer">>("footer", "root");
const FooterInner = withContext<HTMLDivElement, HTMLChakraProps<"div">>("div", "inner");
const FooterTitle = withContext<HTMLParagraphElement, HTMLChakraProps<"p">>("p", "title");
const FooterList = withContext<HTMLUListElement, HTMLChakraProps<"ul">>("ul", "list");
const FooterLink = withContext<HTMLAnchorElement, HTMLChakraProps<"a">>("a", "link");

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export type AppFooterLink = {
  label: string;
  href: string;
};

const defaultLinks: AppFooterLink[] = [
  { label: "GitHub", href: "https://github.com/akahoshi1421/sage" },
];

export type AppFooterProps = {
  /** サイト名 (既定は sage) */
  title?: ReactNode;
  /** リンク一覧 (既定は GitHub リポジトリ)。外部リンクは新しいタブで開く */
  links?: AppFooterLink[];
  className?: string;
};

/** アプリ共通フッター */
export function AppFooter({ title = "sage", links = defaultLinks, className }: AppFooterProps) {
  return (
    <FooterRoot className={className}>
      <FooterInner>
        <FooterTitle>{title}</FooterTitle>
        {links.length > 0 && (
          <nav aria-label="関連リンク">
            <FooterList>
              {links.map((link) => {
                const external = isExternalHref(link.href);
                return (
                  <li key={link.href}>
                    <FooterLink
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                      {external && (
                        <Icon name="external_link" size="sm" label="新規タブで開きます" />
                      )}
                    </FooterLink>
                  </li>
                );
              })}
            </FooterList>
          </nav>
        )}
      </FooterInner>
    </FooterRoot>
  );
}
