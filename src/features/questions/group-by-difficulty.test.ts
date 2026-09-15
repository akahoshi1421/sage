import { describe, expect, it } from "vitest";

import { groupQuestionsByDifficulty } from "./group-by-difficulty";
import type { QuestionSummary } from "./types";

const question = (number: number, difficulty: QuestionSummary["difficulty"]): QuestionSummary => ({
  number,
  slug: `${number}-q`,
  title: `問題 ${number}`,
  difficulty,
  solved: false,
});

describe("問題一覧の難易度ごとの表示", () => {
  it("難易度は易しい順に並び、問題のない難易度は表示されない", () => {
    // Arrange
    const questions = [question(3, "medium"), question(1, "warm-up"), question(2, "easy")];

    // Act
    const groups = groupQuestionsByDifficulty(questions);

    // Assert
    expect(groups.map((group) => group.difficulty)).toEqual(["warm-up", "easy", "medium"]);
  });

  it("同じ難易度の中では問題番号の小さい順に並ぶ", () => {
    // Arrange
    const questions = [question(5, "easy"), question(3, "easy"), question(4, "easy")];

    // Act
    const [group] = groupQuestionsByDifficulty(questions);

    // Assert
    expect(group?.questions.map((q) => q.number)).toEqual([3, 4, 5]);
  });

  it("問題が 1 つもなければ何も表示されない", () => {
    expect(groupQuestionsByDifficulty([])).toEqual([]);
  });
});
