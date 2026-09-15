import { parseArgs } from "node:util";

export type CliCommand =
  | { name: "create"; install: boolean }
  | { name: "start"; port: number; open: boolean }
  | { name: "solved"; number: number }
  | { name: "help" }
  | { name: "version" };

export class CliUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliUsageError";
  }
}

/** `sage <command> [options]` を解釈する */
export function parseCliArgs(args: string[]): CliCommand {
  const { values, positionals } = parseArgs({
    args,
    options: {
      port: { type: "string" },
      open: { type: "boolean", default: true },
      install: { type: "boolean", default: true },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
    allowPositionals: true,
    allowNegative: true,
  });

  if (values.version) return { name: "version" };
  const [command, argument] = positionals;
  if (values.help || command === undefined || command === "help") return { name: "help" };

  switch (command) {
    case "create":
      return { name: "create", install: values.install };
    case "start": {
      const port = values.port === undefined ? 3000 : Number(values.port);
      if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
        throw new CliUsageError(`--port には 1〜65535 の整数を指定してください: ${values.port}`);
      }
      return { name: "start", port, open: values.open };
    }
    case "solved": {
      const number = Number(argument);
      if (argument === undefined || !Number.isInteger(number) || number <= 0) {
        throw new CliUsageError("問題番号を指定してください: sage solved <番号>");
      }
      return { name: "solved", number };
    }
    default:
      throw new CliUsageError(`不明なコマンドです: ${command}`);
  }
}

export const USAGE = `使い方: sage <command>

  create            対話形式で学習環境 (設定・SKILLS・questions/) を展開する (--no-install で npm install を省く)
  start             Web 版を起動する (--port <番号>, --no-open でブラウザを開かない)
  solved <番号>     問題を正解済みとして記録する (/sage-mark から使う)

  -h, --help        このヘルプを表示する
  -v, --version     バージョンを表示する
`;
