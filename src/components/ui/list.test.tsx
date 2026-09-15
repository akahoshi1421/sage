import { describe, expect, it } from "vitest";

import { render, screen, within } from "#/test/render";

import { List, ListItem } from "./list";

describe("リスト", () => {
  it("項目の数と順番がそのまま読み上げられる", () => {
    // Arrange
    render(
      <List as="ol">
        <ListItem>Hello World</ListItem>
        <ListItem>Reactive State</ListItem>
        <ListItem>Computed</ListItem>
      </List>,
    );

    // Assert
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Hello World",
      "Reactive State",
      "Computed",
    ]);
  });

  it("入れ子のリストも一覧として認識される", () => {
    // Arrange
    render(
      <List>
        <ListItem>
          warm-up
          <List>
            <ListItem>Hello World</ListItem>
          </List>
        </ListItem>
      </List>,
    );

    // Assert
    expect(screen.getAllByRole("list")).toHaveLength(2);
  });
});
