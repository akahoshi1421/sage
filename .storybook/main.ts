import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        // アプリ用の vite.config.ts (TanStack Start プラグイン入り) は読み込まず、Storybook 専用の設定を使う
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
};

export default config;
