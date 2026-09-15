/** Markdown の先頭にある見出し (`# タイトル`) をタイトルとして取り出し、本文と分ける */
export function splitLeadingHeading(markdown: string): { title: string | null; body: string } {
  const lines = markdown.split(/\r?\n/);
  const firstIndex = lines.findIndex((line) => line.trim() !== "");
  if (firstIndex === -1) return { title: null, body: "" };

  const match = /^#\s+(.+?)\s*#*\s*$/.exec(lines[firstIndex] ?? "");
  if (!match) return { title: null, body: markdown.trim() };

  return {
    title: match[1] ?? null,
    body: lines
      .slice(firstIndex + 1)
      .join("\n")
      .trim(),
  };
}
