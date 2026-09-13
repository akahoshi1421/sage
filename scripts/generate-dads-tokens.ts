/**
 * デジタル庁デザインシステムのデザイントークン (@digital-go-jp/design-tokens) から
 * Chakra UI のテーマで使う静的トークンファイル `src/theme/dads-tokens.ts` を生成します。
 *
 * 実行: `npm run generate:tokens`
 */
import { readFileSync, writeFileSync } from "node:fs";

import tokens from "@digital-go-jp/design-tokens";

type TokenLeaf = { $value: unknown };

const isTokenLeaf = (value: unknown): value is TokenLeaf =>
  typeof value === "object" && value !== null && "$value" in value;

const toCamelCase = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

/** ネストしたトークン群から `$value` だけを取り出したプレーンなオブジェクトを作る */
function pickValues(node: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (isTokenLeaf(value)) {
      result[toCamelCase(key)] = value.$value;
    } else if (typeof value === "object" && value !== null) {
      result[toCamelCase(key)] = pickValues(value as Record<string, unknown>);
    }
  }
  return result;
}

const { version } = JSON.parse(
  readFileSync("node_modules/@digital-go-jp/design-tokens/package.json", "utf8"),
) as { version: string };

const dadsTokens = {
  color: pickValues(tokens.Color),
  fontFamily: pickValues(tokens.FontFamily),
  fontWeight: pickValues(tokens.FontWeight),
  fontSize: pickValues(tokens.FontSize),
  lineHeight: pickValues(tokens.LineHeight),
  borderRadius: pickValues(tokens.BorderRadius),
  elevation: pickValues(tokens.Elevation),
};

const header = `// このファイルは scripts/generate-dads-tokens.ts により自動生成されています。直接編集しないでください。
//
// 出典: デジタル庁デザインシステム デザイントークン
//   @digital-go-jp/design-tokens v${version} (MIT License)
//   https://github.com/digital-go-jp/design-tokens
//   https://design.digital.go.jp/dads/
`;

writeFileSync(
  "src/theme/dads-tokens.ts",
  `${header}\nexport const dadsTokens = ${JSON.stringify(dadsTokens, null, 2)} as const;\n`,
);

console.log(`Generated src/theme/dads-tokens.ts from @digital-go-jp/design-tokens v${version}`);
