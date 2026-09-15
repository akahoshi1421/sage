import { describe, expect, it } from "vitest";

import { render, screen, userEvent } from "#/test/render";

import { Accordion } from "./accordion";

describe("アコーディオン", () => {
  it("見出しを押すと内容が表示され、もう一度押すと閉じる", async () => {
    // Arrange
    render(
      <Accordion
        items={[{ value: "hint", title: "ヒントを見る", content: "配列の map を使います" }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "ヒントを見る" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await userEvent.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("配列の map を使います")).toBeVisible();

    // Act
    await userEvent.click(trigger);

    // Assert
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("初期状態で開いておく項目を指定できる", () => {
    // Arrange
    render(
      <Accordion
        defaultValue={["warm-up"]}
        items={[
          { value: "warm-up", title: "warm-up", content: "Hello World" },
          { value: "easy", title: "easy", content: "算出プロパティ" },
        ]}
      />,
    );

    // Assert
    expect(screen.getByRole("button", { name: "warm-up" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "easy" })).toHaveAttribute("aria-expanded", "false");
  });

  it("同時に 1 つだけ開く設定では、別の項目を開くと先に開いていた項目が閉じる", async () => {
    // Arrange
    render(
      <Accordion
        multiple={false}
        items={[
          { value: "a", title: "質問 1", content: "回答 1" },
          { value: "b", title: "質問 2", content: "回答 2" },
        ]}
      />,
    );
    const first = screen.getByRole("button", { name: "質問 1" });
    const second = screen.getByRole("button", { name: "質問 2" });

    // Act
    await userEvent.click(first);
    await userEvent.click(second);

    // Assert
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
