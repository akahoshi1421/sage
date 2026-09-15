import { spawn } from "node:child_process";

import type { SageConfig } from "../config";

export type MarkCommand = {
  command: string;
  args: string[];
};

/** 設定されたエージェントで `/sage-mark {番号}` を実行するコマンド */
export function buildMarkCommand(agent: SageConfig["agent"], number: number): MarkCommand {
  const prompt = `/sage-mark ${number}`;
  switch (agent) {
    case "claude":
      return { command: "claude", args: ["-p", prompt] };
    case "codex":
      return { command: "codex", args: ["exec", prompt] };
  }
}

export type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};

export type CommandRunner = (
  command: MarkCommand,
  options: { cwd: string; timeoutMs: number },
) => Promise<CommandResult>;

/** 子プロセスとしてコマンドを実行し、出力をまとめて返す */
export const runCommand: CommandRunner = (command, { cwd, timeoutMs }) =>
  new Promise((resolve, reject) => {
    const child = spawn(command.command, command.args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode, timedOut });
    });
  });
