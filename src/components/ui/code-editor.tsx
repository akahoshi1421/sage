import { chakra } from "@chakra-ui/react";
import MonacoEditor, { type Monaco, type OnMount } from "@monaco-editor/react";
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

/** Monaco のエディタが用意できたときに呼ばれる (editor と monaco の API を受け取る) */
export type CodeEditorMount = OnMount;
export type { Monaco };

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
