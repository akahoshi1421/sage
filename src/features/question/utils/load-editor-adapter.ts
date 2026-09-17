import type { CodeEditorMount, Monaco } from "#/components/ui";
import type { QuestionDetail } from "#/features/questions/types";

/** アダプタからプロジェクト内のファイルを読むための API (プロジェクトの外は読めない) */
export type EditorProject = {
  /** プロジェクトのルートの file:// URI (回答ファイルのモデルはこの下の実パスで開かれる) */
  rootUri: string;
  /** dir 以下で名前が suffixes のどれかで終わるファイルを { 相対パス: 内容 } で返す */
  readFiles: (dir: string, suffixes: string[]) => Promise<Record<string, string>>;
  /** 1 ファイルの内容 (無ければ null) */
  readFile: (file: string) => Promise<string | null>;
};

/** 開いている問題のうち、アダプタが参照できる情報 */
export type EditorQuestion = Pick<
  QuestionDetail,
  "number" | "slug" | "difficulty" | "title" | "answerFileName" | "answerFilePath"
> & {
  /** Monaco の言語 ID (例: typescript, python) */
  language: string;
};

export type EditorSetupContext = { monaco: Monaco; project: EditorProject };
export type EditorOpenContext = EditorSetupContext & {
  editor: Parameters<CodeEditorMount>[0];
  question: EditorQuestion;
};

/** 言語サーバーの起動方法 (sage がプロジェクトのルートで起動して中継する) */
export type LanguageServerSpec = { command: string; args?: string[] };

/** `sage.editor.js` が export するもの (すべて省略可) */
export type EditorAdapter = {
  /** Monaco が読み込まれたときに 1 回呼ばれる (型定義の登録や言語の追加) */
  setup?: (context: EditorSetupContext) => void | Promise<void>;
  /** 問題を開くたびに呼ばれる (エディタの設定) */
  open?: (context: EditorOpenContext) => void | Promise<void>;
  /** 拡張子 (ドット無し) → Monaco の言語 ID。sage が知らない言語のために宣言する */
  languages?: Record<string, string>;
  /** Monaco の言語 ID ごとの言語サーバー (LSP)。宣言が無い言語は sage の既定の候補から PATH にあるものを使う */
  languageServers?: Record<string, LanguageServerSpec>;
};

/** アダプタのソースを ES モジュールとして読み込む (中の import は URL だけ解決できる) */
export async function loadEditorAdapter(source: string): Promise<EditorAdapter> {
  const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  try {
    return (await import(/* @vite-ignore */ url)) as EditorAdapter;
  } finally {
    URL.revokeObjectURL(url);
  }
}
