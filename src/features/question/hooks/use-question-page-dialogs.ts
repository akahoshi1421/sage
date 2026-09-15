import { useState } from "react";

type Disclosure = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const useDisclosure = (): Disclosure => {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
};

/** 回答ページにあるメニュー (ドロワー)・答え・リセット確認の開閉状態 */
export function useQuestionPageDialogs() {
  return {
    menu: useDisclosure(),
    answer: useDisclosure(),
    reset: useDisclosure(),
  };
}
