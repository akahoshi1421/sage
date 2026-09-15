import { Splitter as ChakraSplitter } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** 2 つのペインの比率 (%) */
export type SplitterSize = [number, number];

export type SplitterProps = {
  /** 先頭 (左 / 上) のペイン */
  start: ReactNode;
  /** 末尾 (右 / 下) のペイン */
  end: ReactNode;
  /** 初期の比率 (%) */
  defaultSize?: SplitterSize;
  /** 比率 (%) を制御する場合 */
  size?: SplitterSize;
  onSizeChange?: (size: SplitterSize) => void;
  /** 各ペインの最小比率 (%) */
  minSize?: number;
  orientation?: "horizontal" | "vertical";
  /** 区切り (セパレーター) の読み上げ用ラベル */
  resizeLabel?: string;
  className?: string;
};

const DEFAULT_SIZE: SplitterSize = [50, 50];

/**
 * スプリッター。2 つのペインの比率をドラッグ (またはキーボード) で変えられる。
 * 各ペインは独立してスクロールする。
 */
export function Splitter({
  start,
  end,
  defaultSize = DEFAULT_SIZE,
  size,
  onSizeChange,
  minSize = 20,
  orientation = "horizontal",
  resizeLabel = "表示領域の比率を変更",
  className,
}: SplitterProps) {
  return (
    <ChakraSplitter.Root
      className={className}
      orientation={orientation}
      panels={[
        { id: "start", minSize },
        { id: "end", minSize },
      ]}
      defaultSize={defaultSize}
      size={size}
      onResize={
        onSizeChange
          ? (details) => onSizeChange([details.size[0] ?? 0, details.size[1] ?? 0])
          : undefined
      }
    >
      <ChakraSplitter.Panel id="start">{start}</ChakraSplitter.Panel>
      <ChakraSplitter.ResizeTrigger id="start:end" aria-label={resizeLabel} />
      <ChakraSplitter.Panel id="end">{end}</ChakraSplitter.Panel>
    </ChakraSplitter.Root>
  );
}
