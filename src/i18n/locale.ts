import { atom, useAtomValue } from "jotai";

import { DEFAULT_LOCALE, type Locale, type Messages, messages } from "./messages";

/** 現在の表示言語 */
export const localeAtom = atom<Locale>(DEFAULT_LOCALE);

/** 現在の表示言語の文言を取得する */
export function useMessages(): Messages {
  const locale = useAtomValue(localeAtom);
  return messages[locale];
}
