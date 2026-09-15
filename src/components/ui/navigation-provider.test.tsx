import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "#/test/render";

import { Button } from "./button";
import { Link } from "./link";
import { NavigationProvider } from "./navigation-provider";

describe("アプリ内リンクの遷移", () => {
  it("ルーターがあるとき、アプリ内リンクはページを読み込み直さずに遷移する", async () => {
    // Arrange
    const navigate = vi.fn<(href: string) => void>();
    render(
      <NavigationProvider navigate={navigate}>
        <Link href="/questions/7-ref">問題 7</Link>
      </NavigationProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("link", { name: "問題 7" }));

    // Assert
    expect(navigate).toHaveBeenCalledWith("/questions/7-ref");
  });

  it("新しいタブで開く操作 (修飾キー付きクリック) はブラウザに任せる", async () => {
    // Arrange
    const navigate = vi.fn<(href: string) => void>();
    render(
      <NavigationProvider navigate={navigate}>
        <Link href="/questions/7-ref">問題 7</Link>
      </NavigationProvider>,
    );
    const user = userEvent.setup();

    // Act
    await user.keyboard("{Meta>}");
    await user.click(screen.getByRole("link", { name: "問題 7" }));
    await user.keyboard("{/Meta}");

    // Assert
    expect(navigate).not.toHaveBeenCalled();
  });

  it("外部リンクはルーターでは遷移しない", async () => {
    // Arrange
    const navigate = vi.fn<(href: string) => void>();
    render(
      <NavigationProvider navigate={navigate}>
        <Link href="https://example.com/" target="_blank">
          外部
        </Link>
      </NavigationProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("link", { name: /外部/ }));

    // Assert
    expect(navigate).not.toHaveBeenCalled();
  });

  it("ルーターが無いとき (Storybook など) は通常のリンクとして動く", async () => {
    // Arrange
    const onClick = vi.fn<() => void>();
    render(
      <Link href="/questions/7-ref" onClick={onClick}>
        問題 7
      </Link>,
    );

    // Act
    await userEvent.click(screen.getByRole("link", { name: "問題 7" }));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("リンクとして描画したボタンも同じように遷移する", async () => {
    // Arrange
    const navigate = vi.fn<(href: string) => void>();
    render(
      <NavigationProvider navigate={navigate}>
        <Button href="/questions/8-computed">次の問題へ</Button>
      </NavigationProvider>,
    );

    // Act
    await userEvent.click(screen.getByRole("link", { name: "次の問題へ" }));

    // Assert
    expect(navigate).toHaveBeenCalledWith("/questions/8-computed");
  });
});
