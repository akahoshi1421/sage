import { DIFFICULTIES, type Difficulty, type QuestionSummary } from "./types";

export type QuestionGroup = {
  difficulty: Difficulty;
  questions: QuestionSummary[];
};

/**
 * 問題一覧を難易度ごとにまとめる。
 * 難易度は warm-up → extreme の順、各グループ内は問題番号の昇順。問題のない難易度は含めない。
 */
export function groupQuestionsByDifficulty(questions: QuestionSummary[]): QuestionGroup[] {
  return DIFFICULTIES.map((difficulty) => ({
    difficulty,
    questions: questions
      .filter((question) => question.difficulty === difficulty)
      .toSorted((a, b) => a.number - b.number),
  })).filter((group) => group.questions.length > 0);
}
