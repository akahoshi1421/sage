/** 外部サイトへのリンクか (http / https で始まる) */
export const isExternalHref = (href: string | undefined): boolean =>
  /^https?:\/\//.test(href ?? "");
