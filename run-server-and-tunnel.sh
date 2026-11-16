#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

export PATH="$HOME/.local/bin:$PATH"

# Kill any existing processes on port 3000
pkill -f "vite" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 1

# Start Vite dev server in background
npm run dev > "$DIR/.vite.log" 2>&1 &
VITE_PID=$!

# Wait for Vite to be ready on port 3000
for i in {1..15}; do
  if curl -s http://localhost:3000 >/dev/null ; then
    break
  fi
  sleep 1
done

# Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
