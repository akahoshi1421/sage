import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type PackageInfo = {
  name: string;
  version: string;
  /** インストールされた sage パッケージのルート (bin/ と dist/ がある場所) */
  root: string;
};

/** この CLI が属する sage パッケージ自身の情報 */
export function readPackageInfo(moduleUrl: string = import.meta.url): PackageInfo {
  // dist/cli/index.js から見て 2 つ上がパッケージのルート
  const root = path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..", "..");
  const { name, version } = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")) as {
    name: string;
    version: string;
  };
  return { name, version, root };
}
