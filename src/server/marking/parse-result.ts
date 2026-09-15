import type { MarkResult, Verdict } from "#/features/questions/types";

const VERDICT_MARKS: Record<string, Verdict> = {
  "🟢": "correct",
  "🟡": "close",
  "🔴": "incorrect",
};

// 日本語には単語境界 (\b) が効かないので、直後が行末・空白・区切り記号であることを確認する
const VERDICT_LABEL = /^(正解|惜しい|不正解|correct|almost|close|incorrect)(?=$|[\s:：(（\-–—])/i;

/** 「🟢 正解 (一言)」「🔴 Incorrect: ...」のような行から一言だけを取り出す */
function extractComment(rest: string): string {
  let comment = rest.trim().replace(VERDICT_LABEL, "").trim();
  comment = comment.replace(/^[:：\-–—]\s*/, "");
  const wrapped = /^[(（]\s*(.*?)\s*[)）]$/.exec(comment);
  if (wrapped?.[1] !== undefined) comment = wrapped[1];
  return comment.trim();
}

/**
 * 採点エージェントの出力から判定と一言を読み取る。
 * 出力の最後にある 🟢 / 🟡 / 🔴 で始まる行を採用する。見つからなければ null
 */
export function parseMarkOutput(output: string): MarkResult | null {
  const lines = output.split(/\r?\n/).map((line) => line.replace(/^[\s\-*>]+/, "").trim());
  for (const line of lines.toReversed()) {
    for (const [mark, verdict] of Object.entries(VERDICT_MARKS)) {
      if (line.startsWith(mark)) {
        return { verdict, comment: extractComment(line.slice(mark.length)) };
      }
    }
  }
  return null;
}
