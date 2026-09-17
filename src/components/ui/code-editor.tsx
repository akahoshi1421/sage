import { chakra } from "@chakra-ui/react";
import MonacoEditor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef } from "react";

import { useIsClient } from "./hooks/use-is-client";

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

/** 言語サーバーのセマンティックトークンに付ける色 (VS Code の Light+ 相当)。Monarch の色は vs テーマから継承する */
const SEMANTIC_TOKEN_RULES = [
  { token: "namespace", foreground: "267f99" },
  { token: "type", foreground: "267f99" },
  { token: "class", foreground: "267f99" },
  { token: "enum", foreground: "267f99" },
  { token: "interface", foreground: "267f99" },
  { token: "struct", foreground: "267f99" },
  { token: "typeParameter", foreground: "267f99" },
  { token: "parameter", foreground: "001080" },
  { token: "variable", foreground: "001080" },
  { token: "property", foreground: "001080" },
  { token: "enumMember", foreground: "0070c1" },
  { token: "function", foreground: "795e26" },
  { token: "method", foreground: "795e26" },
  { token: "macro", foreground: "0000ff" },
  { token: "keyword", foreground: "0000ff" },
  { token: "modifier", foreground: "0000ff" },
  { token: "comment", foreground: "008000" },
  { token: "string", foreground: "a31515" },
  { token: "number", foreground: "098658" },
  { token: "regexp", foreground: "811f3f" },
  { token: "operator", foreground: "000000" },
  { token: "decorator", foreground: "795e26" },
];

const THEME = "sage-light";

/** Monaco の API 全体 (`monaco.languages` や `monaco.editor` など) */
export type Monaco = typeof import("monaco-editor");
/** Monaco のエディタが用意できたときに呼ばれる (editor と monaco の API を受け取る) */
export type CodeEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;

export type CodeEditorProps = {
  /** エディタの内容 (制御コンポーネント) */
  value: string;
  /** Monaco の言語 ID (`languageFromFilename` で推定できる)。既定は plaintext */
  language?: string;
  onChange?: (value: string) => void;
  /** Cmd/Ctrl+S で呼ばれる。ブラウザ既定の保存ダイアログは開かない */
  onSave?: (value: string) => void;
  /** モデルの URI (例: `file:///questions/easy/2-safe-parse/answer.ts`)。TypeScript の import 解決などに使われる */
  path?: string;
  /** エディタが用意できたときに呼ばれる (アダプタによる設定など) */
  onMount?: CodeEditorMount;
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
  path,
  onMount,
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

  const onMountRef = useRef(onMount);
  useEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);

  const defineTheme = useCallback<BeforeMount>((monaco) => {
    monaco.editor.defineTheme(THEME, {
      base: "vs",
      inherit: true,
      rules: SEMANTIC_TOKEN_RULES,
      colors: {},
    });
  }, []);

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSaveRef.current?.(editor.getValue());
    });
    onMountRef.current?.(editor, monaco);
  }, []);

  const placeholder = <Placeholder>エディタを読み込み中…</Placeholder>;

  return (
    <Frame className={className} h={height} aria-label={label}>
      {isClient ? (
        <MonacoEditor
          height="100%"
          language={language}
          value={value}
          path={path}
          theme={THEME}
          loading={placeholder}
          onChange={(nextValue) => onChange?.(nextValue ?? "")}
          beforeMount={defineTheme}
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
            "semanticHighlighting.enabled": true,
          }}
        />
      ) : (
        placeholder
      )}
    </Frame>
  );
}
