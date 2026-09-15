import { Drawer as ChakraDrawer, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Icon } from "./icon";

export type DrawerPlacement = "start" | "end";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 支援技術向けの見出し (画面には表示されない) */
  title: string;
  /** ドロワーの内容 (メニューなど) */
  children: ReactNode;
  /** 画面の左 (start) / 右 (end) のどちらから出すか */
  placement?: DrawerPlacement;
  closeLabel?: string;
  /** ドロワーを開くボタンなど (押すと open になる) */
  trigger?: ReactNode;
};

/**
 * ドロワー (デジタル庁デザインシステム「ドロワー」)。
 * 常にモーダルで、上部の「閉じる」ボタン・Esc・外側のクリックで閉じられる。
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  placement = "start",
  closeLabel = "閉じる",
  trigger,
}: DrawerProps) {
  return (
    <ChakraDrawer.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement={placement}
      size="xs"
      lazyMount
      unmountOnExit
    >
      {trigger ? <ChakraDrawer.Trigger asChild>{trigger}</ChakraDrawer.Trigger> : null}
      <Portal>
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content>
            <ChakraDrawer.Title>{title}</ChakraDrawer.Title>
            <ChakraDrawer.Header justifyContent={placement === "end" ? "flex-end" : "flex-start"}>
              <ChakraDrawer.CloseTrigger>
                <Icon name="close" />
                {closeLabel}
              </ChakraDrawer.CloseTrigger>
            </ChakraDrawer.Header>
            <ChakraDrawer.Body>{children}</ChakraDrawer.Body>
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
}
