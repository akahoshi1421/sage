import { defineSlotRecipe } from "@chakra-ui/react";
import { splitterAnatomy } from "@chakra-ui/react/anatomy";

import { focusVisibleOutline } from "./shared";

/**
 * スプリッター (左右 / 上下の分割ペイン)。DADS に対応する部品はないため、
 * 罫線とキーカラー、共通のフォーカス表示だけを DADS に合わせている。
 */
export const splitterSlotRecipe = defineSlotRecipe({
  slots: splitterAnatomy.keys(),
  base: {
    root: {
      width: "full",
      height: "full",
      minH: 0,
    },
    panel: {
      minW: 0,
      minH: 0,
      overflow: "auto",
    },
    resizeTrigger: {
      "--splitter-border-color": "colors.solidGray.420",
      "--splitter-thumb-color": "colors.white",
      "--splitter-thumb-size": "sizes.3",
      "--splitter-handle-size": "sizes.8",
      _hover: {
        "--splitter-border-color": "colors.key.900",
      },
      _focus: {
        "--splitter-border-color": "colors.key.900",
        "--splitter-thumb-color": "colors.key.50",
      },
      _dragging: {
        "--splitter-border-color": "colors.key.900",
        "--splitter-thumb-color": "colors.key.100",
      },
    },
    resizeTriggerIndicator: {
      borderColor: "solidGray.420",
      shadow: "none",
      "[data-part='resize-trigger'][data-focus]:focus-visible &": focusVisibleOutline,
    },
  },
});
