import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { StatusBadge } from "./status-badge";

describe("ステータスバッジ", () => {
  it("採点結果のラベルが表示される", () => {
    // Arrange
    render(<StatusBadge status="success">正解</StatusBadge>);

    // Assert
    expect(screen.getByText("正解")).toBeVisible();
  });
});
