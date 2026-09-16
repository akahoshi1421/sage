import { useCallback, useState } from "react";

import { type CodeEditorMount, languageFromFilename } from "#/components/ui";
import type { QuestionDetail } from "#/features/questions/types";
import { getEditorAdapterFn, readProjectFileFn, readProjectFilesFn } from "#/server/functions";

import { LanguageClient } from "../utils/lsp-client";
import {
  type EditorAdapter,
  type EditorProject,
  type LanguageServerSpec,
  loadEditorAdapter,
} from "../utils/load-editor-adapter";

/** 言語サーバーの接続状態 (回答バーに表示する) */
export type LanguageServerStatus =
  | { state: "connecting"; command: string }
  | { state: "ready"; command: string }
  | { state: "error"; command: string; reason: string };

// アダプタの読み込みと setup、言語サーバーの接続はページ (Monaco) の寿命で言語ごとに 1 回だけ
let adapterPromise: Promise<EditorAdapter | null> | null = null;
let setupPromise: Promise<void> | null = null;
const clients = new Map<string, Promise<LanguageClient>>();

const loadAdapterOnce = () =>
  (adapterPromise ??= getEditorAdapterFn().then(({ source }) =>
    source === null ? null : loadEditorAdapter(source),
  ));

const languageServerUrl = (language: string) =>
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/_sage/lsp/${encodeURIComponent(language)}`;

/** 言語ごとに 1 本だけ接続する。切れたら次回つなぎ直す */
const connectLanguageServer = (
  monaco: Parameters<CodeEditorMount>[1],
  language: string,
  rootUri: string,
) => {
  let client = clients.get(language);
  if (!client) {
    client = LanguageClient.connect({
      monaco,
      socket: new WebSocket(languageServerUrl(language)),
      language,
      rootUri,
    });
    clients.set(language, client);
    client
      .then((connected) => connected.onDidClose(() => clients.delete(language)))
      .catch(() => clients.delete(language));
  }
  return client;
};

const errorReason = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * プロジェクトの `sage.editor.js` (あれば) を Monaco に適用し、宣言された言語サーバーにつなぐ。
 * `onMount` をエディタに渡す。アダプタの失敗はコンソールに出す (エディタ自体は使える)。
 */
export function useEditorAdapter(question: QuestionDetail, rootUri: string) {
  const [languageServer, setLanguageServer] = useState<LanguageServerStatus | null>(null);

  const onMount = useCallback<CodeEditorMount>(
    (editor, monaco) => {
      const language = languageFromFilename(question.answerFileName);
      const project: EditorProject = {
        rootUri,
        readFiles: (dir, suffixes) => readProjectFilesFn({ data: { dir, suffixes } }),
        readFile: async (file) => (await readProjectFileFn({ data: file })).content,
      };

      const applyAdapter = async (adapter: EditorAdapter) => {
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
            language,
          },
        });
      };

      const attachLanguageServer = async (spec: LanguageServerSpec) => {
        setLanguageServer({ state: "connecting", command: spec.command });
        try {
          const client = await connectLanguageServer(monaco, language, rootUri);
          const model = editor.getModel();
          if (model) {
            const detach = client.attach(model);
            editor.onDidDispose(detach);
          }
          client.onDidClose((reason) =>
            setLanguageServer({ state: "error", command: spec.command, reason }),
          );
          setLanguageServer({ state: "ready", command: spec.command });
        } catch (error) {
          setLanguageServer({ state: "error", command: spec.command, reason: errorReason(error) });
        }
      };

      const run = async () => {
        const adapter = await loadAdapterOnce();
        if (!adapter) return;
        const spec = adapter.languageServers?.[language];
        await Promise.all([
          applyAdapter(adapter),
          spec?.command ? attachLanguageServer(spec) : undefined,
        ]);
      };
      run().catch((error: unknown) => {
        console.error("sage.editor.js の適用に失敗しました", error);
      });
    },
    [question, rootUri],
  );

  return { onMount, languageServer };
}
