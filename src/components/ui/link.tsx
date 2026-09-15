import { chakra, defineRecipe } from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";

import { focusVisibleTextStyle } from "#/theme/focus";

import { useInternalNavigation } from "./hooks/use-internal-navigation";
import { Icon } from "./icon";

/**
 * リンク (デジタル庁デザインシステム「リンク」)
 * https://design.digital.go.jp/dads/components/link/
 */
const linkRecipe = defineRecipe({
  className: "sage-link",
  base: {
    color: "fg.link",
    textDecoration: "underline",
    textUnderlineOffset: "0.1875rem",
    cursor: "pointer",
    _visited: { color: "fg.linkVisited" },
    _hover: { color: "fg.link", textDecorationThickness: "0.1875rem" },
    _active: { color: "fg.linkActive", textDecorationThickness: "1px" },
    _focusVisible: { ...focusVisibleTextStyle, rounded: "4", color: "fg.link" },
  },
});

const StyledLink = chakra("a", linkRecipe);

export type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "color" | "style"> & {
  /**
   * 子要素 (TanStack Router の Link など) にスタイルを委譲する。
   * このとき新規タブのアイコンは付かないので、必要なら子要素側で表示する。
   */
  asChild?: boolean;
  /** 新規タブで開くリンクに付くアイコンの読み上げテキスト */
  externalLabel?: string;
  ref?: Ref<HTMLAnchorElement>;
};

/** リンク。`target="_blank"` のときは「新規タブで開きます」のアイコンが末尾に付く */
export function Link({
  asChild,
  children,
  target,
  rel,
  externalLabel = "新規タブで開きます",
  onClick,
  ...rest
}: LinkProps) {
  const isExternal = target === "_blank";
  const navigateOnClick = useInternalNavigation()(rest.href, target);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    navigateOnClick?.(event);
  };

  if (asChild) {
    return (
      <StyledLink asChild target={target} rel={rel} onClick={onClick} {...rest}>
        {children}
      </StyledLink>
    );
  }

  return (
    <StyledLink
      target={target}
      rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
      onClick={handleClick}
      {...rest}
    >
      {children}
      {isExternal && (
        <chakra.span display="inline-block" ms="0.1875rem" mb="0.1875rem" verticalAlign="baseline">
          <Icon name="external_link" size="sm" label={externalLabel} />
        </chakra.span>
      )}
    </StyledLink>
  );
}
