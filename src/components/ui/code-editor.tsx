import { chakra } from "@chakra-ui/react";
import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const EXTENSION_LANGUAGES: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  kt: "kotlin",
  kts: "kotlin",
  cs: "csharp",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  php: "php",
  swift: "swift",
  dart: "dart",
  scala: "scala",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  sql: "sql",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  md: "markdown",
  html: "html",
  vue: "html",
  svelte: "html",
  css: "css",
  scss: "scss",
  less: "less",
  xml: "xml",
  graphql: "graphql",
  gql: "graphql",
  lua: "lua",
  r: "r",
  pl: "perl",
  ps1: "powershell",
  toml: "ini",
  ini: "ini",
};

/** ファイル名 (例: `template.ts`) から Monaco の言語 ID を推定する。不明なら plaintext */
export function languageFromFilename(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  if (/^dockerfile$/i.test(base)) return "dockerfile";
  const dot = base.lastIndexOf(".");
  const extension = dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
  return EXTENSION_LANGUAGES[extension] ?? "plaintext";
}

const Frame = chakra("section", {
  className: "sage-code-editor",
  base: {
    position: "relative",
    minH: 0,
    minW: 0,
    w: "100%",
    bg: "white",
  },
});

/** 読み込み中の表示 (output 要素は暗黙に status ロールを持つ) */
const Placeholder = chakra("output", {
  base: {
    display: "grid",
    placeItems: "center",
    w: "100%",
    h: "100%",
    bg: "bg.subtle",
    color: "fg.muted",
    textStyle: "dns-14N-130",
  },
});

const subscribeNoop = () => () => {};

/** サーバー描画・ハイドレーション中は false、クライアントで描画が確定したら true */
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export type CodeEditorProps = {
  /** エディタの内容 (制御コンポーネント) */
  value: string;
  /** Monaco の言語 ID (`languageFromFilename` で推定できる)。既定は plaintext */
  language?: string;
  onChange?: (value: string) => void;
  /** Cmd/Ctrl+S で呼ばれる。ブラウザ既定の保存ダイアログは開かない */
  onSave?: (value: string) => void;
  /** 高さ。既定は親要素を埋める 100% */
  height?: string | number;
  readOnly?: boolean;
  /** 支援技術向けのラベル */
  label?: string;
  className?: string;
};

/** コードエディタ (Monaco Editor)。回答用の template ファイルの編集に使う */
export function CodeEditor({
  value,
  language = "plaintext",
  onChange,
  onSave,
  height = "100%",
  readOnly = false,
  label = "コードエディタ",
  className,
}: CodeEditorProps) {
  const isClient = useIsClient();

  // Monaco に登録するコマンドは mount 時に固定されるため、最新の onSave を ref 経由で参照する
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveRef.current?.(editor.getValue());
    });
  }, []);

  const placeholder = <Placeholder>エディタを読み込み中…</Placeholder>;

  return (
    <Frame className={className} h={height} aria-label={label}>
      {isClient ? (
        <MonacoEditor
          height="100%"
          language={language}
          value={value}
          theme="light"
          loading={placeholder}
          onChange={(nextValue) => onChange?.(nextValue ?? "")}
          onMount={handleMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Noto Sans Mono', monospace",
            lineHeight: 22,
            tabSize: 2,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      ) : (
        placeholder
      )}
    </Frame>
  );
}
