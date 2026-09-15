import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "#/test/render";

import { HamburgerMenuButton } from "./hamburger-menu-button";

describe("ハンバーガーメニューボタン", () => {
  it("押すとメニューを開く処理が実行される", async () => {
    // Arrange
    const onClick = vi.fn<() => void>();
    render(<HamburgerMenuButton onClick={onClick} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "メニュー" }));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("アイコンだけのボタンでもラベルが支援技術に伝わる", () => {
    // Arrange
    render(<HamburgerMenuButton iconOnly label="問題一覧を開く" />);

    // Assert
    const button = screen.getByRole("button", { name: "問題一覧を開く" });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveTextContent("問題一覧を開く");
  });
});
