import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

import type { MarkResult, QuestionDetail } from "#/features/questions/types";
import { useMessages } from "#/i18n/hooks/use-messages";
import { markQuestionFn, resetAnswerFn, saveAnswerFn } from "#/server/functions";

/**
 * 回答ページの編集状態: エディタの内容、保存・リセット・採点とその結果。
 * 問題が変わるときはこのフックを使うコンポーネントを key で作り直す。
 */
export function useQuestionEditor(question: QuestionDetail) {
  const router = useRouter();
  const messages = useMessages();
  const [code, setCode] = useState(question.answerCode);
  /** 最後にファイルへ保存した内容。エディタの内容と違えば未保存 */
  const [savedCode, setSavedCode] = useState(question.answerCode);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MarkResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const save = async (nextCode: string) => {
    await saveAnswerFn({ data: { slug: question.slug, code: nextCode } });
    setSavedCode(nextCode);
  };

  const reset = async () => {
    const restored = await resetAnswerFn({ data: question.slug });
    setCode(restored.code);
    setSavedCode(restored.code);
  };

  const submit = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await save(code);
      const outcome = await markQuestionFn({ data: question.slug });
      if (!outcome.ok) {
        setErrorMessage(`${messages.error.markFailed}: ${outcome.message}`);
        return;
      }
      setResult(outcome.result);
      if (outcome.result.verdict === "correct") {
        await router.invalidate();
      }
    } catch (error) {
      setErrorMessage(
        `${messages.error.markFailed}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    code,
    setCode,
    dirty: code !== savedCode,
    submitting,
    result,
    errorMessage,
    save: (nextCode: string) => void save(nextCode),
    reset: () => void reset(),
    submit: () => void submit(),
    closeResult: () => setResult(null),
  };
}
