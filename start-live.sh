#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Ensure cloudflared is accessible
if ! command -v cloudflared &> /dev/null; then
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "🚀 Starting CampusFind Portal in background..."

# Check if Vite is already running on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "ℹ️  Vite server is already running on port 3000."
else
  nohup npm run dev > .vite.log 2>&1 &
  echo $! > .vite.pid
  echo "✅ Vite server started (PID: $(cat .vite.pid))"
  sleep 2
fi

# Check if cloudflared is already running
if pgrep -f "cloudflared tunnel --url http://localhost:3000" > /dev/null ; then
  echo "ℹ️  Cloudflare Tunnel is already running."
else
  nohup cloudflared tunnel --url http://localhost:3000 > .cloudflared.log 2>&1 &
  echo $! > .cloudflared.pid
  echo "✅ Cloudflare Tunnel started (PID: $(cat .cloudflared.pid))"
  sleep 4
fi

echo ""
echo "🎉 Portal is running forever in the background!"
echo "--------------------------------------------------"
URL=$(grep -o 'https://[-a-zA-Z0-9\.]*\.trycloudflare\.com' .cloudflared.log | tail -n 1 || echo "")
if [ -n "$URL" ]; then
  echo "🌐 Public Worldwide URL: $URL"
else
  echo "🌐 Check public URL with: ./status.sh"
fi
echo "🏠 Local URL: http://localhost:3000"
echo "🛑 To stop anytime, run: ./stop-live.sh"
echo "--------------------------------------------------"
