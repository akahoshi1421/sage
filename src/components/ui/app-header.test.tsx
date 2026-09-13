import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { AppHeader } from "./app-header";

describe("アプリのヘッダー", () => {
  it("ページのヘッダー領域として認識され、サイト名が表示される", () => {
    // Arrange & Act
    render(<AppHeader />);

    // Assert
    expect(screen.getByRole("banner")).toHaveTextContent("sage");
  });

  it("トップページの URL を渡すとサイト名がそのリンクになる", () => {
    // Arrange & Act
    render(<AppHeader homeHref="/" />);

    // Assert
    expect(screen.getByRole("link", { name: "sage" })).toHaveAttribute("href", "/");
  });

  it("左右に渡した要素が表示される", () => {
    // Arrange & Act
    render(
      <AppHeader
        startSlot={<button type="button">メニュー</button>}
        endSlot={<button type="button">問題一覧</button>}
      />,
    );

    // Assert
    expect(screen.getByRole("button", { name: "メニュー" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "問題一覧" })).toBeInTheDocument();
  });
});
