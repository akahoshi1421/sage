import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import { type ReactNode, useRef } from "react";

import { Button, type ButtonProps } from "./button";
import { Icon } from "./icon";

export type DialogSize = "md" | "lg";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 見出し (開いたときに最初にフォーカスされる) */
  title: ReactNode;
  /** 本文 */
  children: ReactNode;
  /**
   * アクションボタン (`DialogCloseButton` や `Button` を並べる)。
   * DADS の方針に従い、アクションボタンがあるときはヘッダーの「閉じる」ボタンを表示しない。
   */
  footer?: ReactNode;
  /** ヘッダーの「閉じる」ボタンのラベル (footer が無いときだけ表示される) */
  closeLabel?: string;
  /** md: 最大 40rem / lg: 最大 64rem (長い解説向け) */
  size?: DialogSize;
  /** 内容が長いとき、ダイアログの内側 (inside) と画面全体 (outside) のどちらをスクロールするか */
  scrollBehavior?: "inside" | "outside";
  /** 確認を求める重要なダイアログは alertdialog にする */
  role?: "dialog" | "alertdialog";
  /** ダイアログを開くボタンなど (押すと open になる) */
  trigger?: ReactNode;
};

/**
 * モーダルダイアログ (デジタル庁デザインシステム「モーダルダイアログ」)。
 * Esc で閉じられ、閉じたあとは開く前にフォーカスしていた要素にフォーカスが戻る。
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  closeLabel = "閉じる",
  size = "md",
  scrollBehavior = "outside",
  role = "dialog",
  trigger,
}: DialogProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <ChakraDialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      size={size}
      scrollBehavior={scrollBehavior}
      role={role}
      initialFocusEl={() => titleRef.current}
      lazyMount
      unmountOnExit
    >
      {trigger ? <ChakraDialog.Trigger asChild>{trigger}</ChakraDialog.Trigger> : null}
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content>
            <ChakraDialog.Header>
              <ChakraDialog.Title ref={titleRef} tabIndex={-1}>
                {title}
              </ChakraDialog.Title>
              {footer ? null : (
                <ChakraDialog.CloseTrigger>
                  <Icon name="close" />
                  {closeLabel}
                </ChakraDialog.CloseTrigger>
              )}
            </ChakraDialog.Header>
            <ChakraDialog.Body>{children}</ChakraDialog.Body>
            {footer ? <ChakraDialog.Footer>{footer}</ChakraDialog.Footer> : null}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}

export type DialogCloseButtonProps = ButtonProps;

/** ダイアログを閉じるボタン (footer に置く)。見た目は Button と同じ */
export function DialogCloseButton(props: DialogCloseButtonProps) {
  return (
    <ChakraDialog.ActionTrigger asChild>
      <Button {...props} />
    </ChakraDialog.ActionTrigger>
  );
}
