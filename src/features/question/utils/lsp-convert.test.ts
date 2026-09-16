import { describe, expect, it } from "vitest";

import {
  toLspPosition,
  toMonacoCompletionItem,
  toMonacoHover,
  toMonacoMarkers,
  toMonacoSignatureHelp,
} from "./lsp-convert";

const kinds = { Text: 18, Function: 1, Method: 0 };
const conversion = {
  kinds,
  snippetRule: 4,
  defaultRange: { startLineNumber: 3, startColumn: 5, endLineNumber: 3, endColumn: 8 },
};

describe("LSP と Monaco の変換", () => {
  it("位置は 0 始まりと 1 始まりで相互に変換される", () => {
    expect(toLspPosition({ lineNumber: 3, column: 5 })).toEqual({ line: 2, character: 4 });
    expect(
      toMonacoMarkers(
        [
          {
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
            message: "m",
            severity: 2,
          },
        ],
        { Error: 8, Warning: 4, Info: 2, Hint: 1 },
      ),
    ).toEqual([
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 4,
        message: "m",
        severity: 4,
        source: undefined,
        code: undefined,
      },
    ]);
  });

  it("補完候補は種類が名前で対応付けられ、範囲が無ければカーソル位置の単語を置き換える", () => {
    // Act
    const plain = toMonacoCompletionItem(
      { label: "printf", kind: 3, detail: "int printf(const char *, ...)" },
      conversion,
    );
    const snippet = toMonacoCompletionItem(
      {
        label: "for",
        kind: 15,
        insertText: "for (${1:i}) {}",
        insertTextFormat: 2,
        textEdit: {
          range: { start: { line: 2, character: 4 }, end: { line: 2, character: 7 } },
          newText: "for (${1:i}) {}",
        },
      },
      conversion,
    );

    // Assert
    expect(plain).toMatchObject({
      label: "printf",
      kind: 1,
      insertText: "printf",
      range: conversion.defaultRange,
    });
    expect(snippet).toMatchObject({
      kind: 18,
      insertText: "for (${1:i}) {}",
      insertTextRules: 4,
      range: { startLineNumber: 3, startColumn: 5, endLineNumber: 3, endColumn: 8 },
    });
  });

  it("ホバーとシグネチャは Markdown の文字列にまとめられる", () => {
    expect(toMonacoHover({ contents: [{ language: "c", value: "int x" }, "説明"] })).toEqual({
      contents: [{ value: "```c\nint x\n```" }, { value: "説明" }],
      range: undefined,
    });
    expect(toMonacoHover(null)).toBeNull();
    expect(
      toMonacoSignatureHelp({
        signatures: [{ label: "f(int a)", parameters: [{ label: [2, 7] }] }],
        activeParameter: 0,
      }),
    ).toEqual({
      signatures: [
        {
          label: "f(int a)",
          documentation: undefined,
          parameters: [{ label: [2, 7], documentation: undefined }],
          activeParameter: undefined,
        },
      ],
      activeSignature: 0,
      activeParameter: 0,
    });
  });
});
