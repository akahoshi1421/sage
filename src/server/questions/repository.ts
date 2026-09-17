import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  DIFFICULTIES,
  type Difficulty,
  type QuestionDetail,
  type QuestionSummary,
  type Subject,
} from "#/features/questions/types";

import { languageOf } from "../editor/language-of";
import type { ProjectPaths } from "../paths";
import { splitLeadingHeading } from "./markdown";

/** `questions/{難易度}/{番号}-{slug}/` として見つかった問題ディレクトリ */
export type QuestionDirectory = {
  difficulty: Difficulty;
  number: number;
  slug: string;
  dir: string;
};

const isMissingFile = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";

const readTextOrEmpty = async (file: string) => {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (isMissingFile(error)) return "";
    throw error;
  }
};

const listDirectoryNames = async (dir: string) => {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }
};

/** 問題ディレクトリをすべて見つける (番号順) */
export async function scanQuestionDirectories(paths: ProjectPaths): Promise<QuestionDirectory[]> {
  const perDifficulty = await Promise.all(
    DIFFICULTIES.map(async (difficulty) => {
      const difficultyDir = path.join(paths.questionsDir, difficulty);
      const names = await listDirectoryNames(difficultyDir);
      return names.flatMap((name): QuestionDirectory[] => {
        const match = /^(\d+)-(.+)$/.exec(name);
        if (!match) return [];
        return [
          {
            difficulty,
            number: Number(match[1]),
            slug: name,
            dir: path.join(difficultyDir, name),
          },
        ];
      });
    }),
  );
  return perDifficulty.flat().toSorted((a, b) => a.number - b.number);
}

/** slug から表示用のタイトルを作る (`1-hello-world` → `hello world`) */
const titleFromSlug = (slug: string) => slug.replace(/^\d+-/, "").replaceAll("-", " ");

async function readTitle(directory: QuestionDirectory): Promise<string> {
  const { title } = splitLeadingHeading(
    await readTextOrEmpty(path.join(directory.dir, "QUESTION.md")),
  );
  return title ?? titleFromSlug(directory.slug);
}

/** 問題一覧を読む。`solvedNumbers` に含まれる番号は正解済みとして印を付ける */
export async function listQuestionSummaries(
  paths: ProjectPaths,
  solvedNumbers: ReadonlySet<number>,
): Promise<QuestionSummary[]> {
  const directories = await scanQuestionDirectories(paths);
  return Promise.all(
    directories.map(async (directory) => ({
      number: directory.number,
      slug: directory.slug,
      title: await readTitle(directory),
      difficulty: directory.difficulty,
      solved: solvedNumbers.has(directory.number),
    })),
  );
}

async function findQuestionDirectory(paths: ProjectPaths, slug: string) {
  const directories = await scanQuestionDirectories(paths);
  return directories.find((directory) => directory.slug === slug) ?? null;
}

/** `template.{拡張子}` と `answer.{拡張子}` のファイル名を決める */
async function resolveAnswerFiles(dir: string) {
  const entries = await readdir(dir);
  const templateFileName = entries.find((name) => /^template\.[^.]+$/.test(name));
  if (!templateFileName) {
    throw new Error(`テンプレートファイル (template.*) が見つかりません: ${dir}`);
  }
  const extension = path.extname(templateFileName);
  return {
    templateFileName,
    answerFileName: `answer${extension}`,
    templateFile: path.join(dir, templateFileName),
    answerFile: path.join(dir, `answer${extension}`),
  };
}

/**
 * 回答ファイルの内容を読む。無ければテンプレートから作る
 * (`/sage-create` が作り忘れた場合や、利用者が消した場合の保険)
 */
async function readOrCreateAnswer(templateFile: string, answerFile: string) {
  try {
    return await readFile(answerFile, "utf8");
  } catch (error) {
    if (!isMissingFile(error)) throw error;
    await copyFile(templateFile, answerFile);
    return readFile(answerFile, "utf8");
  }
}

/** 回答ページに必要な問題の詳細を読む。見つからなければ null */
export async function readQuestionDetail(
  paths: ProjectPaths,
  slug: string,
  solved: boolean,
  /** 拡張子 → 言語 ID の宣言 (sage.editor.js の languages) */
  languages: Record<string, string> = {},
): Promise<QuestionDetail | null> {
  const directory = await findQuestionDirectory(paths, slug);
  if (!directory) return null;

  const [questionMarkdown, hint, answer, files] = await Promise.all([
    readTextOrEmpty(path.join(directory.dir, "QUESTION.md")),
    readTextOrEmpty(path.join(directory.dir, "HINT.md")),
    readTextOrEmpty(path.join(directory.dir, "ANSWER.md")),
    resolveAnswerFiles(directory.dir),
  ]);
  const { title, body } = splitLeadingHeading(questionMarkdown);
  const [templateCode, answerCode] = await Promise.all([
    readFile(files.templateFile, "utf8"),
    readOrCreateAnswer(files.templateFile, files.answerFile),
  ]);

  return {
    number: directory.number,
    slug: directory.slug,
    title: title ?? titleFromSlug(directory.slug),
    difficulty: directory.difficulty,
    solved,
    question: body,
    hint: hint.trim(),
    answer: answer.trim(),
    templateFileName: files.templateFileName,
    templateCode,
    answerFileName: files.answerFileName,
    answerFilePath: path.relative(paths.root, files.answerFile).split(path.sep).join("/"),
    language: languageOf(files.answerFileName, languages),
    answerCode,
  };
}

/** 回答ファイルを保存する */
export async function saveAnswer(paths: ProjectPaths, slug: string, code: string): Promise<void> {
  const directory = await findQuestionDirectory(paths, slug);
  if (!directory) throw new Error(`問題が見つかりません: ${slug}`);
  const files = await resolveAnswerFiles(directory.dir);
  await writeFile(files.answerFile, code, "utf8");
}

/** 回答ファイルをテンプレートの内容に戻し、その内容を返す */
export async function resetAnswer(paths: ProjectPaths, slug: string): Promise<string> {
  const directory = await findQuestionDirectory(paths, slug);
  if (!directory) throw new Error(`問題が見つかりません: ${slug}`);
  const files = await resolveAnswerFiles(directory.dir);
  await copyFile(files.templateFile, files.answerFile);
  return readFile(files.answerFile, "utf8");
}

/** 学習対象の概要 (`questions/README.md`) を読む。無ければ空の概要 */
export async function readSubject(paths: ProjectPaths): Promise<Subject> {
  const { title, body } = splitLeadingHeading(
    await readTextOrEmpty(path.join(paths.questionsDir, "README.md")),
  );
  return { name: title ?? path.basename(paths.root), description: body };
}
