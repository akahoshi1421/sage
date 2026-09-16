import type { editor, IDisposable, languages } from "monaco-editor";

import type { Monaco } from "#/components/ui";

import { JsonRpcSocket } from "./json-rpc-socket";
import {
  type LspCompletionItem,
  type LspCompletionList,
  type LspDiagnostic,
  type LspHover,
  type LspSignatureHelp,
  toLspPosition,
  toMonacoCompletionItem,
  toMonacoDocumentation,
  toMonacoHover,
  toMonacoMarkers,
  toMonacoSignatureHelp,
} from "./lsp-convert";

export type LanguageClientOptions = {
  monaco: Monaco;
  /** 中継先 (`/_sage/lsp/{language}`) につないだ WebSocket */
  socket: WebSocket;
  /** Monaco の言語 ID。LSP の languageId としてそのまま送る */
  language: string;
  /** プロジェクトのルートの file:// URI */
  rootUri: string;
};

type ServerCapabilities = {
  completionProvider?: { triggerCharacters?: string[]; resolveProvider?: boolean };
  hoverProvider?: boolean | object;
  signatureHelpProvider?: { triggerCharacters?: string[]; retriggerCharacters?: string[] };
};

const MARKER_OWNER = "sage-lsp";

/** file:// URI をファイルシステムのパスにする (Windows のドライブ文字も考慮) */
const fsPathOf = (fileUri: string) => {
  const pathname = decodeURIComponent(new URL(fileUri).pathname);
  return /^\/[A-Za-z]:\//.test(pathname) ? pathname.slice(1) : pathname;
};

const waitForOpen = (socket: WebSocket) =>
  new Promise<void>((resolve, reject) => {
    if (socket.readyState === WebSocket.OPEN) return resolve();
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener(
      "close",
      (event) => reject(new Error(event.reason || `connection closed (${event.code})`)),
      { once: true },
    );
  });

const textDocument = (model: editor.ITextModel) => ({ uri: model.uri.toString() });

/**
 * 言語サーバーとの接続 1 本。Monaco の補完・ホバー・シグネチャ・診断へ橋渡しする。
 * 1 つの言語につき 1 つ作り、開く問題 (モデル) は attach で切り替える。
 */
export class LanguageClient {
  private readonly rpc: JsonRpcSocket;
  private readonly disposables: IDisposable[] = [];
  private readonly closeListeners = new Set<(reason: string) => void>();

  private constructor(private readonly options: LanguageClientOptions) {
    this.rpc = new JsonRpcSocket(options.socket, (method, params) =>
      this.handleIncoming(method, params),
    );
    options.socket.addEventListener("close", (event) => {
      this.dispose();
      for (const listener of this.closeListeners) {
        listener(event.reason || `connection closed (${event.code})`);
      }
    });
  }

  /** 接続して initialize を済ませ、サーバーの能力に応じて Monaco にプロバイダを登録する */
  static async connect(options: LanguageClientOptions): Promise<LanguageClient> {
    await waitForOpen(options.socket);
    const client = new LanguageClient(options);
    const { capabilities } = await client.rpc.request<{ capabilities: ServerCapabilities }>(
      "initialize",
      {
        processId: null,
        clientInfo: { name: "sage" },
        rootUri: options.rootUri,
        rootPath: fsPathOf(options.rootUri),
        workspaceFolders: [{ uri: options.rootUri, name: "sage" }],
        capabilities: {
          textDocument: {
            synchronization: { didSave: false },
            completion: {
              completionItem: {
                snippetSupport: true,
                insertReplaceSupport: true,
                documentationFormat: ["markdown", "plaintext"],
              },
            },
            hover: { contentFormat: ["markdown", "plaintext"] },
            signatureHelp: {
              signatureInformation: {
                documentationFormat: ["markdown", "plaintext"],
                parameterInformation: { labelOffsetSupport: true },
              },
            },
            publishDiagnostics: {},
          },
          workspace: { workspaceFolders: true, configuration: true },
        },
      },
    );
    client.rpc.notify("initialized", {});
    client.registerProviders(capabilities);
    return client;
  }

  /** モデルをサーバーに開いて編集を同期する。返り値で閉じる */
  attach(model: editor.ITextModel): () => void {
    const uri = model.uri.toString();
    let version = 1;
    this.rpc.notify("textDocument/didOpen", {
      textDocument: { uri, languageId: this.options.language, version, text: model.getValue() },
    });
    const listener = model.onDidChangeContent(() => {
      version += 1;
      this.rpc.notify("textDocument/didChange", {
        textDocument: { uri, version },
        contentChanges: [{ text: model.getValue() }],
      });
    });
    return () => {
      listener.dispose();
      if (this.options.socket.readyState === WebSocket.OPEN) {
        this.rpc.notify("textDocument/didClose", { textDocument: { uri } });
      }
      this.options.monaco.editor.setModelMarkers(model, MARKER_OWNER, []);
    };
  }

  onDidClose(listener: (reason: string) => void): void {
    this.closeListeners.add(listener);
  }

  dispose(): void {
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
    if (this.options.socket.readyState === WebSocket.OPEN) this.rpc.close();
  }

  private findModel(uri: string): editor.ITextModel | null {
    const { monaco } = this.options;
    const parsed = monaco.Uri.parse(uri);
    const models: editor.ITextModel[] = monaco.editor.getModels();
    return (
      monaco.editor.getModel(parsed) ??
      models.find((model) => model.uri.path === parsed.path) ??
      null
    );
  }

  private handleIncoming(method: string, params: unknown): unknown {
    switch (method) {
      case "textDocument/publishDiagnostics": {
        const { uri, diagnostics } = params as { uri: string; diagnostics: LspDiagnostic[] };
        const model = this.findModel(uri);
        if (model) {
          const { monaco } = this.options;
          monaco.editor.setModelMarkers(
            model,
            MARKER_OWNER,
            toMonacoMarkers(diagnostics, monaco.MarkerSeverity),
          );
        }
        return undefined;
      }
      case "workspace/configuration": {
        const { items } = params as { items: unknown[] };
        return items.map(() => null);
      }
      default:
        // client/registerCapability や進捗の通知などは受け流す
        return null;
    }
  }

  private completionProvider(
    options: NonNullable<ServerCapabilities["completionProvider"]>,
  ): languages.CompletionItemProvider {
    const { monaco } = this.options;
    const originals = new WeakMap<languages.CompletionItem, LspCompletionItem>();
    return {
      triggerCharacters: options.triggerCharacters,
      provideCompletionItems: async (model, position) => {
        const result = await this.rpc.request<LspCompletionList | LspCompletionItem[] | null>(
          "textDocument/completion",
          { textDocument: textDocument(model), position: toLspPosition(position) },
        );
        const items = Array.isArray(result) ? result : (result?.items ?? []);
        const word = model.getWordUntilPosition(position);
        const conversion = {
          kinds: monaco.languages.CompletionItemKind as unknown as Record<string, number>,
          snippetRule: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          defaultRange: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          },
        };
        return {
          suggestions: items.map((item) => {
            const converted = toMonacoCompletionItem(item, conversion);
            originals.set(converted, item);
            return converted;
          }),
          incomplete: !Array.isArray(result) && result?.isIncomplete === true,
        };
      },
      resolveCompletionItem: options.resolveProvider
        ? async (item) => {
            const original = originals.get(item);
            if (!original) return item;
            const resolved = await this.rpc.request<LspCompletionItem>(
              "completionItem/resolve",
              original,
            );
            return {
              ...item,
              detail: resolved.detail ?? item.detail,
              documentation: toMonacoDocumentation(resolved.documentation) ?? item.documentation,
            };
          }
        : undefined,
    };
  }

  private hoverProvider(): languages.HoverProvider {
    return {
      provideHover: async (model, position) =>
        toMonacoHover(
          await this.rpc.request<LspHover | null>("textDocument/hover", {
            textDocument: textDocument(model),
            position: toLspPosition(position),
          }),
        ),
    };
  }

  private signatureHelpProvider(
    options: NonNullable<ServerCapabilities["signatureHelpProvider"]>,
  ): languages.SignatureHelpProvider {
    return {
      signatureHelpTriggerCharacters: options.triggerCharacters,
      signatureHelpRetriggerCharacters: options.retriggerCharacters,
      provideSignatureHelp: async (model, position) => {
        const value = toMonacoSignatureHelp(
          await this.rpc.request<LspSignatureHelp | null>("textDocument/signatureHelp", {
            textDocument: textDocument(model),
            position: toLspPosition(position),
          }),
        );
        return value ? { value, dispose: () => {} } : null;
      },
    };
  }

  private registerProviders(capabilities: ServerCapabilities) {
    const { monaco, language } = this.options;
    if (capabilities.completionProvider) {
      this.disposables.push(
        monaco.languages.registerCompletionItemProvider(
          language,
          this.completionProvider(capabilities.completionProvider),
        ),
      );
    }
    if (capabilities.hoverProvider) {
      this.disposables.push(monaco.languages.registerHoverProvider(language, this.hoverProvider()));
    }
    if (capabilities.signatureHelpProvider) {
      this.disposables.push(
        monaco.languages.registerSignatureHelpProvider(
          language,
          this.signatureHelpProvider(capabilities.signatureHelpProvider),
        ),
      );
    }
  }
}
