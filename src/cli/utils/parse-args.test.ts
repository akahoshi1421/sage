import { describe, expect, it } from "vitest";

import { parseCliArgs } from "./parse-args";

describe("CLI の引数", () => {
  it("引数無し・help・--help ではヘルプになる", () => {
    expect(parseCliArgs([])).toEqual({ name: "help" });
    expect(parseCliArgs(["help"])).toEqual({ name: "help" });
    expect(parseCliArgs(["start", "--help"])).toEqual({ name: "help" });
  });

  it("create は既定で npm install まで行い、--no-install で省ける", () => {
    expect(parseCliArgs(["create"])).toEqual({ name: "create", install: true });
    expect(parseCliArgs(["create", "--no-install"])).toEqual({ name: "create", install: false });
  });

  it("start は既定でポート 3000 でブラウザを開き、--port と --no-open で変えられる", () => {
    expect(parseCliArgs(["start"])).toEqual({ name: "start", port: 3000, open: true });
    expect(parseCliArgs(["start", "--port", "3100", "--no-open"])).toEqual({
      name: "start",
      port: 3100,
      open: false,
    });
  });

  it("solved には問題番号が必要", () => {
    expect(parseCliArgs(["solved", "7"])).toEqual({ name: "solved", number: 7 });
    expect(() => parseCliArgs(["solved"])).toThrow(/問題番号/);
    expect(() => parseCliArgs(["solved", "abc"])).toThrow(/問題番号/);
  });

  it("不正なポートや知らないコマンドは使い方のエラーになる", () => {
    expect(() => parseCliArgs(["start", "--port", "99999"])).toThrow(/--port/);
    expect(() => parseCliArgs(["deploy"])).toThrow(/不明なコマンド/);
  });

  it("-v / --version でバージョン表示になる", () => {
    expect(parseCliArgs(["-v"])).toEqual({ name: "version" });
  });
});
