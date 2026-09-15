import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import { Dialog, DialogCloseButton } from "./dialog";
import { VStack } from "./layout";
import { Text } from "./text";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    open: false,
    onOpenChange: () => {},
    title: "答え",
    children: "本文",
  },
  argTypes: {
    size: { control: "radio", options: ["md", "lg"] },
    scrollBehavior: { control: "radio", options: ["inside", "outside"] },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const paragraphs = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <Text key={index}>
      これはダミーテキストです。ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。ダミーテキストを使用すると、デザインの全体像を評価したり、テキストの配置や長さを確認したりすることができます。
    </Text>
  ));

export const CloseOnly: Story = {
  name: "閉じるボタンのみ (答えを見る)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        title="答え"
        trigger={<Button variant="outline">答えを見る</Button>}
      >
        <VStack align="stretch" gap="md">
          <Text>
            `ref` で作った値は `.value` で読み書きします。テンプレート内では自動的に展開されます。
          </Text>
          {paragraphs(1)}
        </VStack>
      </Dialog>
    );
  },
};

export const Correct: Story = {
  name: "採点結果: 正解 (閉じる + 次の問題へ)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        title="🟢 正解"
        trigger={<Button>回答する</Button>}
        footer={
          <>
            <DialogCloseButton variant="outline">閉じる</DialogCloseButton>
            <Button onClick={() => setOpen(false)}>次の問題へ</Button>
          </>
        }
      >
        <Text>`ref` と `.value` の使い方が正しく理解できています。</Text>
      </Dialog>
    );
  },
};

export const Incorrect: Story = {
  name: "採点結果: 不正解 (閉じるのみ)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        title="🔴 不正解"
        trigger={<Button>回答する</Button>}
        footer={<DialogCloseButton>閉じる</DialogCloseButton>}
      >
        <Text>`ref` の値をテンプレートの外で使うときは `.value` が必要です。</Text>
      </Dialog>
    );
  },
};

export const LongContent: Story = {
  name: "長い内容 (内側スクロール・幅 lg)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        title="答えと解説"
        size="lg"
        scrollBehavior="inside"
        trigger={<Button variant="outline">答えを見る</Button>}
      >
        <VStack align="stretch" gap="md">
          {paragraphs(12)}
        </VStack>
      </Dialog>
    );
  },
};
