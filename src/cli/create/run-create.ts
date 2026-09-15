import { access } from "node:fs/promises";

import { log, spinner } from "@clack/prompts";

import { resolveProjectPaths } from "#/server/paths";

import type { PackageInfo } from "../utils/package-info";
import { installPackage } from "./install-package";
import { askCreateAnswers, showNextSteps } from "./prompts";
import { scaffoldProject } from "./scaffold";

const exists = (file: string) =>
  access(file).then(
    () => true,
    () => false,
  );

/** `sage create`: 対話で設定を決め、カレントディレクトリに学習環境を展開する */
export async function runCreate(pkg: PackageInfo): Promise<number> {
  const root = process.cwd();
  const paths = resolveProjectPaths(root);
  const answers = await askCreateAnswers({ alreadyConfigured: await exists(paths.configFile) });
  if (!answers) return 1;

  const result = await scaffoldProject({
    root,
    ...answers,
    packageName: pkg.name,
    packageVersion: pkg.version,
  });
  log.success(`Wrote ${result.files.length} files (${result.files.join(", ")})`);

  const progress = spinner();
  progress.start("Installing sage into this project (npm install)");
  try {
    await installPackage(root);
    progress.stop("Installed.");
  } catch (error) {
    progress.stop("npm install failed. Run `npm install` yourself and then `npm run start`.");
    log.error(error instanceof Error ? error.message : String(error));
  }

  showNextSteps(answers, result.skillsDir);
  return 0;
}
