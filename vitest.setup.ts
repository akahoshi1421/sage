import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom には ResizeObserver が無いため、要素サイズを監視する部品 (Splitter など) 向けに何もしない実装を入れる
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom はレイアウトを計算しないため getClientRects() が常に空になり、
// 「要素が表示されているか」の判定 (フォーカス移動先の決定など) が常に false になる。
// hidden でない要素は矩形を 1 つ持つものとして扱い、フォーカス移動の振る舞いをテストできるようにする。
const visibleRect = { x: 0, y: 0, width: 1, height: 1, top: 0, left: 0, right: 1, bottom: 1 };
Element.prototype.getClientRects = function getClientRects(this: Element) {
  const rects = this.closest("[hidden]") ? [] : [visibleRect];
  return rects as unknown as DOMRectList;
};
