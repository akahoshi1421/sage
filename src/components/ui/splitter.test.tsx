import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Splitter } from "./splitter";

describe("スプリッター", () => {
  it("2 つの領域と、比率を変えるための区切りが表示される", () => {
    // Arrange
    render(<Splitter start="問題文" end="コード" />);

    // Assert
    expect(screen.getByText("問題文")).toBeInTheDocument();
    expect(screen.getByText("コード")).toBeInTheDocument();
    expect(screen.getByRole("separator", { name: "表示領域の比率を変更" })).toBeInTheDocument();
  });
});
