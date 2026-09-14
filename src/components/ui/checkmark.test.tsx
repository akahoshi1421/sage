import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Checkmark } from "./checkmark";

describe("チェックマーク", () => {
  it("回答済みの印は「正解済み」として読み上げられ、チェック済みの状態を持つ", () => {
    // Arrange
    render(<Checkmark checked label="正解済み" />);

    // Assert
    const mark = screen.getByRole("img", { name: "正解済み" });
    expect(mark).toHaveAttribute("data-state", "checked");
  });

  it("未回答の印は「未回答」として読み上げられ、チェックされていない状態を持つ", () => {
    // Arrange
    render(<Checkmark checked={false} label="未回答" />);

    // Assert
    const mark = screen.getByRole("img", { name: "未回答" });
    expect(mark).toHaveAttribute("data-state", "unchecked");
  });

  it("無効な印は無効であることが伝わる", () => {
    // Arrange
    render(<Checkmark checked disabled label="正解済み (無効)" />);

    // Assert
    expect(screen.getByRole("img", { name: "正解済み (無効)" })).toHaveAttribute("data-disabled");
  });
});
