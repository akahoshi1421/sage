import type { CodeEditorMount, Monaco } from "#/components/ui";
import type { QuestionDetail } from "#/features/questions/types";

/** アダプタからプロジェクト内のファイルを読むための API (プロジェクトの外は読めない) */
export type EditorProject = {
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

/** `sage.editor.js` が export するもの (どちらも省略可) */
export type EditorAdapter = {
  /** Monaco が読み込まれたときに 1 回呼ばれる (型定義の登録や言語の追加) */
  setup?: (context: EditorSetupContext) => void | Promise<void>;
  /** 問題を開くたびに呼ばれる (エディタの設定) */
  open?: (context: EditorOpenContext) => void | Promise<void>;
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
