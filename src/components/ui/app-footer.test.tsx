import { describe, expect, it } from "vitest";

import { render, screen } from "#/test/render";

import { AppFooter } from "./app-footer";

describe("アプリのフッター", () => {
  it("ページのフッター領域として認識され、GitHub へのリンクが既定で表示される", () => {
    // Arrange & Act
    render(<AppFooter />);

    // Assert
    expect(screen.getByRole("contentinfo")).toHaveTextContent("sage");
    expect(screen.getByRole("link", { name: "GitHub 新規タブで開きます" })).toHaveAttribute(
      "href",
      "https://github.com/akahoshi1421/sage",
    );
  });

  it("外部リンクは新しいタブで開き、内部リンクは同じタブで開く", () => {
    // Arrange & Act
    render(
      <AppFooter
        links={[
          { label: "GitHub", href: "https://github.com/akahoshi1421/sage" },
          { label: "使い方", href: "/docs" },
        ]}
      />,
    );

    // Assert
    const external = screen.getByRole("link", { name: "GitHub 新規タブで開きます" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "使い方" })).not.toHaveAttribute("target");
  });
});
