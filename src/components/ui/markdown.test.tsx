import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { Markdown } from "./markdown";

describe("Markdown の表示", () => {
  it("見出しが見出しとして読める", () => {
    // Arrange
    const markdown = "# 1. Hello World\n\n## 要件";

    // Act
    render(<Markdown>{markdown}</Markdown>);

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "1. Hello World" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "要件" })).toBeInTheDocument();
  });

  it("コードブロックの内容がそのまま表示される", () => {
    // Arrange
    const markdown = "```ts\nconst a = 1;\n```";

    // Act
    render(<Markdown>{markdown}</Markdown>);

    // Assert
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
  });

  it("外部リンクは新しいタブで開き、その旨が伝わる", () => {
    // Arrange
    const markdown = "[公式ドキュメント](https://vuejs.org/) と [目次](#toc)";

    // Act
    render(<Markdown>{markdown}</Markdown>);

    // Assert
    const external = screen.getByRole("link", { name: "公式ドキュメント 新規タブで開きます" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "目次" })).not.toHaveAttribute("target");
  });

  it("表 (GFM) が表として読める", () => {
    // Arrange
    const markdown = "| 構文 | 用途 |\n| --- | --- |\n| `{{ }}` | テキスト |";

    // Act
    render(<Markdown>{markdown}</Markdown>);

    // Assert
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "構文" })).toBeInTheDocument();
  });
});
