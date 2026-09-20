#!/usr/bin/env bash
# Runs all dev watchers at once: server, client, CSS, and card JSON.
# Ctrl+C stops all of them.
set -euo pipefail

pids=()

cleanup() {
  trap - INT TERM
  echo
  echo "Stopping dev watchers..."
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup INT TERM

npm run dev:server & pids+=($!)
npm run dev:client & pids+=($!)
npm run watch:less & pids+=($!)
npm run watch:cards & pids+=($!)

wait
