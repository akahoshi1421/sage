import { render as renderWithTestingLibrary, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { UIProvider } from "#/components/ui/provider";

/** UIProvider で包んだ状態でコンポーネントを描画する */
export function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return renderWithTestingLibrary(ui, { wrapper: UIProvider, ...options });
}

export { screen, waitFor, within } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
