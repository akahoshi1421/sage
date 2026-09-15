import { spawn } from "node:child_process";

/** 展開先で `npm install` を実行して sage を依存として入れる */
export function installPackage(root: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npm, ["install", "--no-audit", "--no-fund"], {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install が終了コード ${code} で失敗しました`));
    });
  });
}
