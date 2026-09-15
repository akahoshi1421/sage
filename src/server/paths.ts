import path from "node:path";

/** 利用者プロジェクト内の主要なパス */
export type ProjectPaths = {
  /** プロジェクトのルート (通常はカレントディレクトリ) */
  root: string;
  /** 問題ディレクトリ (`questions/`) */
  questionsDir: string;
  /** sage が内部で使うディレクトリ (`.sage/`) */
  sageDir: string;
  /** 進捗 (正解済み) を記録する sqlite ファイル */
  dbFile: string;
  /** `npx sage create` が書き出す設定ファイル */
  configFile: string;
};

/**
 * プロジェクトのパスを解決する。
 * 開発中は環境変数 `SAGE_ROOT` で別のディレクトリ (例: example) を指せる。
 */
export function resolveProjectPaths(root = process.env.SAGE_ROOT ?? process.cwd()): ProjectPaths {
  const resolved = path.resolve(root);
  return {
    root: resolved,
    questionsDir: path.join(resolved, "questions"),
    sageDir: path.join(resolved, ".sage"),
    dbFile: path.join(resolved, ".sage", "progress.db"),
    configFile: path.join(resolved, "sage.config.json"),
  };
}
