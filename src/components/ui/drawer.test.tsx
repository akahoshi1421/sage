import { useState } from "react";
import { describe, expect, it } from "vitest";

import { render, screen, userEvent, waitFor } from "#/test/render";

import { Drawer } from "./drawer";
import { HamburgerMenuButton } from "./hamburger-menu-button";

function QuestionDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} title="問題一覧" trigger={<HamburgerMenuButton />}>
      Hello World
    </Drawer>
  );
}

describe("ドロワー", () => {
  it("メニューボタンを押すとドロワーが開き、閉じるボタンで閉じる", async () => {
    // Arrange
    render(<QuestionDrawer />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "メニュー" }));

    // Assert
    expect(await screen.findByRole("dialog", { name: "問題一覧" })).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeVisible();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "閉じる" }));

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("Esc を押すと閉じる", async () => {
    // Arrange
    render(<QuestionDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "メニュー" }));
    await screen.findByRole("dialog", { name: "問題一覧" });
    await waitFor(() => expect(screen.getByRole("button", { name: "閉じる" })).toHaveFocus());

    // Act
    await userEvent.keyboard("{Escape}");

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
