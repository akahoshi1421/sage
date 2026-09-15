import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

/** サーバー描画・ハイドレーション中は false、クライアントで描画が確定したら true */
export const useIsClient = (): boolean =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
