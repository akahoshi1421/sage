import type { ProjectPaths } from "#/server/paths";
import { openProgressDb } from "#/server/progress/db";
import { markSolved } from "#/server/progress/repository";

/** 問題を正解済みとして進捗 DB に記録する */
export async function recordSolved(paths: ProjectPaths, number: number): Promise<void> {
  const handle = openProgressDb(paths.dbFile);
  try {
    await markSolved(handle.db, number);
  } finally {
    handle.close();
  }
}
