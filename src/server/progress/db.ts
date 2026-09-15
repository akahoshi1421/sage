import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { drizzle } from "drizzle-orm/sqlite-proxy";

import * as schema from "./schema";

export type ProgressDb = ReturnType<typeof drizzle<typeof schema>>;

export type ProgressDbHandle = {
  db: ProgressDb;
  close: () => void;
};

/**
 * 進捗 DB を開く (無ければ作る)。
 * 追加の native モジュールを使わず Node 組み込みの sqlite を drizzle の proxy ドライバから使う。
 */
export function openProgressDb(dbFile: string): ProgressDbHandle {
  if (dbFile !== ":memory:") mkdirSync(path.dirname(dbFile), { recursive: true });
  const sqlite = new DatabaseSync(dbFile);
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS solved_questions (number INTEGER PRIMARY KEY, solved_at TEXT NOT NULL)",
  );

  const db = drizzle(
    async (sql, params, method) => {
      const statement = sqlite.prepare(sql);
      const bound = params as Parameters<typeof statement.all>;
      if (method === "run") {
        statement.run(...bound);
        return { rows: [] };
      }
      statement.setReturnArrays(true);
      if (method === "get") {
        // drizzle は get のとき rows に「1 行分の値の配列」を期待する (無ければ undefined)
        return { rows: statement.get(...bound) as unknown as unknown[] };
      }
      return { rows: statement.all(...bound) as unknown as unknown[] };
    },
    { schema },
  );

  return { db, close: () => sqlite.close() };
}
