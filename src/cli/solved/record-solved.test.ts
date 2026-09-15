import { afterEach, describe, expect, it } from "vitest";

import { openProgressDb } from "#/server/progress/db";
import { isSolved } from "#/server/progress/repository";
import { createProjectFixture, type ProjectFixture } from "#/test/project-fixture";

import { recordSolved } from "./record-solved";

let fixture: ProjectFixture | undefined;

afterEach(async () => {
  await fixture?.cleanup();
  fixture = undefined;
});

describe("sage solved", () => {
  it("番号を渡すとその問題が正解済みになり、Web 版と同じ記録が使われる", async () => {
    // Arrange
    fixture = await createProjectFixture({});

    // Act
    await recordSolved(fixture.paths, 7);

    // Assert
    const handle = openProgressDb(fixture.paths.dbFile);
    try {
      await expect(isSolved(handle.db, 7)).resolves.toBe(true);
      await expect(isSolved(handle.db, 8)).resolves.toBe(false);
    } finally {
      handle.close();
    }
  });
});
