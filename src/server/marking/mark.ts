import type { MarkResult } from "#/features/questions/types";

import type { SageConfig } from "../config";
import type { ProgressDb } from "../progress/db";
import { markSolved } from "../progress/repository";
import { buildMarkCommand, type CommandRunner, runCommand } from "./command";
import { parseMarkOutput } from "./parse-result";

/** 採点が実行できなかった、または結果を読み取れなかった */
export class MarkError extends Error {
  readonly output: string;

  constructor(message: string, output: string) {
    super(message);
    this.name = "MarkError";
    this.output = output;
  }
}

export type MarkQuestionOptions = {
  agent: SageConfig["agent"];
  number: number;
  cwd: string;
  db: ProgressDb;
  runner?: CommandRunner;
  timeoutMs?: number;
};

/** 採点エージェントの既定のタイムアウト (10 分) */
export const DEFAULT_MARK_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * エージェントに採点させ、結果を返す。正解なら進捗 DB に記録する。
 */
export async function markQuestion({
  agent,
  number,
  cwd,
  db,
  runner = runCommand,
  timeoutMs = DEFAULT_MARK_TIMEOUT_MS,
}: MarkQuestionOptions): Promise<MarkResult> {
  const command = buildMarkCommand(agent, number);
  const result = await runner(command, { cwd, timeoutMs });
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");

  if (result.timedOut) {
    throw new MarkError("採点がタイムアウトしました", output);
  }
  if (result.exitCode !== 0) {
    throw new MarkError(
      `採点コマンド (${command.command}) が終了コード ${result.exitCode} で失敗しました`,
      output,
    );
  }

  const parsed = parseMarkOutput(result.stdout);
  if (!parsed) {
    throw new MarkError("採点結果を読み取れませんでした", output);
  }
  if (parsed.verdict === "correct") {
    await markSolved(db, number);
  }
  return parsed;
}
