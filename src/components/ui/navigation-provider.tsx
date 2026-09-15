import type { ReactNode } from "react";

import { type Navigate, NavigationContext } from "./hooks/use-internal-navigation";

export type { Navigate };

export type NavigationProviderProps = {
  /** アプリ内のパスへ遷移する関数 (例: TanStack Router の `router.navigate({ href })`) */
  navigate: Navigate;
  children: ReactNode;
};

/** 配下の Link / Button (href) のアプリ内リンクを、ページ全体を読み込み直さない遷移にする */
export function NavigationProvider({ navigate, children }: NavigationProviderProps) {
  return <NavigationContext.Provider value={navigate}>{children}</NavigationContext.Provider>;
}
