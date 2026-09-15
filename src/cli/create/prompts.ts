import { cancel, confirm, intro, isCancel, note, outro, select, text } from "@clack/prompts";

import type { SageConfig } from "#/server/config";

export type CreateAnswers = {
  agent: SageConfig["agent"];
  locale: SageConfig["locale"];
  language: string;
};

const cancelled = (): null => {
  cancel("Cancelled. Nothing was changed.");
  return null;
};

/** `sage create` の対話 (キャンセルされたら null) */
export async function askCreateAnswers(options: {
  alreadyConfigured: boolean;
}): Promise<CreateAnswers | null> {
  intro("sage — set up a learning environment");

  if (options.alreadyConfigured) {
    const proceed = await confirm({
      message: "sage.config.json already exists. Overwrite the configuration and skills?",
      initialValue: false,
    });
    if (isCancel(proceed) || !proceed) return cancelled();
  }

  const agent = await select<SageConfig["agent"]>({
    message: "Which coding agent do you use?",
    options: [
      { value: "claude", label: "Claude Code", hint: "skills go to .claude/skills/" },
      { value: "codex", label: "Codex", hint: "skills go to .agents/skills/" },
    ],
  });
  if (isCancel(agent)) return cancelled();

  const choice = await select<"ja" | "en" | "other">({
    message: "Language for the questions and the web UI?",
    options: [
      { value: "ja", label: "日本語" },
      { value: "en", label: "English" },
      { value: "other", label: "Other (type it in; the web UI will be English)" },
    ],
  });
  if (isCancel(choice)) return cancelled();

  if (choice === "other") {
    const language = await text({
      message: "Which language should the questions be written in? (e.g. Français)",
      validate: (value) => (value?.trim() ? undefined : "Please enter a language"),
    });
    if (isCancel(language)) return cancelled();
    return { agent, locale: "en", language: language.trim() };
  }

  return { agent, locale: choice, language: choice === "ja" ? "日本語" : "English" };
}

/** 展開後の案内 */
export function showNextSteps(answers: CreateAnswers, skillsDir: string): void {
  const prefix = answers.agent === "claude" ? "/" : "$";
  const agentName = answers.agent === "claude" ? "Claude Code" : "Codex";
  note(
    [
      `Skills: ${skillsDir}/sage-create, ${skillsDir}/sage-mark`,
      "",
      `1. Start ${agentName} here and run:  ${prefix}sage-create <technology>`,
      `2. Answer questions in questions/**/answer.* and run:  ${prefix}sage-mark <number>`,
      "3. Or open the web UI:  npm run start",
    ].join("\n"),
    "Next steps",
  );
  outro("Done.");
}
