import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { system } from "#/theme/system";

export type UIProviderProps = {
  children: ReactNode;
};

/** アプリ全体 (および Storybook) を包む UI プロバイダー */
export function UIProvider({ children }: UIProviderProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
