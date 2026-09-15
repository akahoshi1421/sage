import { useCallback } from "react";

import { type CodeEditorMount, languageFromFilename } from "#/components/ui";
import type { QuestionDetail } from "#/features/questions/types";
import { getEditorAdapterFn, readProjectFileFn, readProjectFilesFn } from "#/server/functions";

import {
  type EditorAdapter,
  type EditorProject,
  loadEditorAdapter,
} from "../utils/load-editor-adapter";

const project: EditorProject = {
  readFiles: (dir, suffixes) => readProjectFilesFn({ data: { dir, suffixes } }),
  readFile: async (file) => (await readProjectFileFn({ data: file })).content,
};

// アダプタの読み込みと setup はページ (Monaco) の寿命で 1 回だけ
let adapterPromise: Promise<EditorAdapter | null> | null = null;
let setupPromise: Promise<void> | null = null;

const loadAdapterOnce = () =>
  (adapterPromise ??= getEditorAdapterFn().then(({ source }) =>
    source === null ? null : loadEditorAdapter(source),
  ));

/**
 * プロジェクトの `sage.editor.js` (あれば) を Monaco に適用する。
 * 返り値をエディタの onMount に渡す。失敗はコンソールに出す (エディタ自体は使える)。
 */
export function useEditorAdapter(question: QuestionDetail): CodeEditorMount {
  return useCallback<CodeEditorMount>(
    (editor, monaco) => {
      const run = async () => {
        const adapter = await loadAdapterOnce();
        if (!adapter) return;
        await (setupPromise ??= Promise.resolve(adapter.setup?.({ monaco, project })));
        await adapter.open?.({
          monaco,
          editor,
          project,
          question: {
            number: question.number,
            slug: question.slug,
            difficulty: question.difficulty,
            title: question.title,
            answerFileName: question.answerFileName,
            answerFilePath: question.answerFilePath,
            language: languageFromFilename(question.answerFileName),
          },
        });
      };
      run().catch((error: unknown) => {
        console.error("sage.editor.js の適用に失敗しました", error);
      });
    },
    [question],
  );
}
