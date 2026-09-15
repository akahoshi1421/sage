import { useEffect, useState } from "react";

import { highlightCode } from "../utils/highlight-code";

type HighlightState = {
  key: string;
  html: string | null;
};

/**
 * コードを表示後にクライアント側で色分けした HTML を返す。
 * 色分け前・失敗時・未対応の言語では null (プレーンなコードを表示する)。
 */
export function useHighlightedCode(code: string, language: string | undefined): string | null {
  const key = `${language ?? ""} ${code}`;
  const [state, setState] = useState<HighlightState | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlightCode(code, language)
      .then((html) => {
        if (!cancelled) setState({ key, html });
      })
      .catch(() => {
        // 色分けに失敗してもプレーンなコードが表示されたままなので何もしない
      });
    return () => {
      cancelled = true;
    };
  }, [code, key, language]);

  return state?.key === key ? state.html : null;
}
