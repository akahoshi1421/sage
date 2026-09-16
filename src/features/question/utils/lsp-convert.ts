import type { editor, IRange, languages } from "monaco-editor";

/*
 * Language Server Protocol の型 (使う項目だけ) と、Monaco の型への変換。
 * LSP の位置は 0 始まり、Monaco は 1 始まり。
 */

export type LspPosition = { line: number; character: number };
export type LspRange = { start: LspPosition; end: LspPosition };
export type LspMarkupContent = { kind: "plaintext" | "markdown"; value: string };
export type LspMarkedString = string | { language: string; value: string };
export type LspHover = {
  contents: LspMarkupContent | LspMarkedString | LspMarkedString[];
  range?: LspRange;
};
export type LspTextEdit = { range: LspRange; newText: string };
export type LspInsertReplaceEdit = { newText: string; insert: LspRange; replace: LspRange };
export type LspCompletionItem = {
  label: string;
  kind?: number;
  detail?: string;
  documentation?: string | LspMarkupContent;
  sortText?: string;
  filterText?: string;
  insertText?: string;
  /** 1: そのまま, 2: スニペット */
  insertTextFormat?: 1 | 2;
  textEdit?: LspTextEdit | LspInsertReplaceEdit;
  additionalTextEdits?: LspTextEdit[];
  data?: unknown;
};
export type LspCompletionList = { isIncomplete?: boolean; items: LspCompletionItem[] };
export type LspDiagnostic = {
  range: LspRange;
  message: string;
  /** 1: Error, 2: Warning, 3: Information, 4: Hint */
  severity?: 1 | 2 | 3 | 4;
  source?: string;
  code?: number | string;
};
export type LspParameterInformation = {
  label: string | [number, number];
  documentation?: string | LspMarkupContent;
};
export type LspSignatureInformation = {
  label: string;
  documentation?: string | LspMarkupContent;
  parameters?: LspParameterInformation[];
  activeParameter?: number;
};
export type LspSignatureHelp = {
  signatures: LspSignatureInformation[];
  activeSignature?: number;
  activeParameter?: number;
};

/** LSP の CompletionItemKind (1 始まり) の名前。Monaco の enum を名前で引くのに使う */
const COMPLETION_KIND_NAMES = [
  "Text",
  "Method",
  "Function",
  "Constructor",
  "Field",
  "Variable",
  "Class",
  "Interface",
  "Module",
  "Property",
  "Unit",
  "Value",
  "Enum",
  "Keyword",
  "Snippet",
  "Color",
  "File",
  "Reference",
  "Folder",
  "EnumMember",
  "Constant",
  "Struct",
  "Event",
  "Operator",
  "TypeParameter",
] as const;

export const toLspPosition = (position: { lineNumber: number; column: number }): LspPosition => ({
  line: position.lineNumber - 1,
  character: position.column - 1,
});

export const toMonacoRange = (range: LspRange): IRange => ({
  startLineNumber: range.start.line + 1,
  startColumn: range.start.character + 1,
  endLineNumber: range.end.line + 1,
  endColumn: range.end.character + 1,
});

const toMarkdown = (content: LspMarkedString | LspMarkupContent): string =>
  typeof content === "string"
    ? content
    : "kind" in content
      ? content.value
      : `\`\`\`${content.language}\n${content.value}\n\`\`\``;

export const toMonacoDocumentation = (
  documentation: string | LspMarkupContent | undefined,
): string | { value: string } | undefined =>
  documentation === undefined
    ? undefined
    : typeof documentation === "string"
      ? documentation
      : { value: documentation.value };

export type CompletionConversion = {
  /** monaco.languages.CompletionItemKind */
  kinds: Record<string, number>;
  /** monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet */
  snippetRule: number;
  /** サーバーが範囲を返さないときに置き換える範囲 (カーソル位置の単語) */
  defaultRange: IRange;
};

export function toMonacoCompletionItem(
  item: LspCompletionItem,
  { kinds, snippetRule, defaultRange }: CompletionConversion,
): languages.CompletionItem {
  const kindName = item.kind === undefined ? undefined : COMPLETION_KIND_NAMES[item.kind - 1];
  const edit = item.textEdit;
  const range: IRange | languages.CompletionItemRanges = edit
    ? "range" in edit
      ? toMonacoRange(edit.range)
      : { insert: toMonacoRange(edit.insert), replace: toMonacoRange(edit.replace) }
    : defaultRange;
  return {
    label: item.label,
    kind: (kindName && kinds[kindName]) ?? kinds.Text ?? 0,
    detail: item.detail,
    documentation: toMonacoDocumentation(item.documentation),
    sortText: item.sortText,
    filterText: item.filterText,
    insertText: edit?.newText ?? item.insertText ?? item.label,
    insertTextRules: item.insertTextFormat === 2 ? snippetRule : undefined,
    range,
    additionalTextEdits: item.additionalTextEdits?.map((textEdit) => ({
      range: toMonacoRange(textEdit.range),
      text: textEdit.newText,
    })),
  };
}

export function toMonacoHover(hover: LspHover | null | undefined): languages.Hover | null {
  if (!hover) return null;
  const contents = Array.isArray(hover.contents) ? hover.contents : [hover.contents];
  return {
    contents: contents.map((content) => ({ value: toMarkdown(content) })),
    range: hover.range ? toMonacoRange(hover.range) : undefined,
  };
}

export function toMonacoMarkers(
  diagnostics: LspDiagnostic[],
  /** monaco.MarkerSeverity */
  severities: { Error: number; Warning: number; Info: number; Hint: number },
): editor.IMarkerData[] {
  const bySeverity = [
    severities.Error,
    severities.Error,
    severities.Warning,
    severities.Info,
    severities.Hint,
  ];
  return diagnostics.map((diagnostic) => ({
    ...toMonacoRange(diagnostic.range),
    message: diagnostic.message,
    severity: bySeverity[diagnostic.severity ?? 1] ?? severities.Error,
    source: diagnostic.source,
    code: diagnostic.code === undefined ? undefined : String(diagnostic.code),
  }));
}

export function toMonacoSignatureHelp(
  help: LspSignatureHelp | null | undefined,
): languages.SignatureHelp | null {
  if (!help || help.signatures.length === 0) return null;
  return {
    signatures: help.signatures.map((signature) => ({
      label: signature.label,
      documentation: toMonacoDocumentation(signature.documentation),
      parameters: (signature.parameters ?? []).map((parameter) => ({
        label: parameter.label,
        documentation: toMonacoDocumentation(parameter.documentation),
      })),
      activeParameter: signature.activeParameter,
    })),
    activeSignature: help.activeSignature ?? 0,
    activeParameter: help.activeParameter ?? 0,
  };
}
