import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { focusVisibleTextStyle } from "#/theme/focus";

import { Icon } from "./icon";

/**
 * Markdown 本文のタイポグラフィ (デジタル庁デザインシステムの本文・見出し・コードの定義に合わせる)。
 * QUESTION.md / HINT.md / ANSWER.md や対象技術の概要説明の表示に使う。
 */
const markdownRecipe = defineRecipe({
  className: "sage-markdown",
  base: {
    color: "fg",
    textStyle: "std-16N-170",
    overflowWrap: "anywhere",
    "& > :first-child": { marginTop: 0 },
    "& > :last-child": { marginBottom: 0 },
    "& h1": { textStyle: "std-32B-150", mt: "10", mb: "4" },
    "& h2": { textStyle: "std-28B-150", mt: "10", mb: "4" },
    "& h3": { textStyle: "std-24B-150", mt: "8", mb: "3" },
    "& h4": { textStyle: "std-20B-150", mt: "6", mb: "2" },
    "& h5": { textStyle: "std-18B-160", mt: "6", mb: "2" },
    "& h6": { textStyle: "std-16B-170", mt: "4", mb: "2" },
    "& p": { my: "4" },
    "& a": {
      color: "fg.link",
      textDecoration: "underline",
      textUnderlineOffset: "0.1875rem",
      rounded: "4",
      _hover: { textDecorationThickness: "0.1875rem" },
      _visited: { color: "fg.linkVisited" },
      _active: { color: "fg.linkActive" },
      _focusVisible: focusVisibleTextStyle,
    },
    "& ul, & ol": { my: "4", ps: "6" },
    "& ul": { listStyleType: "disc" },
    "& ol": { listStyleType: "decimal" },
    "& li": { my: "1" },
    "& li > ul, & li > ol": { my: "1" },
    "& li > input[type=checkbox]": { me: "2" },
    "& strong": { fontWeight: 700 },
    "& code": {
      fontFamily: "mono",
      fontSize: "0.875em",
      bg: "solidGray.50",
      rounded: "4",
      px: "1",
      py: "0.5",
    },
    "& pre": {
      my: "4",
      p: "4",
      bg: "solidGray.50",
      rounded: "8",
      overflowX: "auto",
      textStyle: "mono-14N-150",
      "& code": { bg: "transparent", rounded: 0, p: 0, fontSize: "inherit" },
    },
    "& blockquote": {
      my: "4",
      ps: "4",
      borderInlineStartWidth: "4px",
      borderInlineStartStyle: "solid",
      borderColor: "solidGray.300",
      color: "fg.muted",
    },
    "& hr": { my: "8", borderTopWidth: "1px", borderTopStyle: "solid", borderColor: "border" },
    "& table": {
      display: "block",
      maxW: "100%",
      my: "4",
      overflowX: "auto",
      borderCollapse: "collapse",
      textStyle: "dns-16N-130",
    },
    "& th, & td": {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "solidGray.420",
      px: "3",
      py: "2",
      textAlign: "start",
      verticalAlign: "top",
    },
    "& th": { bg: "solidGray.50", fontWeight: 700 },
    "& img": { maxW: "100%", h: "auto" },
  },
});

const Prose = chakra("div", markdownRecipe);

const isExternalHref = (href: string | undefined) => /^https?:\/\//.test(href ?? "");

type AnchorProps = ComponentPropsWithoutRef<"a">;

/** 外部リンクは新しいタブで開き、その旨をアイコンで示す (DADS のリンクと同じ振る舞い) */
const MarkdownLink = ({ href, children, ...rest }: AnchorProps) => {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <Icon name="external_link" size="sm" label="新規タブで開きます" />
      </a>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
};

const components: Components = {
  // react-markdown が渡す `node` は DOM に流さない
  a: ({ node: _node, ...props }) => <MarkdownLink {...props} />,
};

export type MarkdownProps = {
  /** Markdown 文字列 */
  children: string;
  className?: string;
};

/** Markdown を DADS のタイポグラフィで描画する */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <Prose className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </Prose>
  );
}
