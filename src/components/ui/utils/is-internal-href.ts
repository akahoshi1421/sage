/** アプリ内のパス (`/` で始まり `//` で始まらない) か */
export const isInternalHref = (href: string | undefined): href is string =>
  href !== undefined && href.startsWith("/") && !href.startsWith("//");
