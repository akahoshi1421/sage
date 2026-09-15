import { CliUsageError, parseCliArgs, USAGE } from "./utils/parse-args";
import { readPackageInfo } from "./utils/package-info";
import { suppressSqliteExperimentalWarning } from "./utils/suppress-sqlite-warning";

async function main(): Promise<number> {
  suppressSqliteExperimentalWarning();
  const pkg = readPackageInfo();
  const command = parseCliArgs(process.argv.slice(2));

  switch (command.name) {
    case "help":
      console.log(USAGE);
      return 0;
    case "version":
      console.log(pkg.version);
      return 0;
    case "create": {
      const { runCreate } = await import("./create/run-create");
      return runCreate(pkg, { install: command.install });
    }
    case "start": {
      const { runStart } = await import("./start/run-start");
      return runStart(pkg, { port: command.port, open: command.open });
    }
    case "solved": {
      const { runSolved } = await import("./solved/run-solved");
      return runSolved(command.number);
    }
  }
}

main().then(
  (code) => {
    if (code !== 0) process.exitCode = code;
  },
  (error: unknown) => {
    if (error instanceof CliUsageError) {
      console.error(error.message);
      console.error(USAGE);
      process.exitCode = 2;
      return;
    }
    console.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
    process.exitCode = 1;
  },
);
