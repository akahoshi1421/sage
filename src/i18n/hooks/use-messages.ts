import { useAtomValue } from "jotai";

import { localeAtom } from "../locale";
import { type Messages, messages } from "../messages";

/** 現在の表示言語の文言を取得する */
export function useMessages(): Messages {
  const locale = useAtomValue(localeAtom);
  return messages[locale];
}
