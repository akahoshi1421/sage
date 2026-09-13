/** 問題の難易度 (questions/ 直下のディレクトリ名と一致する) */
export const DIFFICULTIES = ["warm-up", "easy", "medium", "hard", "extreme"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** 問題一覧に表示する情報 */
export type QuestionSummary = {
  /** 難易度をまたいで一意な問題番号 (1 始まり) */
  number: number;
  /** ディレクトリ名 (例: `1-hello-world`) */
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** 正解済みかどうか */
  solved: boolean;
};

/** 回答ページで使う問題の詳細 */
export type QuestionDetail = QuestionSummary & {
  /** QUESTION.md の内容 */
  question: string;
  /** HINT.md の内容 */
  hint: string;
  /** ANSWER.md の内容 */
  answer: string;
  /** 回答を書き込むファイル名 (例: `template.ts`) */
  templateFileName: string;
  /** 回答ファイルの現在の内容 */
  templateCode: string;
};

/** 採点結果の判定 */
export type Verdict = "correct" | "close" | "incorrect";

export type MarkResult = {
  verdict: Verdict;
  /** 採点エージェントからの一言 */
  comment: string;
};

/** 学習対象の技術に関する情報 (トップページの概要に使う) */
export type Subject = {
  name: string;
  /** 概要説明 (Markdown) */
  description: string;
};
