import { useCallback, useState } from "react";

import type { CodeEditorMount, Monaco } from "#/components/ui";
import type { QuestionDetail } from "#/features/questions/types";
import { getEditorAdapterFn, readProjectFileFn, readProjectFilesFn } from "#/server/functions";

import { LanguageClient } from "../utils/lsp-client";
import {
  type EditorAdapter,
  type EditorProject,
  type LanguageServerSpec,
  loadEditorAdapter,
} from "../utils/load-editor-adapter";

/** 言語サーバーの接続状態 (回答バーに表示する)。command は表示用 (引数込み) */
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
const connectLanguageServer = (monaco: Monaco, language: string, rootUri: string) => {
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

/** sage (Monaco) が知らない言語 ID なら登録し、モデルの言語をそれにする (色付けは無いが LSP は使える) */
const ensureLanguage = (
  monaco: Monaco,
  question: QuestionDetail,
  model: ReturnType<Monaco["editor"]["getModels"]>[number],
) => {
  if (!monaco.languages.getLanguages().some((known) => known.id === question.language)) {
    const extension = question.answerFileName.slice(question.answerFileName.lastIndexOf("."));
    monaco.languages.register({ id: question.language, extensions: [extension] });
  }
  if (model.getLanguageId() !== question.language) {
    monaco.editor.setModelLanguage(model, question.language);
  }
};

const errorReason = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * プロジェクトの `sage.editor.js` (あれば) を Monaco に適用し、言語サーバー (あれば) につなぐ。
 * `onMount` をエディタに渡す。アダプタの失敗はコンソールに出す (エディタ自体は使える)。
 */
export function useEditorAdapter(
  question: QuestionDetail,
  rootUri: string,
  /** この問題の言語に使う言語サーバー (サーバー側で宣言か既定から決めたもの)。null なら素のエディタ */
  languageServer: LanguageServerSpec | null,
) {
  const [status, setStatus] = useState<LanguageServerStatus | null>(null);

  const onMount = useCallback<CodeEditorMount>(
    (editor, monaco) => {
      const { language } = question;
      const model = editor.getModel();
      if (model) ensureLanguage(monaco, question, model);

      const project: EditorProject = {
        rootUri,
        readFiles: (dir, suffixes) => readProjectFilesFn({ data: { dir, suffixes } }),
        readFile: async (file) => (await readProjectFileFn({ data: file })).content,
      };

      const applyAdapter = async () => {
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
            language,
          },
        });
      };

      const attachLanguageServer = async (spec: LanguageServerSpec) => {
        const command = [spec.command, ...(spec.args ?? [])].join(" ");
        setStatus({ state: "connecting", command });
        try {
          const client = await connectLanguageServer(monaco, language, rootUri);
          if (model) editor.onDidDispose(client.attach(model));
          client.onDidClose((reason) => setStatus({ state: "error", command, reason }));
          setStatus({ state: "ready", command });
        } catch (error) {
          setStatus({ state: "error", command, reason: errorReason(error) });
        }
      };

      applyAdapter().catch((error: unknown) => {
        console.error("sage.editor.js の適用に失敗しました", error);
      });
      if (languageServer) void attachLanguageServer(languageServer);
    },
    [question, rootUri, languageServer],
  );

  return { onMount, languageServer: status };
}
