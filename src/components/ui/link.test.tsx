import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Link } from "./link";

describe("リンク", () => {
  it("リンク先へ移動できる", () => {
    // Arrange
    render(<Link href="/questions/1">問題 1 を解く</Link>);

    // Assert
    expect(screen.getByRole("link", { name: "問題 1 を解く" })).toHaveAttribute(
      "href",
      "/questions/1",
    );
  });

  it("新規タブで開くリンクには、その旨が読み上げられるアイコンが付く", () => {
    // Arrange
    render(
      <Link href="https://design.digital.go.jp/" target="_blank">
        デジタル庁デザインシステム
      </Link>,
    );

    // Assert
    expect(screen.getByRole("img", { name: "新規タブで開きます" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /デジタル庁デザインシステム/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("同じタブで開くリンクには新規タブのアイコンが付かない", () => {
    // Arrange
    render(<Link href="/">トップへ戻る</Link>);

    // Assert
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("別のリンク部品をリンクの見た目で表示できる", () => {
    // Arrange
    render(
      <Link asChild>
        <a href="/questions/2">次の問題へ</a>
      </Link>,
    );

    // Assert
    expect(screen.getByRole("link", { name: "次の問題へ" })).toHaveAttribute(
      "href",
      "/questions/2",
    );
  });
});
