import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** 正解済みの問題 */
export const solvedQuestions = sqliteTable("solved_questions", {
  /** 問題番号 */
  number: integer("number").primaryKey(),
  /** 正解した日時 (ISO 8601) */
  solvedAt: text("solved_at").notNull(),
});
