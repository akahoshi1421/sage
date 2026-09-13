import { describe, expect, it } from "vitest";

import { questionsFixture, subjectFixture } from "#/test/fixtures/questions";
import { render, screen, within } from "#/test/render";

import { TopPage } from "./top-page";

const renderTopPage = (questions = questionsFixture) =>
  render(
    <TopPage
      subject={subjectFixture}
      questions={questions}
      questionHref={(question) => `/questions/${question.slug}`}
    />,
  );

describe("トップページ", () => {
  it("学習対象の名前と概要が表示される", () => {
    // Arrange
    renderTopPage();

    // Assert
    expect(screen.getByRole("heading", { level: 1, name: "vue.js" })).toBeInTheDocument();
    expect(screen.getByText(/親しみやすく、パフォーマンスと汎用性の高い/)).toBeInTheDocument();
  });

  it("問題は難易度ごとにまとまり、タイトルから回答ページへ移動できる", () => {
    // Arrange
    renderTopPage();

    // Act
    const easy = screen.getByRole("region", { name: "easy" });
    const link = within(easy).getByRole("link", { name: "ref でリアクティブな値を作る" });

    // Assert
    expect(screen.getByRole("region", { name: "warm-up" })).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/questions/7-ref");
  });

  it("正解済みの問題にはその印が付き、未回答の問題には付かない", () => {
    // Arrange
    renderTopPage();
    const warmUp = screen.getByRole("region", { name: "warm-up" });
    const easy = screen.getByRole("region", { name: "easy" });

    // Assert
    expect(within(warmUp).getAllByRole("img", { name: "正解済み" })).toHaveLength(2);
    expect(within(easy).getAllByRole("img", { name: "正解済み" })).toHaveLength(4);
    expect(screen.queryByRole("region", { name: "hard" })).toBeInTheDocument();
  });

  it("問題が 1 つもないときはその旨が表示される", () => {
    // Arrange
    renderTopPage([]);

    // Assert
    expect(screen.getByText(/まだ問題がありません/)).toBeInTheDocument();
  });
});
