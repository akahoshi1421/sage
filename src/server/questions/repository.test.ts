import { readFile } from "node:fs/promises";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createProjectFixture, type ProjectFixture } from "#/test/project-fixture";

import {
  listQuestionSummaries,
  readQuestionDetail,
  readSubject,
  resetAnswer,
  saveAnswer,
} from "./repository";

let fixture: ProjectFixture | undefined;

afterEach(async () => {
  await fixture?.cleanup();
  fixture = undefined;
});

describe("問題の読み込み", () => {
  it("questions ディレクトリの問題が番号順に一覧になり、難易度とタイトルが分かる", async () => {
    // Arrange
    fixture = await createProjectFixture({
      questions: [
        {
          difficulty: "easy",
          number: 3,
          slug: "v-bind",
          question: "# v-bind で属性を束縛する\n\n本文",
        },
        {
          difficulty: "warm-up",
          number: 1,
          slug: "hello-world",
          question: "# Hello World\n\n本文",
        },
        {
          difficulty: "warm-up",
          number: 2,
          slug: "text-interpolation",
          question: "見出しの無い問題文",
        },
      ],
    });

    // Act
    const questions = await listQuestionSummaries(fixture.paths, new Set([1]));

    // Assert
    expect(questions.map((q) => q.number)).toEqual([1, 2, 3]);
    expect(questions[0]).toMatchObject({
      slug: "1-hello-world",
      title: "Hello World",
      difficulty: "warm-up",
      solved: true,
    });
    expect(questions[1]).toMatchObject({ title: "text interpolation", solved: false });
    expect(questions[2]).toMatchObject({ title: "v-bind で属性を束縛する", difficulty: "easy" });
  });

  it("問題がまだ無くても一覧は空として読める", async () => {
    // Arrange
    fixture = await createProjectFixture({});

    // Act
    const questions = await listQuestionSummaries(fixture.paths, new Set());

    // Assert
    expect(questions).toEqual([]);
  });

  it("学習対象の名前と概要は questions/README.md から読める", async () => {
    // Arrange
    fixture = await createProjectFixture({ subject: "# vue.js\n\nvue.js とは〜" });

    // Act
    const subject = await readSubject(fixture.paths);

    // Assert
    expect(subject).toEqual({ name: "vue.js", description: "vue.js とは〜" });
  });
});

describe("回答ページの問題詳細", () => {
  it("問題文・ヒント・答え・テンプレートと回答ファイルの内容が読める", async () => {
    // Arrange
    fixture = await createProjectFixture({
      questions: [
        {
          difficulty: "easy",
          number: 7,
          slug: "ref",
          question: "# ref でリアクティブな値を作る\n\n`ref` を使ってください。",
          hint: "ヒントです",
          answer: "## 解答例",
          extension: "vue",
          template: "<template />\n",
          answerCode: "<template>answer</template>\n",
        },
      ],
    });

    // Act
    const detail = await readQuestionDetail(fixture.paths, "7-ref", false);

    // Assert
    expect(detail).toMatchObject({
      number: 7,
      title: "ref でリアクティブな値を作る",
      question: "`ref` を使ってください。",
      hint: "ヒントです",
      answer: "## 解答例",
      templateFileName: "template.vue",
      templateCode: "<template />\n",
      answerFileName: "answer.vue",
      answerFilePath: "questions/easy/7-ref/answer.vue",
      answerCode: "<template>answer</template>\n",
    });
  });

  it("回答ファイルがまだ無ければテンプレートの内容で作られる", async () => {
    // Arrange
    fixture = await createProjectFixture({
      questions: [
        { difficulty: "warm-up", number: 1, slug: "hello", template: "console.log('hi');\n" },
      ],
    });

    // Act
    const detail = await readQuestionDetail(fixture.paths, "1-hello", false);

    // Assert
    expect(detail?.answerCode).toBe("console.log('hi');\n");
    const answerFile = path.join(fixture.paths.questionsDir, "warm-up", "1-hello", "answer.ts");
    await expect(readFile(answerFile, "utf8")).resolves.toBe("console.log('hi');\n");
  });

  it("存在しない問題は見つからない", async () => {
    // Arrange
    fixture = await createProjectFixture({});

    // Act / Assert
    await expect(readQuestionDetail(fixture.paths, "99-nothing", false)).resolves.toBeNull();
  });
});

describe("回答ファイルの保存とリセット", () => {
  it("保存すると回答ファイルが更新され、テンプレートは変わらない", async () => {
    // Arrange
    fixture = await createProjectFixture({
      questions: [{ difficulty: "warm-up", number: 1, slug: "hello", template: "// template\n" }],
    });
    const dir = path.join(fixture.paths.questionsDir, "warm-up", "1-hello");

    // Act
    await saveAnswer(fixture.paths, "1-hello", "// my answer\n");

    // Assert
    await expect(readFile(path.join(dir, "answer.ts"), "utf8")).resolves.toBe("// my answer\n");
    await expect(readFile(path.join(dir, "template.ts"), "utf8")).resolves.toBe("// template\n");
  });

  it("リセットすると回答ファイルがテンプレートの内容に戻る", async () => {
    // Arrange
    fixture = await createProjectFixture({
      questions: [
        {
          difficulty: "warm-up",
          number: 1,
          slug: "hello",
          template: "// template\n",
          answerCode: "// edited\n",
        },
      ],
    });

    // Act
    const restored = await resetAnswer(fixture.paths, "1-hello");

    // Assert
    expect(restored).toBe("// template\n");
    const answerFile = path.join(fixture.paths.questionsDir, "warm-up", "1-hello", "answer.ts");
    await expect(readFile(answerFile, "utf8")).resolves.toBe("// template\n");
  });
});
