import { createStore, Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { type ReactNode, useState } from "react";

import { localeAtom } from "./locale";
import type { Locale } from "./messages";

function HydrateLocale({ locale, children }: { locale: Locale; children: ReactNode }) {
  useHydrateAtoms([[localeAtom, locale]]);
  return children;
}

/** サーバーで決まった表示言語をアプリ全体に配る */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [store] = useState(() => createStore());
  return (
    <Provider store={store}>
      <HydrateLocale locale={locale}>{children}</HydrateLocale>
    </Provider>
  );
}
