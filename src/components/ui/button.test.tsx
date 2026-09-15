import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "#/test/render";

import { Button } from "./button";

describe("ボタン", () => {
  it("押すと指定した処理が実行される", async () => {
    // Arrange
    const onClick = vi.fn<() => void>();
    render(<Button onClick={onClick}>回答する</Button>);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "回答する" }));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("無効化されたボタンは押しても処理が実行されず、押せないことが支援技術に伝わる", async () => {
    // Arrange
    const onClick = vi.fn<() => void>();
    render(
      <Button disabled onClick={onClick}>
        回答する
      </Button>,
    );
    const button = screen.getByRole("button", { name: "回答する" });

    // Act
    await userEvent.click(button, { pointerEventsCheck: 0 });

    // Assert
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("リンクをボタンの見た目で表示できる", () => {
    // Arrange
    render(
      <Button asChild>
        <a href="/questions/1">次の問題へ</a>
      </Button>,
    );

    // Assert
    expect(screen.getByRole("link", { name: "次の問題へ" })).toHaveAttribute(
      "href",
      "/questions/1",
    );
  });
});
