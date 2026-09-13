import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { questionDetailFixture, questionsFixture } from "#/test/fixtures/questions";
import { render, screen, userEvent, waitFor, within } from "#/test/render";

import { QuestionPage, type QuestionPageProps } from "./question-page";

// Monaco はブラウザ専用なので、テストではテキストエリアの簡易エディタに置き換える
vi.mock("@monaco-editor/react", async () => {
  const { createElement } = await import("react");
  type FakeEditorProps = { value?: string; onChange?: (value: string | undefined) => void };
  const FakeEditor = ({ value, onChange }: FakeEditorProps) =>
    createElement("textarea", {
      "aria-label": "code",
      value: value ?? "",
      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => onChange?.(event.target.value),
    });
  return { default: FakeEditor };
});

const renderPage = (overrides: Partial<QuestionPageProps> = {}) => {
  const onSubmit = vi.fn<() => void>();
  render(
    <QuestionPage
      question={questionDetailFixture}
      questions={questionsFixture}
      questionHref={(question) => `/questions/${question.slug}`}
      code={questionDetailFixture.templateCode}
      onCodeChange={() => {}}
      onSave={() => {}}
      onSubmit={onSubmit}
      result={null}
      onResultClose={() => {}}
      nextQuestionHref="/questions/8-computed"
      {...overrides}
    />,
  );
  return { onSubmit };
};

describe("回答ページ", () => {
  it("問題のタイトルと問題文が表示される", () => {
    // Arrange
    renderPage();

    // Assert
    expect(
      screen.getByRole("heading", { level: 1, name: "easy 7 ref でリアクティブな値を作る" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/を使ってカウンターを作ってください/)).toBeInTheDocument();
  });

  it("ヒントは最初は隠れていて、「ヒントを見る」を開くと読める", async () => {
    // Arrange
    renderPage();
    const trigger = screen.getByRole("button", { name: "ヒントを見る" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Act
    await userEvent.click(trigger);

    // Assert
    expect(screen.getByText(/の戻り値は/)).toBeVisible();
  });

  it("「答えを見る」を押すと答えと解説がダイアログで表示され、閉じられる", async () => {
    // Arrange
    renderPage();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "答えを見る" }));
    const dialog = await screen.findByRole("dialog", { name: "答えと解説" });

    // Assert
    expect(within(dialog).getByRole("heading", { name: "解答例" })).toBeInTheDocument();

    // Act
    await userEvent.click(within(dialog).getByRole("button", { name: "閉じる" }));

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "答えと解説" })).not.toBeInTheDocument();
    });
  });

  it("「回答」を押すと採点が始まる", async () => {
    // Arrange
    const { onSubmit } = renderPage();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "回答" }));

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("採点中は回答ボタンが押せない", () => {
    // Arrange
    renderPage({ submitting: true });

    // Assert
    expect(screen.getByRole("button", { name: "採点中…" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("正解の結果では、閉じるか次の問題へ進める", () => {
    // Arrange
    renderPage({ result: { verdict: "correct", comment: "よくできました" } });

    // Assert
    const dialog = screen.getByRole("dialog", { name: "採点結果" });
    expect(within(dialog).getByText("正解")).toBeInTheDocument();
    expect(within(dialog).getByText("よくできました")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "閉じる" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "次の問題へ" })).toHaveAttribute(
      "href",
      "/questions/8-computed",
    );
  });

  it("不正解の結果では、閉じるだけができる", () => {
    // Arrange
    renderPage({ result: { verdict: "incorrect", comment: "ref が使われていません" } });

    // Assert
    const dialog = screen.getByRole("dialog", { name: "採点結果" });
    expect(within(dialog).getByText("不正解")).toBeInTheDocument();
    expect(within(dialog).queryByRole("link", { name: "次の問題へ" })).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "閉じる" })).toBeInTheDocument();
  });

  it("メニューを開くと問題一覧から他の問題へ移動できる", async () => {
    // Arrange
    renderPage();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "メニュー" }));
    const menu = await screen.findByRole("dialog", { name: "問題一覧" });

    // Assert
    expect(within(menu).getByRole("link", { name: "算出プロパティ" })).toHaveAttribute(
      "href",
      "/questions/8-computed",
    );
    expect(
      within(menu).getByRole("link", { name: "ref でリアクティブな値を作る" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
