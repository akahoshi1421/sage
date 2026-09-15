import { describe, expect, it } from "vitest";

import { parseMarkOutput } from "./parse-result";

describe("採点結果の読み取り", () => {
  it("🟢 正解 (一言) の形式から判定と一言が分かる", () => {
    expect(parseMarkOutput("採点します。\n\n🟢 正解 (ref と .value の使い方が正しいです)")).toEqual(
      {
        verdict: "correct",
        comment: "ref と .value の使い方が正しいです",
      },
    );
  });

  it("🟡 惜しい と 🔴 不正解 も判定できる", () => {
    expect(parseMarkOutput("🟡 惜しい: .value が抜けています")).toEqual({
      verdict: "close",
      comment: ".value が抜けています",
    });
    expect(parseMarkOutput("- 🔴 不正解 ref が使われていません")).toEqual({
      verdict: "incorrect",
      comment: "ref が使われていません",
    });
  });

  it("英語の出力でも判定できる", () => {
    expect(parseMarkOutput("🟢 Correct (nice use of ref)")).toEqual({
      verdict: "correct",
      comment: "nice use of ref",
    });
  });

  it("出力の最後にある判定を採用する", () => {
    const output = "前回は 🔴 不正解 でしたが\n\n🟢 正解 (今回は正しいです)";
    expect(parseMarkOutput(output)?.verdict).toBe("correct");
  });

  it("判定の行が無ければ読み取れない", () => {
    expect(parseMarkOutput("エラーが起きました")).toBeNull();
  });
});
