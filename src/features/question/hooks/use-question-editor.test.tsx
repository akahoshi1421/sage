import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { questionDetailFixture } from "#/test/fixtures/questions";

import { useQuestionEditor } from "./use-question-editor";

const invalidate = vi.fn<() => Promise<void>>(async () => {});
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ invalidate }),
}));

const saveAnswerFn = vi.fn<(input: { data: { slug: string; code: string } }) => Promise<void>>(
  async () => {},
);
const resetAnswerFn = vi.fn<(input: { data: string }) => Promise<{ code: string }>>(async () => ({
  code: questionDetailFixture.templateCode,
}));
const markQuestionFn = vi.fn<(input: { data: string }) => Promise<unknown>>();
vi.mock("#/server/functions", () => ({
  saveAnswerFn: (input: { data: { slug: string; code: string } }) => saveAnswerFn(input),
  resetAnswerFn: (input: { data: string }) => resetAnswerFn(input),
  markQuestionFn: (input: { data: string }) => markQuestionFn(input),
}));

describe("回答の編集", () => {
  it("回答すると、今の内容を保存してから採点され、結果が表示される", async () => {
    // Arrange
    markQuestionFn.mockResolvedValueOnce({
      ok: true,
      result: { verdict: "correct", comment: "OK" },
    });
    const { result } = renderHook(() => useQuestionEditor(questionDetailFixture));
    act(() => result.current.setCode("// edited"));

    // Act
    act(() => result.current.submit());

    // Assert
    await waitFor(() =>
      expect(result.current.result).toEqual({ verdict: "correct", comment: "OK" }),
    );
    expect(saveAnswerFn).toHaveBeenCalledWith({ data: { slug: "7-ref", code: "// edited" } });
    expect(markQuestionFn).toHaveBeenCalledWith({ data: "7-ref" });
    expect(invalidate).toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it("採点に失敗したときはその理由が表示され、結果は出ない", async () => {
    // Arrange
    markQuestionFn.mockResolvedValueOnce({
      ok: false,
      message: "claude が見つかりません",
      output: "",
    });
    const { result } = renderHook(() => useQuestionEditor(questionDetailFixture));

    // Act
    act(() => result.current.submit());

    // Assert
    await waitFor(() => expect(result.current.errorMessage).toMatch(/claude が見つかりません/));
    expect(result.current.result).toBeNull();
  });

  it("編集すると未保存になり、Cmd+S で保存すると保存済みに戻る", async () => {
    // Arrange
    const { result } = renderHook(() => useQuestionEditor(questionDetailFixture));
    expect(result.current.dirty).toBe(false);

    // Act
    act(() => result.current.setCode("// edited"));

    // Assert
    expect(result.current.dirty).toBe(true);

    // Act
    act(() => result.current.save("// edited"));

    // Assert
    await waitFor(() => expect(result.current.dirty).toBe(false));
    expect(saveAnswerFn).toHaveBeenCalledWith({ data: { slug: "7-ref", code: "// edited" } });
  });

  it("リセットするとエディタの内容がテンプレートに戻る", async () => {
    // Arrange
    const { result } = renderHook(() => useQuestionEditor(questionDetailFixture));
    act(() => result.current.setCode("// edited"));

    // Act
    act(() => result.current.reset());

    // Assert
    await waitFor(() => expect(result.current.code).toBe(questionDetailFixture.templateCode));
    expect(resetAnswerFn).toHaveBeenCalledWith({ data: "7-ref" });
  });
});
