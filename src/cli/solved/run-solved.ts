import { resolveProjectPaths } from "#/server/paths";

import { recordSolved } from "./record-solved";

/** `sage solved <番号>`: /sage-mark が正解を記録するために使う */
export async function runSolved(number: number): Promise<number> {
  await recordSolved(resolveProjectPaths(process.cwd()), number);
  console.log(`Recorded question ${number} as solved.`);
  return 0;
}
