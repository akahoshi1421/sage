import { describe, expect, it } from "vitest";

import { render, waitFor } from "#/test/render";

import { CodeBlock } from "./code-block";

/** 色分けされたトークン (shiki が付ける色付きの span) */
const coloredTokens = (element: HTMLElement) => element.querySelectorAll('span[style*="color"]');

describe("コードブロック", () => {
  it("コードは言語に応じて色分けされ、内容はそのまま読める", async () => {
    // Arrange
    const code = "const answer: number = 42;";

    // Act
    const { container } = render(<CodeBlock code={code} language="ts" />);
    const pre = container.querySelector("pre") as HTMLElement;

    // Assert
    await waitFor(() => expect(coloredTokens(pre).length).toBeGreaterThan(0), { timeout: 10_000 });
    expect(pre).toHaveTextContent(code);
  }, 15_000);

  it("対応していない言語でもコードはそのまま読める", async () => {
    // Arrange
    const code = "hello world";

    // Act
    const { container } = render(<CodeBlock code={code} language="not-a-language" />);
    const pre = container.querySelector("pre") as HTMLElement;

    // Assert
    expect(pre).toHaveTextContent(code);
    await waitFor(() => expect(pre).toHaveTextContent(code));
    expect(coloredTokens(pre)).toHaveLength(0);
  });

  it("言語を指定しなくてもコードはそのまま読める", () => {
    // Arrange
    const code = "plain text";

    // Act
    const { container } = render(<CodeBlock code={code} />);

    // Assert
    expect(container.querySelector("pre")).toHaveTextContent(code);
  });
});
