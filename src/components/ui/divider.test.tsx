import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Divider } from "./divider";

describe("ディバイダー", () => {
  it("内容の区切りとして支援技術に伝わる", () => {
    // Arrange
    render(<Divider />);

    // Assert
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
