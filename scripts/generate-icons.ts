/**
 * デジタル庁の「イラストレーション・アイコン素材」(docs/designsystem-assets/icon/svg, git 管理外) から
 * sage で使うアイコンだけを選び、React で描画できる形 (viewBox と path の一覧) に変換して
 * `src/components/ui/icons/dads-icons.ts` を生成します。
 *
 * 実行: `npm run generate:icons`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ASSET_DIR = "docs/designsystem-assets/icon/svg";
const OUTPUT = "src/components/ui/icons/dads-icons.ts";

/** sage で使うアイコン名 (line / fill の両方を取り込む) */
const ICON_NAMES = [
  "add",
  "arrow_down",
  "arrow_left",
  "arrow_right",
  "arrow_up",
  "attention",
  "complete",
  "copy",
  "documents",
  "download",
  "help",
  "history",
  "information",
  "menu",
  "new_window",
  "notification",
  "search",
  "update",
] as const;

type IconPath = { d: string; fillRule?: string; clipRule?: string };
type IconDefinition = { viewBox: string; paths: IconPath[] };

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

function parseSvg(file: string, svg: string): IconDefinition {
  const viewBox = attr(svg, "viewBox");
  if (!viewBox) throw new Error(`${file}: viewBox がありません`);

  // clipPath の矩形などを含む <defs> は不要なので取り除く
  const body = svg.replace(/<defs>[\s\S]*?<\/defs>/g, "");
  const unsupported = body.match(/<(rect|circle|ellipse|line|polygon|polyline)\b/);
  if (unsupported) throw new Error(`${file}: <${unsupported[1]}> は未対応です`);

  const paths = [...body.matchAll(/<path\b[^>]*\/?>/g)].map(([tag]) => {
    const d = attr(tag, "d");
    if (!d) throw new Error(`${file}: d 属性のない <path> があります`);
    const path: IconPath = { d };
    const fillRule = attr(tag, "fill-rule");
    const clipRule = attr(tag, "clip-rule");
    if (fillRule) path.fillRule = fillRule;
    if (clipRule) path.clipRule = clipRule;
    return path;
  });
  if (paths.length === 0) throw new Error(`${file}: <path> がありません`);

  return { viewBox, paths };
}

const icons: Record<string, IconDefinition> = {};
for (const name of ICON_NAMES) {
  for (const style of ["line", "fill"] as const) {
    const file = `${name}_${style}.svg`;
    icons[`${name}_${style}`] = parseSvg(file, readFileSync(join(ASSET_DIR, file), "utf8"));
  }
}

const header = `// このファイルは scripts/generate-icons.ts により自動生成されています。直接編集しないでください。
//
// 出典: 「イラストレーション・アイコン素材」(デジタル庁) https://www.digital.go.jp/
//   https://design.digital.go.jp/dads/foundations/icon/ の素材を元に、
//   塗り色を currentColor に置き換え、clipPath を取り除く加工をしています。
//   利用規約: docs/designsystem-assets/LICENSE.txt
`;

writeFileSync(
  OUTPUT,
  `${header}\nexport const dadsIcons = ${JSON.stringify(icons, null, 2)} as const;\n\nexport type DadsIconName = keyof typeof dadsIcons;\n`,
);

console.log(`Generated ${OUTPUT} (${Object.keys(icons).length} icons)`);
