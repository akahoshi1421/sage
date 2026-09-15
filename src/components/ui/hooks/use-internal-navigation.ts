import { createContext, type MouseEvent, useContext } from "react";

import { isInternalHref } from "../utils/is-internal-href";
import { isPlainLeftClick } from "../utils/is-plain-left-click";

/** アプリ内のパスへ遷移する関数 (ルーターが提供する) */
export type Navigate = (href: string) => void;

export const NavigationContext = createContext<Navigate | null>(null);

type ClickHandler = (event: MouseEvent<HTMLElement>) => void;

/**
 * アプリ内リンクのクリックをルーターの遷移に置き換えるハンドラを作る。
 * ルーターが提供されていないとき (Storybook など) や外部リンクでは undefined を返し、通常のリンクとして動く。
 */
export function useInternalNavigation(): (
  href: string | undefined,
  target?: string,
) => ClickHandler | undefined {
  const navigate = useContext(NavigationContext);
  return (href, target) => {
    if (!navigate || !isInternalHref(href) || (target !== undefined && target !== "_self")) {
      return undefined;
    }
    return (event) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      navigate(href);
    };
  };
}
