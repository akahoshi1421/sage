import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Difficulty } from "#/features/questions/types";
import { type ProjectPaths, resolveProjectPaths } from "#/server/paths";

export type QuestionFixture = {
  difficulty: Difficulty;
  number: number;
  slug: string;
  question?: string;
  hint?: string;
  answer?: string;
  /** テンプレートの拡張子 (既定 ts) */
  extension?: string;
  template?: string;
  /** 指定すると answer ファイルも作る */
  answerCode?: string;
};

export type ProjectFixture = {
  paths: ProjectPaths;
  cleanup: () => Promise<void>;
};

/** テスト用の一時プロジェクト (questions/ 配下の問題ファイル) を作る */
export async function createProjectFixture(options: {
  subject?: string;
  questions?: QuestionFixture[];
  config?: string;
}): Promise<ProjectFixture> {
  const root = await mkdtemp(path.join(os.tmpdir(), "sage-test-"));
  const paths = resolveProjectPaths(root);
  await mkdir(paths.questionsDir, { recursive: true });

  if (options.subject !== undefined) {
    await writeFile(path.join(paths.questionsDir, "README.md"), options.subject, "utf8");
  }
  if (options.config !== undefined) {
    await writeFile(paths.configFile, options.config, "utf8");
  }
  await Promise.all(
    (options.questions ?? []).map(async (question) => {
      const dir = path.join(
        paths.questionsDir,
        question.difficulty,
        `${question.number}-${question.slug}`,
      );
      await mkdir(dir, { recursive: true });
      const extension = question.extension ?? "ts";
      await Promise.all([
        writeFile(
          path.join(dir, "QUESTION.md"),
          question.question ?? `# ${question.slug}\n\n問題文`,
          "utf8",
        ),
        writeFile(path.join(dir, "HINT.md"), question.hint ?? "ヒント", "utf8"),
        writeFile(path.join(dir, "ANSWER.md"), question.answer ?? "答え", "utf8"),
        writeFile(
          path.join(dir, `template.${extension}`),
          question.template ?? "// template\n",
          "utf8",
        ),
        ...(question.answerCode === undefined
          ? []
          : [writeFile(path.join(dir, `answer.${extension}`), question.answerCode, "utf8")]),
      ]);
    }),
  );

  return {
    paths,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}
