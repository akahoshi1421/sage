import type { Preview } from "@storybook/react-vite";

import { UIProvider } from "#/components/ui/provider";

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
        order: ["Foundations", "Layout", "UI", "Pages"],
      },
    },
  },
  decorators: [
    (Story) => (
      <UIProvider>
        <Story />
      </UIProvider>
    ),
  ],
};

export default preview;
