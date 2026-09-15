import { chakra, defineRecipe } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { type BundledLanguage, bundledLanguages, createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/** Monaco Editor の既定のライトテーマ (VS Code Light+) と同じ配色 */
const THEME = "light-plus";

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * shiki のハイライタ。WASM を使わない JavaScript の正規表現エンジンで動かし、
 * 最初に必要になったときだけ生成する (言語も使うときに読み込む)。
 */
const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: [THEME],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });
  return highlighterPromise;
};

/** shiki が対応している言語 (別名を含む) かどうか */
export const isHighlightableLanguage = (
  language: string | undefined,
): language is BundledLanguage =>
  language !== undefined && Object.hasOwn(bundledLanguages, language);

/**
 * コードを色分けした HTML (行ごとの span 列) を返す。
 * 対応していない言語や言語未指定のときは null を返す。
 */
export async function highlightCode(
  code: string,
  language: string | undefined,
): Promise<string | null> {
  if (!isHighlightableLanguage(language)) return null;
  const highlighter = await getHighlighter();
  await highlighter.loadLanguage(language);
  return highlighter.codeToHtml(code, { lang: language, theme: THEME, structure: "inline" });
}

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

type HighlightState = {
  key: string;
  html: string | null;
};

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
  const key = `${language ?? ""} ${code}`;
  const [state, setState] = useState<HighlightState | null>(null);
  const html = state?.key === key ? state.html : null;

  useEffect(() => {
    let cancelled = false;
    highlightCode(code, language)
      .then((result) => {
        if (!cancelled) setState({ key, html: result });
      })
      .catch(() => {
        // 色分けに失敗してもプレーンなコードが表示されたままなので何もしない
      });
    return () => {
      cancelled = true;
    };
  }, [code, key, language]);

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
