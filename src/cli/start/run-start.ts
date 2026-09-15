import open from "open";

import type { PackageInfo } from "../utils/package-info";
import { serveApp } from "./serve-app";

/** `sage start`: カレントディレクトリを学習環境として Web 版を起動する */
export async function runStart(
  pkg: PackageInfo,
  options: { port: number; open: boolean },
): Promise<number> {
  const url = await serveApp({
    packageRoot: pkg.root,
    projectRoot: process.cwd(),
    port: options.port,
  });
  console.log(`sage is running at ${url}`);
  if (options.open) {
    await open(url);
  }
  return 0;
}
