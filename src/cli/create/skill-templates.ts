import type { SageConfig } from "#/server/config";

export type SkillTemplateOptions = {
  agent: SageConfig["agent"];
  /** SKILL.md 自体を書く言語 (Web 版の表示言語に合わせる) */
  locale: SageConfig["locale"];
  /** 問題文・ヒント・答え・採点の一言を書く言語 */
  language: string;
};

/** スキルの呼び出し方 (Claude Code は /名前、Codex は $名前) */
const invocation = (agent: SageConfig["agent"], name: string) =>
  agent === "claude" ? `/${name}` : `$${name}`;

/** Claude Code だけが対応するフロントマターの項目 */
const claudeOnlyFrontmatter = (agent: SageConfig["agent"], lines: string[]) =>
  agent === "claude" ? `${lines.join("\n")}\n` : "";

/** 引数 (対象技術や問題番号) の受け取り方 */
const argumentNote = (agent: SageConfig["agent"], what: string) =>
  agent === "claude" ? `$ARGUMENTS` : `${what}`;

export function sageCreateSkill({ agent, locale, language }: SkillTemplateOptions): string {
  const call = invocation(agent, "sage-create");
  const target = argumentNote(
    agent,
    locale === "ja"
      ? "(スキル名の後に書かれた技術名)"
      : "(the technology written after the skill name)",
  );

  if (locale === "ja") {
    return `---
name: sage-create
description: 指定された技術・ライブラリ・フレームワークを学ぶための type-challenges 風の問題集を questions/ に生成する。「${call} <技術名>」のように対象を指定して使う。
${claudeOnlyFrontmatter(agent, ["argument-hint: <技術名>", "disable-model-invocation: true"])}---

# ${call} — 問題集を生成する

対象の技術: ${target}

問題文・ヒント・答え・解説はすべて **${language}** で書きます。

## 手順

1. 対象の技術について調べる。公式ドキュメントや信頼できる情報源を参照し、主要な概念・API・典型的な使い方・つまずきやすい点を整理する。プロジェクトに関連する依存 (package.json など) があればバージョンも確認する。
2. 主要な概念を学ぶ順に並べ、難易度 (\`warm-up\` → \`easy\` → \`medium\` → \`hard\` → \`extreme\`) に割り当てる。学習曲線が緩い技術なら問題は少なめでよく、急な技術なら多めにする。無理にすべての難易度を埋めなくてよい。
3. \`questions/README.md\` を書く。先頭は \`# {技術名}\` の見出しにし、続けて学習対象の概要 (何を学ぶか、難易度ごとに扱う内容) を書く。
4. 問題ごとに \`questions/{難易度}/{番号}-{slug}/\` を作る。番号は 1 から始めて全体で一意にし、warm-up から順に小さい番号を付ける。slug は英小文字とハイフンだけの短い名前にする。各ディレクトリには次のファイルを置く。
   - \`QUESTION.md\`: 先頭に \`# {問題のタイトル}\`、続けて問題文と、客観的に判定できる要件の箇条書き。必要なら入出力の例。
   - \`HINT.md\`: 答えを直接書かない 2〜4 個のヒント。
   - \`ANSWER.md\`: 解答例 (言語を指定したコードブロック) と、なぜそうなるかの解説。
   - \`template.{拡張子}\`: 学習者が書き始めるためのテンプレート。書く場所をコメントで示す。拡張子は対象技術で使う言語に合わせる (TypeScript なら .ts、Python なら .py、Vue なら .vue など)。
   - \`answer.{拡張子}\`: 学習者が実際に回答を書き込むファイル。初期値は \`template.{拡張子}\` と同じ内容にする。
5. 問題は実際に解けて採点できるものにする。要件は「〜という名前の関数が〜を返す」のように判定できる粒度で書く。
6. 生成後、問題の一覧 (番号・難易度・タイトル) を表示して終わる。

## 制約

- \`questions/\` 以外のファイルは変更しない。動作確認のために一時ファイルを作った場合は、終了前に削除する。
- すでに問題がある場合は、番号を続きから採番し、重複するテーマは避ける。
- Markdown のコードブロックには必ず言語を指定する。
`;
  }

  return `---
name: sage-create
description: Generate a type-challenges style question set under questions/ for learning a given technology, library or framework. Use as "${call} <technology>".
${claudeOnlyFrontmatter(agent, ["argument-hint: <technology>", "disable-model-invocation: true"])}---

# ${call} — generate a question set

Target technology: ${target}

Write every question, hint, answer and explanation in **${language}**.

## Steps

1. Research the target technology. Use the official documentation and other reliable sources to map out the core concepts, APIs, typical usage and common pitfalls. If the project already depends on it (for example in package.json), note the version.
2. Order the core concepts in a sensible learning sequence and assign difficulties (\`warm-up\` → \`easy\` → \`medium\` → \`hard\` → \`extreme\`). A gentle learning curve needs fewer questions, a steep one needs more. It is fine to leave some difficulties empty.
3. Write \`questions/README.md\`: start with a \`# {technology}\` heading, then an overview of what will be learned and what each difficulty covers.
4. Create \`questions/{difficulty}/{number}-{slug}/\` for each question. Numbers start at 1 and are unique across all difficulties, smallest numbers in warm-up. The slug is short, lowercase letters and hyphens only. Each directory contains:
   - \`QUESTION.md\`: a \`# {title}\` heading, the task, and a bullet list of objectively checkable requirements. Add input/output examples when useful.
   - \`HINT.md\`: 2-4 hints that do not give away the answer.
   - \`ANSWER.md\`: a reference solution (fenced code block with a language) and an explanation of why it works.
   - \`template.{ext}\`: the starting point for the learner, with comments marking where to write. Use the extension of the language being learned (.ts for TypeScript, .py for Python, .vue for Vue, ...).
   - \`answer.{ext}\`: the file the learner edits. Initially identical to \`template.{ext}\`.
5. Make every question solvable and gradable: phrase requirements so they can be verified (for example "a function named X returns Y").
6. Finish by listing the generated questions (number, difficulty, title).

## Constraints

- Do not modify anything outside \`questions/\`. Delete any temporary files you created for verification before finishing.
- If questions already exist, continue the numbering and avoid duplicate topics.
- Always specify a language on Markdown code blocks.
`;
}

export function sageMarkSkill({ agent, locale, language }: SkillTemplateOptions): string {
  const call = invocation(agent, "sage-mark");
  const numberNote = argumentNote(
    agent,
    locale === "ja" ? "(スキル名の後に書かれた番号)" : "(the number written after the skill name)",
  );

  if (locale === "ja") {
    return `---
name: sage-mark
description: 問題番号を指定して、学習者の回答ファイル answer.* を採点する。「${call} <問題番号>」のように使う。結果は最後の行に 🟢 正解 / 🟡 惜しい / 🔴 不正解 の形式で出力する。
${claudeOnlyFrontmatter(agent, ["argument-hint: <問題番号>", "disable-model-invocation: true", "allowed-tools: Bash(npx sage solved:*)"])}---

# ${call} — 回答を採点する

問題番号: ${numberNote}

## 手順

1. \`questions/*/{番号}-*/\` を探し、\`QUESTION.md\` (要件)、\`ANSWER.md\` (解答例)、\`answer.*\` (学習者の回答) を読む。\`template.*\` は初期値なので採点対象にしない。
2. 要件を 1 つずつ、回答が満たしているか判定する。実行や型チェックで確かめられるなら確かめる (必要なら一時的なテストを書いて実行してよいが、\`questions/\` 内のファイルは変更しない)。実行できない場合はコードを読んで判定する。
3. 判定を決める。
   - 🟢 正解: すべての要件を満たしている
   - 🟡 惜しい: 概ね正しいが一部の要件が満たされていない
   - 🔴 不正解: 主要な要件を満たしていない、または回答が初期値のまま
4. 🟢 正解のときは \`npx sage solved {番号}\` を実行して正解を記録する。
5. 出力の **最後の行** を必ず次の形式にする。この行の後には何も出力しない。
   - \`🟢 正解 (一言)\`
   - \`🟡 惜しい (一言)\`
   - \`🔴 不正解 (一言)\`

   一言は **${language}** で、学習者への短いフィードバック (良かった点や、次に直すべき点) を書く。
`;
  }

  return `---
name: sage-mark
description: Grade the learner's answer file (answer.*) for the given question number. Use as "${call} <number>". The last line of the output must be 🟢 / 🟡 / 🔴 followed by a short comment.
${claudeOnlyFrontmatter(agent, ["argument-hint: <question number>", "disable-model-invocation: true", "allowed-tools: Bash(npx sage solved:*)"])}---

# ${call} — grade an answer

Question number: ${numberNote}

## Steps

1. Find \`questions/*/{number}-*/\` and read \`QUESTION.md\` (requirements), \`ANSWER.md\` (reference solution) and \`answer.*\` (the learner's answer). \`template.*\` is only the starting point; do not grade it.
2. Check the requirements one by one. Verify by running or type-checking the code when possible (you may write a temporary test outside \`questions/\`, but never modify files inside \`questions/\`). If it cannot be run, judge by reading the code.
3. Decide the verdict.
   - 🟢 Correct: all requirements are met
   - 🟡 Almost: mostly right, but some requirements are not met
   - 🔴 Incorrect: the main requirements are not met, or the answer is still the template
4. On 🟢 run \`npx sage solved {number}\` to record the correct answer.
5. Make the **last line** of your output exactly one of the following, and output nothing after it:
   - \`🟢 Correct (comment)\`
   - \`🟡 Almost (comment)\`
   - \`🔴 Incorrect (comment)\`

   Write the comment in **${language}** as short feedback for the learner (what was good, or what to fix next).
`;
}
