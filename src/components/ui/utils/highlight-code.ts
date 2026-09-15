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
