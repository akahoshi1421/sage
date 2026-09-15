import { describe, expect, it } from "vitest";

import { questionsFixture } from "#/test/fixtures/questions";

import { nextQuestionHrefOf } from "./next-question-href";

const href = (question: { slug: string }) => `/questions/${question.slug}`;

describe("次の問題へのリンク", () => {
  it("番号順で次の問題へ進める (難易度が変わっても続く)", () => {
    expect(nextQuestionHrefOf(questionsFixture, 10, href)).toBe("/questions/11-props");
  });

  it("最後の問題では次の問題が無い", () => {
    expect(nextQuestionHrefOf(questionsFixture, 14, href)).toBeUndefined();
  });

  it("一覧に無い問題からは次へ進めない", () => {
    expect(nextQuestionHrefOf(questionsFixture, 999, href)).toBeUndefined();
  });
});
