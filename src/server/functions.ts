import { pathToFileURL } from "node:url";

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { MarkResult } from "#/features/questions/types";

import { loadConfig } from "./config";
import { readProjectFile, readProjectFiles } from "./editor/project-files";
import { EMPTY_EDITOR_SETTINGS, loadEditorSettings } from "./lsp/editor-settings";
import { resolveLanguageServer } from "./lsp/language-servers";
import { MarkError, markQuestion } from "./marking/mark";
import { EDITOR_ADAPTER_FILE, resolveProjectPaths } from "./paths";
import { openProgressDb } from "./progress/db";
import { listSolvedNumbers } from "./progress/repository";
import {
  listQuestionSummaries,
  readQuestionDetail,
  readSubject,
  resetAnswer,
  saveAnswer,
} from "./questions/repository";

/** `{番号}-{slug}` 形式のディレクトリ名 (パス区切りを含まない) */
const slugSchema = z.string().regex(/^\d+-[^/\\]+$/);

const numberFromSlug = (slug: string) => Number(/^(\d+)-/.exec(slug)?.[1]);

/** 進捗 DB を開いて処理し、必ず閉じる */
async function withProgressDb<T>(
  dbFile: string,
  run: (db: ReturnType<typeof openProgressDb>["db"]) => Promise<T>,
) {
  const handle = openProgressDb(dbFile);
  try {
    return await run(handle.db);
  } finally {
    handle.close();
  }
}

/** sage.editor.js の宣言を読む。壊れていてもページは出す (理由はターミナルに出し、言語サーバーの接続時にも伝わる) */
async function loadEditorSettingsSafely(root: string) {
  try {
    return await loadEditorSettings(root);
  } catch (error) {
    console.error(
      `[sage] sage.editor.js を読めません: ${error instanceof Error ? error.message : String(error)}`,
    );
    return EMPTY_EDITOR_SETTINGS;
  }
}

/** 表示言語などアプリ全体で使う設定 */
export const getAppContext = createServerFn({ method: "GET" }).handler(async () => {
  const paths = resolveProjectPaths();
  const config = await loadConfig(paths.configFile);
  return { locale: config.locale, agent: config.agent };
});

/** トップページ: 学習対象の概要と問題一覧 */
export const getTopPageData = createServerFn({ method: "GET" }).handler(async () => {
  const paths = resolveProjectPaths();
  return withProgressDb(paths.dbFile, async (db) => {
    const solved = await listSolvedNumbers(db);
    const [subject, questions] = await Promise.all([
      readSubject(paths),
      listQuestionSummaries(paths, solved),
    ]);
    return { subject, questions };
  });
});

/** 回答ページ: 問題の詳細と (ドロワー用の) 問題一覧 */
export const getQuestionPageData = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data: slug }) => {
    const paths = resolveProjectPaths();
    const settings = await loadEditorSettingsSafely(paths.root);
    return withProgressDb(paths.dbFile, async (db) => {
      const solved = await listSolvedNumbers(db);
      const [question, questions] = await Promise.all([
        readQuestionDetail(paths, slug, solved.has(numberFromSlug(slug)), settings.languages),
        listQuestionSummaries(paths, solved),
      ]);
      return {
        question,
        questions,
        // エディタのモデルや言語サーバーには実パスの file:// URI を渡す
        rootUri: pathToFileURL(paths.root).href,
        // この問題の言語に使う言語サーバー (宣言か既定の候補。無ければ null で素のエディタ)
        languageServer: question ? resolveLanguageServer(settings, question.language) : null,
      };
    });
  });

/** 回答ファイルを保存する (Cmd/Ctrl+S) */
export const saveAnswerFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ slug: slugSchema, code: z.string() }).parse(input))
  .handler(async ({ data }) => {
    await saveAnswer(resolveProjectPaths(), data.slug, data.code);
  });

/** 回答ファイルをテンプレートの内容に戻す */
export const resetAnswerFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data: slug }) => {
    const code = await resetAnswer(resolveProjectPaths(), slug);
    return { code };
  });

/** エディタのアダプタ (`sage.editor.js`) のソース。無ければ null */
export const getEditorAdapterFn = createServerFn({ method: "GET" }).handler(async () => {
  const source = await readProjectFile(resolveProjectPaths().root, EDITOR_ADAPTER_FILE);
  return { source };
});

/** アダプタ向け: プロジェクト内のディレクトリから拡張子の合うファイルをまとめて読む */
export const readProjectFilesFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ dir: z.string(), suffixes: z.array(z.string()).min(1) }).parse(input),
  )
  .handler(async ({ data }) =>
    readProjectFiles(resolveProjectPaths().root, data.dir, data.suffixes),
  );

/** アダプタ向け: プロジェクト内の 1 ファイルを読む (無ければ null) */
export const readProjectFileFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.string().parse(input))
  .handler(async ({ data: file }) => ({
    content: await readProjectFile(resolveProjectPaths().root, file),
  }));

export type MarkOutcome =
  | { ok: true; result: MarkResult }
  | { ok: false; message: string; output: string };

/** 設定されたエージェントで採点する。正解なら進捗に記録する */
export const markQuestionFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data: slug }): Promise<MarkOutcome> => {
    const paths = resolveProjectPaths();
    const config = await loadConfig(paths.configFile);
    return withProgressDb(paths.dbFile, async (db) => {
      try {
        const result = await markQuestion({
          agent: config.agent,
          number: numberFromSlug(slug),
          cwd: paths.root,
          db,
        });
        return { ok: true, result };
      } catch (error) {
        if (error instanceof MarkError) {
          return { ok: false, message: error.message, output: error.output };
        }
        throw error;
      }
    });
  });
