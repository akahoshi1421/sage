import { Accordion as ChakraAccordion } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Icon } from "./icon";

export type AccordionItem = {
  /** 項目を識別する値 (開閉状態の管理に使う) */
  value: string;
  /** 見出し (開閉ボタンのラベル) */
  title: ReactNode;
  /** 開いたときに表示する内容 */
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** 初期状態で開いておく項目の value */
  defaultValue?: string[];
  /** 開いている項目の value (制御する場合) */
  value?: string[];
  onValueChange?: (value: string[]) => void;
  /** 複数の項目を同時に開けるか (既定: true) */
  multiple?: boolean;
  className?: string;
};

/**
 * アコーディオン (デジタル庁デザインシステム「アコーディオン」)。
 * 「ヒントを見る」や、ドロワー内の難易度ごとの問題一覧の開閉に使う。
 */
export function Accordion({
  items,
  defaultValue,
  value,
  onValueChange,
  multiple = true,
  className,
}: AccordionProps) {
  return (
    <ChakraAccordion.Root
      className={className}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange ? (details) => onValueChange(details.value) : undefined}
      multiple={multiple}
      collapsible
    >
      {items.map((item) => (
        <ChakraAccordion.Item key={item.value} value={item.value} disabled={item.disabled}>
          <ChakraAccordion.ItemTrigger>
            <ChakraAccordion.ItemIndicator>
              <Icon name="chevron_down" />
            </ChakraAccordion.ItemIndicator>
            {item.title}
          </ChakraAccordion.ItemTrigger>
          <ChakraAccordion.ItemContent>
            <ChakraAccordion.ItemBody>{item.content}</ChakraAccordion.ItemBody>
          </ChakraAccordion.ItemContent>
        </ChakraAccordion.Item>
      ))}
    </ChakraAccordion.Root>
  );
}
