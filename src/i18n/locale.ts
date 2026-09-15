import { atom } from "jotai";

import { DEFAULT_LOCALE, type Locale } from "./messages";

/** 現在の表示言語 */
export const localeAtom = atom<Locale>(DEFAULT_LOCALE);
