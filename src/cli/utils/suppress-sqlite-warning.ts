const isSqliteWarning = (warning: string | Error) =>
  (typeof warning === "string" ? warning : warning.message).includes("SQLite");

/**
 * Node 組み込みの sqlite は読み込み時に ExperimentalWarning を出す。
 * CLI の出力を汚さないよう、その警告だけを握りつぶす (他の警告は今まで通り出す)。
 */
export function suppressSqliteExperimentalWarning(): void {
  const original = process.emitWarning.bind(process);
  process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
    if (isSqliteWarning(warning)) return;
    (original as (...args: unknown[]) => void)(warning, ...rest);
  }) as typeof process.emitWarning;
}
