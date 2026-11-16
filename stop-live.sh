#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "🛑 Stopping CampusFind background services..."

# Kill cloudflared
pkill -f "cloudflared tunnel --url http://localhost:3000" 2>/dev/null && echo "✅ Stopped Cloudflare Tunnel" || echo "ℹ️  Cloudflare Tunnel not running"

# Kill vite server on port 3000
VITE_PID=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "$VITE_PID" ]; then
  kill -9 $VITE_PID 2>/dev/null || true
  echo "✅ Stopped Vite server (PID: $VITE_PID)"
else
  echo "ℹ️  No process listening on port 3000"
fi

rm -f .vite.pid .cloudflared.pid 2>/dev/null

echo "🏁 All services stopped."
