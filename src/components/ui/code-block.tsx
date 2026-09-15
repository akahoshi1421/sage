import { chakra, defineRecipe } from "@chakra-ui/react";
import { useHighlightedCode } from "./hooks/use-highlighted-code";

const codeBlockRecipe = defineRecipe({
  className: "sage-code-block",
  base: {
    margin: 0,
    p: "4",
    bg: "solidGray.50",
    color: "fg",
    rounded: "8",
    overflowX: "auto",
    textStyle: "mono-14N-150",
    "& > code": {
      display: "block",
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      bg: "transparent",
      p: 0,
      whiteSpace: "pre",
    },
  },
});

const Pre = chakra("pre", codeBlockRecipe);

export type CodeBlockProps = {
  /** 表示するコード */
  code: string;
  /** 言語 (例: `ts`, `vue`, `python`)。未指定や未対応の言語は色分けせずそのまま表示する */
  language?: string;
  className?: string;
};

/**
 * コードブロック。表示後にクライアント側で色分けする
 * (サーバー描画や読み込み中はプレーンなコードを同じ構造で表示する)。
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const html = useHighlightedCode(code, language);

  return (
    <Pre className={className} data-language={language}>
      {html === null ? (
        <code>{code}</code>
      ) : (
        // shiki の出力はエスケープ済みの信頼できる HTML
        <code dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </Pre>
  );
}
