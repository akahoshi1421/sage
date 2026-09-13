import { type ReactNode, useState } from "react";
import { describe, expect, it } from "vitest";

import { render, screen, userEvent, waitFor } from "#/test/render";

import { Button } from "./button";
import { Dialog, DialogCloseButton } from "./dialog";

function AnswerDialog({ footer }: { footer?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="答え"
      footer={footer}
      trigger={<Button variant="outline">答えを見る</Button>}
    >
      ref の値は .value で読み書きします
    </Dialog>
  );
}

describe("モーダルダイアログ", () => {
  it("開くボタンを押すとダイアログが開き、見出しにフォーカスが移る", async () => {
    // Arrange
    render(<AnswerDialog />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "答えを見る" }));

    // Assert
    const dialog = await screen.findByRole("dialog", { name: "答え" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("ref の値は .value で読み書きします")).toBeVisible();
    await waitFor(() => expect(screen.getByRole("heading", { name: "答え" })).toHaveFocus());
  });

  it("Esc を押すと閉じ、開く前に押したボタンにフォーカスが戻る", async () => {
    // Arrange
    render(<AnswerDialog />);
    const trigger = screen.getByRole("button", { name: "答えを見る" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog", { name: "答え" });
    await waitFor(() => expect(screen.getByRole("heading", { name: "答え" })).toHaveFocus());

    // Act
    await userEvent.keyboard("{Escape}");

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("閉じるボタンを押すと閉じる", async () => {
    // Arrange
    render(<AnswerDialog />);
    await userEvent.click(screen.getByRole("button", { name: "答えを見る" }));
    await screen.findByRole("dialog", { name: "答え" });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "閉じる" }));

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("アクションボタンがあるときはヘッダーの閉じるボタンを出さず、アクションボタンで閉じられる", async () => {
    // Arrange
    render(<AnswerDialog footer={<DialogCloseButton>閉じる</DialogCloseButton>} />);
    await userEvent.click(screen.getByRole("button", { name: "答えを見る" }));
    await screen.findByRole("dialog", { name: "答え" });
    const closeButtons = screen.getAllByRole("button", { name: "閉じる" });
    expect(closeButtons).toHaveLength(1);

    // Act
    await userEvent.click(closeButtons[0] as HTMLElement);

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
