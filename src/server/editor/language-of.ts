import path from "node:path";

import { languageFromFilename } from "#/components/ui/utils/language-from-filename";

/** ファイル名から Monaco の言語 ID を決める。プロジェクトの宣言 (拡張子 → 言語 ID) が sage の表より優先 */
export function languageOf(fileName: string, languages: Record<string, string> = {}): string {
  const extension = path.extname(fileName).slice(1);
  return languages[extension] ?? languageFromFilename(fileName);
}
