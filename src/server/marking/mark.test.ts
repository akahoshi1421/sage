import { afterEach, describe, expect, it, vi } from "vitest";

import { openProgressDb, type ProgressDbHandle } from "../progress/db";
import { isSolved } from "../progress/repository";
import type { CommandRunner } from "./command";
import { markQuestion } from "./mark";

let handle: ProgressDbHandle | undefined;

afterEach(() => {
  handle?.close();
  handle = undefined;
});

const runnerReturning = (stdout: string, exitCode = 0): CommandRunner =>
  vi.fn<CommandRunner>(async () => ({ stdout, stderr: "", exitCode, timedOut: false }));

describe("回答の採点", () => {
  it("正解と判定されると結果が返り、正解済みとして記録される", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    const runner = runnerReturning("🟢 正解 (よくできました)");

    // Act
    const result = await markQuestion({
      agent: "claude",
      number: 7,
      cwd: "/tmp",
      db: handle.db,
      runner,
    });

    // Assert
    expect(result).toEqual({ verdict: "correct", comment: "よくできました" });
    await expect(isSolved(handle.db, 7)).resolves.toBe(true);
  });

  it("不正解なら結果は返るが正解済みにはならない", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    const runner = runnerReturning("🔴 不正解 (ref が使われていません)");

    // Act
    const result = await markQuestion({
      agent: "claude",
      number: 7,
      cwd: "/tmp",
      db: handle.db,
      runner,
    });

    // Assert
    expect(result.verdict).toBe("incorrect");
    await expect(isSolved(handle.db, 7)).resolves.toBe(false);
  });

  it("Codex では $sage-mark の形式でスキルが呼び出される", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    const runner = runnerReturning("🟢 正解");

    // Act
    await markQuestion({ agent: "codex", number: 3, cwd: "/project", db: handle.db, runner });

    // Assert
    expect(runner).toHaveBeenCalledWith(
      { command: "codex", args: ["exec", "$sage-mark 3"] },
      expect.objectContaining({ cwd: "/project" }),
    );
  });

  it("採点コマンドが失敗したときは理由が分かるエラーになる", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    const runner = runnerReturning("command not found", 127);

    // Act / Assert
    await expect(
      markQuestion({ agent: "claude", number: 7, cwd: "/tmp", db: handle.db, runner }),
    ).rejects.toMatchObject({ name: "MarkError", output: "command not found" });
  });

  it("判定が読み取れない出力のときはエラーになり、正解済みにもならない", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    const runner = runnerReturning("うまく採点できませんでした");

    // Act / Assert
    await expect(
      markQuestion({ agent: "claude", number: 7, cwd: "/tmp", db: handle.db, runner }),
    ).rejects.toThrow("採点結果を読み取れませんでした");
    await expect(isSolved(handle.db, 7)).resolves.toBe(false);
  });
});
