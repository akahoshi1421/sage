import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Panel } from "./panel";

describe("パネル", () => {
  it("タイトル付きのパネルは、そのタイトルを名前に持つ領域として見つけられる", () => {
    // Arrange & Act
    render(
      <Panel title="warm-up" titleLevel="h3">
        中身
      </Panel>,
    );

    // Assert
    const region = screen.getByRole("region", { name: "warm-up" });
    expect(region).toHaveTextContent("中身");
    expect(screen.getByRole("heading", { level: 3, name: "warm-up" })).toBeInTheDocument();
  });

  it("タイトルがなければ見出しは表示されない", () => {
    // Arrange & Act
    render(<Panel>中身だけ</Panel>);

    // Assert
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("中身だけ")).toBeInTheDocument();
  });
});
