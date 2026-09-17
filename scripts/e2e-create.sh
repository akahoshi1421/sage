#!/usr/bin/env bash
# 公開パッケージとしての導入フローを通しで確認する (ローカル用、expect が必要):
#   ビルド → npm pack → 空ディレクトリで `sage create --no-install` を対話操作 → tarball を npm install
#   → `npm run start` で Web 版が起動し、空の学習環境が表示されることを確認する
set -euo pipefail

REPO=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d "${TMPDIR:-/tmp}/sage-e2e.XXXXXX")
PORT=${PORT:-3200}
trap 'lsof -ti ":$PORT" | xargs kill 2>/dev/null || true; rm -rf "$WORK"' EXIT

echo "== build and pack =="
(cd "$REPO" && npm run build >/dev/null && mkdir -p "$WORK/pkg" && cd "$WORK/pkg" && npm pack "$REPO" >/dev/null)
TARBALL=$(ls "$WORK/pkg"/*.tgz)

echo "== create (interactive, answered by expect) =="
mkdir -p "$WORK/learn" && cd "$WORK/learn"
expect -c "
set timeout 60
set stty_init {cols 120 rows 40}
spawn node $REPO/bin/sage.js create --no-install
expect -re {coding agent} { send \"\r\" }
expect -re {Language} { send \"\r\" }
expect eof
" >/dev/null
test -f sage.config.json && test -f .claude/skills/sage-create/SKILL.md && test -f .claude/skills/sage-mark/SKILL.md && test -d playground

echo "== install the packed sage and start the web app =="
npm install --no-audit --no-fund "$TARBALL" >/dev/null
npx sage --version
(npm run start -- --no-open --port "$PORT" >"$WORK/start.log" 2>&1 &)
for _ in $(seq 1 30); do curl -sf -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep 1; done
curl -s "http://127.0.0.1:$PORT/" | grep -q "sage" || { echo "top page did not render"; cat "$WORK/start.log"; exit 1; }
npx sage solved 1 >/dev/null && test -f .sage/progress.db

echo "OK: create → install → start → solved"
