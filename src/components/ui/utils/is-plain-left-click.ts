import type { MouseEvent } from "react";

/** 修飾キー無しの左クリックか (新しいタブで開く操作などはブラウザに任せる) */
export const isPlainLeftClick = (event: MouseEvent<HTMLElement>): boolean =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  !event.defaultPrevented;
