import type { EditorProps } from "@monaco-editor/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "#/test/render";

import { CodeEditor } from "./code-editor";
import { languageFromFilename } from "./utils/language-from-filename";

/** Monaco は jsdom で動かないため、登録されたキーボードコマンドを記録するだけの偽物に置き換える */
const monacoMock = vi.hoisted(() => ({
  commands: [] as { keybinding: number; handler: () => void }[],
  KeyMod: { CtrlCmd: 2048 },
  KeyCode: { KeyS: 49 },
}));

vi.mock("@monaco-editor/react", async () => {
  const React = await import("react");

  const FakeEditor = ({ value, language, onChange, onMount, options }: EditorProps) => {
    const valueRef = React.useRef(value ?? "");
    const onMountRef = React.useRef(onMount);
    React.useEffect(() => {
      valueRef.current = value ?? "";
      onMountRef.current = onMount;
    });

    React.useEffect(() => {
      const editor = {
        getValue: () => valueRef.current,
        addCommand: (keybinding: number, handler: () => void) => {
          monacoMock.commands.push({ keybinding, handler });
          return null;
        },
      };
      const monaco = { KeyMod: monacoMock.KeyMod, KeyCode: monacoMock.KeyCode };
      onMountRef.current?.(editor as never, monaco as never);
    }, []);

    return React.createElement("textarea", {
      "aria-label": "code",
      "data-language": language,
      value: value ?? "",
      readOnly: options?.readOnly,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange?.(event.target.value, undefined as never),
    });
  };

  return { default: FakeEditor };
});

const saveKeybinding = monacoMock.KeyMod.CtrlCmd | monacoMock.KeyCode.KeyS;

describe("コードエディタ", () => {
  beforeEach(() => {
    monacoMock.commands.length = 0;
  });

  it("保存ショートカット (Cmd/Ctrl+S) で現在の内容が保存処理に渡る", () => {
    // Arrange
    const onSave = vi.fn<(value: string) => void>();
    render(<CodeEditor value="const a = 1;" onSave={onSave} />);

    // Act
    const save = monacoMock.commands.find((command) => command.keybinding === saveKeybinding);
    save?.handler();

    // Assert
    expect(onSave).toHaveBeenCalledWith("const a = 1;");
  });

  it("入力すると新しい内容が伝わる", async () => {
    // Arrange
    const onChange = vi.fn<(value: string) => void>();
    render(<CodeEditor value="const a = 1;" onChange={onChange} />);

    // Act
    await userEvent.type(screen.getByLabelText("code"), "x");

    // Assert
    expect(onChange).toHaveBeenLastCalledWith(expect.stringContaining("x"));
  });

  it("読み取り専用のときは編集できない", () => {
    // Arrange & Act
    render(<CodeEditor value="const a = 1;" readOnly />);

    // Assert
    expect(screen.getByLabelText("code")).toHaveAttribute("readonly");
  });

  it("エディタの領域に名前が付いていて支援技術から見つけられる", () => {
    // Arrange & Act
    render(<CodeEditor value="" label="回答コード" />);

    // Assert
    expect(screen.getByRole("region", { name: "回答コード" })).toBeInTheDocument();
  });
});

describe("ファイル名からエディタの言語を決める", () => {
  it.each([
    ["template.ts", "typescript"],
    ["template.tsx", "typescript"],
    ["template.js", "javascript"],
    ["template.py", "python"],
    ["template.rb", "ruby"],
    ["template.go", "go"],
    ["template.rs", "rust"],
    ["questions/easy/1-hello/template.vue", "html"],
    ["Dockerfile", "dockerfile"],
    ["template.unknown", "plaintext"],
    ["template", "plaintext"],
  ])("%s は %s として開く", (filename, language) => {
    expect(languageFromFilename(filename)).toBe(language);
  });
});
