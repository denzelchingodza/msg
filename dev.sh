#!/usr/bin/env bash
# MSG — start backend (:8000) and frontend (:3000) together.
# Usage: ./dev.sh   (Ctrl+C stops both)
set -e
cd "$(dirname "$0")"

trap 'kill 0' EXIT

(cd backend && python3 -m uvicorn app.main:app --reload --port 8000) &
(cd frontend && npm run dev) &

wait
