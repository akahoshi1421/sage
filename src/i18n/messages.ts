/** Web 版 UI の文言。問題文や採点結果の本文は AI が生成するため対象外 */
export const messages = {
  ja: {
    appName: "sage",
    appDescription: "AI 時代に新しいライブラリを効率的に学ぶためのフレームワーク",
    nav: {
      menu: "メニュー",
      close: "閉じる",
      cancel: "キャンセル",
      questionList: "問題一覧",
      backToTop: "トップへ戻る",
      github: "GitHub",
      openInNewTab: "新規タブで開きます",
      resizePanes: "表示領域の比率を変更",
    },
    difficulty: {
      "warm-up": "warm-up",
      easy: "easy",
      medium: "medium",
      hard: "hard",
      extreme: "extreme",
    },
    question: {
      solved: "正解済み",
      empty: "まだ問題がありません。/sage-create で問題を生成してください。",
      hint: "ヒントを見る",
      showAnswer: "答えを見る",
      answerTitle: "答えと解説",
      submit: "回答",
      submitting: "採点中…",
      next: "次の問題へ",
      save: "保存",
      saved: "保存しました",
      reset: "リセット",
      resetConfirmTitle: "回答をリセットしますか？",
      resetConfirm: "リセットする",
      resetConfirmBody: (answerFile: string, templateFile: string) =>
        `${answerFile} の内容を ${templateFile} の内容に戻します。この操作は取り消せません。`,
    },
    result: {
      title: "採点結果",
      correct: "正解",
      close: "惜しい",
      incorrect: "不正解",
    },
  },
  en: {
    appName: "sage",
    appDescription: "A framework for learning any library efficiently in the age of AI",
    nav: {
      menu: "Menu",
      close: "Close",
      cancel: "Cancel",
      questionList: "Questions",
      backToTop: "Back to top",
      github: "GitHub",
      openInNewTab: "Opens in a new tab",
      resizePanes: "Resize panes",
    },
    difficulty: {
      "warm-up": "warm-up",
      easy: "easy",
      medium: "medium",
      hard: "hard",
      extreme: "extreme",
    },
    question: {
      solved: "Solved",
      empty: "No questions yet. Run /sage-create to generate them.",
      hint: "Show hint",
      showAnswer: "Show answer",
      answerTitle: "Answer",
      submit: "Submit",
      submitting: "Grading…",
      next: "Next question",
      save: "Save",
      saved: "Saved",
      reset: "Reset",
      resetConfirmTitle: "Reset your answer?",
      resetConfirm: "Reset",
      resetConfirmBody: (answerFile: string, templateFile: string) =>
        `This replaces the contents of ${answerFile} with ${templateFile}. This cannot be undone.`,
    },
    result: {
      title: "Result",
      correct: "Correct",
      close: "Almost",
      incorrect: "Incorrect",
    },
  },
} as const;

export type Locale = keyof typeof messages;
export type Messages = (typeof messages)[Locale];

export const DEFAULT_LOCALE: Locale = "ja";
