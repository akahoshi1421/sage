import { describe, expect, it } from "vitest";

import { render, screen, waitFor } from "#/test/render";

import { Markdown } from "./markdown";

/** 色分けされたトークン (shiki が付ける色付きの span) */
const coloredTokens = (element: Element) => element.querySelectorAll('span[style*="color"]');

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

  it("コードブロックは言語に応じて色分けされ、内容はそのまま読める", async () => {
    // Arrange
    const markdown = "```ts\nconst a = 1;\n```";

    // Act
    const { container } = render(<Markdown>{markdown}</Markdown>);
    const pre = container.querySelector("pre") as HTMLElement;

    // Assert
    expect(pre).toHaveTextContent("const a = 1;");
    await waitFor(() => expect(coloredTokens(pre).length).toBeGreaterThan(0), { timeout: 10_000 });
    expect(pre).toHaveTextContent("const a = 1;");
  }, 15_000);

  it("対応していない言語のコードブロックもそのまま読める", async () => {
    // Arrange
    const markdown = "```not-a-language\nhello world\n```";

    // Act
    const { container } = render(<Markdown>{markdown}</Markdown>);
    const pre = container.querySelector("pre") as HTMLElement;

    // Assert
    await waitFor(() => expect(pre).toHaveTextContent("hello world"));
    expect(coloredTokens(pre)).toHaveLength(0);
  });

  it("インラインコードは色分けの対象にならない", async () => {
    // Arrange
    const markdown = "`inline` と\n\n```ts\nconst a = 1;\n```";

    // Act
    const { container } = render(<Markdown>{markdown}</Markdown>);
    const pre = container.querySelector("pre") as HTMLElement;

    // Assert
    await waitFor(() => expect(coloredTokens(pre).length).toBeGreaterThan(0), { timeout: 10_000 });
    const inline = screen.getByText("inline");
    expect(inline.tagName).toBe("CODE");
    expect(inline.closest("pre")).toBeNull();
    expect(coloredTokens(inline)).toHaveLength(0);
  }, 15_000);

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
