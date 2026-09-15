import { afterEach, describe, expect, it } from "vitest";

import { openProgressDb, type ProgressDbHandle } from "./db";
import { isSolved, listSolvedNumbers, markSolved } from "./repository";

let handle: ProgressDbHandle | undefined;

afterEach(() => {
  handle?.close();
  handle = undefined;
});

describe("正解の記録", () => {
  it("正解を記録すると、その問題だけが正解済みになる", async () => {
    // Arrange
    handle = openProgressDb(":memory:");

    // Act
    await markSolved(handle.db, 7);

    // Assert
    await expect(isSolved(handle.db, 7)).resolves.toBe(true);
    await expect(isSolved(handle.db, 8)).resolves.toBe(false);
    await expect(listSolvedNumbers(handle.db)).resolves.toEqual(new Set([7]));
  });

  it("同じ問題に何度正解しても記録は 1 つのまま", async () => {
    // Arrange
    handle = openProgressDb(":memory:");
    await markSolved(handle.db, 7, new Date("2026-09-15T00:00:00Z"));

    // Act
    await markSolved(handle.db, 7, new Date("2026-09-16T00:00:00Z"));

    // Assert
    await expect(listSolvedNumbers(handle.db)).resolves.toEqual(new Set([7]));
  });

  it("まだ何も解いていなければ正解済みの問題は無い", async () => {
    // Arrange
    handle = openProgressDb(":memory:");

    // Act / Assert
    await expect(listSolvedNumbers(handle.db)).resolves.toEqual(new Set());
  });
});
