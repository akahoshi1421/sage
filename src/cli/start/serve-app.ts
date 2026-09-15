import path from "node:path";
import { pathToFileURL } from "node:url";

import { serve } from "srvx";
import { staticMiddleware } from "srvx/static";

export type ServeAppOptions = {
  /** sage パッケージのルート (dist/ がある場所) */
  packageRoot: string;
  /** 学習者のプロジェクト (questions/ がある場所) */
  projectRoot: string;
  port: number;
};

type ServerEntry = { default: { fetch: (request: Request) => Response | Promise<Response> } };

/** ビルド済みの Web 版 (dist/server + dist/client) を起動し、URL を返す */
export async function serveApp({
  packageRoot,
  projectRoot,
  port,
}: ServeAppOptions): Promise<string> {
  process.env.SAGE_ROOT = projectRoot;
  const entryUrl = pathToFileURL(path.join(packageRoot, "dist", "server", "server.js")).href;
  const entry = (await import(entryUrl)) as ServerEntry;

  const server = serve({
    port,
    hostname: "127.0.0.1",
    middleware: [staticMiddleware({ dir: path.join(packageRoot, "dist", "client") })],
    fetch: (request) => entry.default.fetch(request),
  });
  await server.ready();
  return server.url ?? `http://127.0.0.1:${port}/`;
}
