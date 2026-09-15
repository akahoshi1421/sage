import { eq } from "drizzle-orm";

import type { ProgressDb } from "./db";
import { solvedQuestions } from "./schema";

/** 正解済みの問題番号をすべて返す */
export async function listSolvedNumbers(db: ProgressDb): Promise<Set<number>> {
  const rows = await db.select({ number: solvedQuestions.number }).from(solvedQuestions);
  return new Set(rows.map((row) => row.number));
}

/** 問題を正解済みとして記録する (すでに記録済みなら何もしない) */
export async function markSolved(db: ProgressDb, number: number, now = new Date()): Promise<void> {
  await db
    .insert(solvedQuestions)
    .values({ number, solvedAt: now.toISOString() })
    .onConflictDoNothing();
}

export async function isSolved(db: ProgressDb, number: number): Promise<boolean> {
  const row = await db
    .select({ number: solvedQuestions.number })
    .from(solvedQuestions)
    .where(eq(solvedQuestions.number, number))
    .get();
  return row !== undefined;
}
