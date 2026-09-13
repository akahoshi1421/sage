import type { Decorator, Preview } from "@storybook/react-vite";
import { createStore, Provider as JotaiProvider } from "jotai";
import { useMemo } from "react";

import { UIProvider } from "#/components/ui/provider";
import { localeAtom } from "#/i18n/locale";
import { DEFAULT_LOCALE, type Locale } from "#/i18n/messages";

/** ツールバーで選んだ表示言語を jotai の localeAtom に反映する */
const withLocale: Decorator = (Story, context) => {
  const store = useMemo(() => createStore(), []);
  store.set(localeAtom, (context.globals.locale as Locale | undefined) ?? DEFAULT_LOCALE);
  return (
    <JotaiProvider store={store}>
      <Story />
    </JotaiProvider>
  );
};

const withUIProvider: Decorator = (Story) => (
  <UIProvider>
    <Story />
  </UIProvider>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
    options: {
      storySort: {
        order: ["Docs", "Foundations", "Layout", "UI", "Pages"],
      },
    },
  },
  globalTypes: {
    locale: {
      description: "表示言語",
      toolbar: {
        icon: "globe",
        items: [
          { value: "ja", title: "日本語" },
          { value: "en", title: "English" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: DEFAULT_LOCALE,
  },
  decorators: [withLocale, withUIProvider],
};

export default preview;
