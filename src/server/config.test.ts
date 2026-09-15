import { afterEach, describe, expect, it } from "vitest";

import { createProjectFixture, type ProjectFixture } from "#/test/project-fixture";

import { DEFAULT_CONFIG, loadConfig } from "./config";

let fixture: ProjectFixture | undefined;

afterEach(async () => {
  await fixture?.cleanup();
  fixture = undefined;
});

describe("設定ファイル", () => {
  it("create で選んだエージェントと言語が読める", async () => {
    // Arrange
    fixture = await createProjectFixture({ config: '{ "agent": "codex", "locale": "ja" }' });

    // Act / Assert
    await expect(loadConfig(fixture.paths.configFile)).resolves.toEqual({
      agent: "codex",
      locale: "ja",
    });
  });

  it("設定ファイルが無ければ既定 (claude / 英語) で動く", async () => {
    // Arrange
    fixture = await createProjectFixture({});

    // Act / Assert
    await expect(loadConfig(fixture.paths.configFile)).resolves.toEqual(DEFAULT_CONFIG);
  });

  it("知らないエージェントが書かれていればエラーになる", async () => {
    // Arrange
    fixture = await createProjectFixture({ config: '{ "agent": "gemini" }' });

    // Act / Assert
    await expect(loadConfig(fixture.paths.configFile)).rejects.toThrow(/claude/);
  });
});
