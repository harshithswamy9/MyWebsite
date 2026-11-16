#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "📊 CMRTC ReFind Status Check:"
echo "=================================="

# Check systemd service status
if systemctl --user is-active cmrtc-refind.service >/dev/null 2>&1 ; then
  echo "🟢 Background System Service: RUNNING (Independent of Antigravity)"
else
  echo "🟡 System Service: Not active"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  echo "🟢 Local Web Server: RUNNING on http://localhost:3000"
else
  echo "🔴 Local Web Server: STOPPED"
fi

URL=$(grep -o 'https://[-a-zA-Z0-9\.]*\.trycloudflare\.com' "$DIR/.systemd.log" 2>/dev/null | tail -n 1 || echo "")
if [ -n "$URL" ]; then
  echo "🌐 Public Tunnel Link: $URL"
  echo "⚡ Short Link:         https://spoo.me/cmrtc-refind-now"
fi

echo "=================================="
echo "Service Commands:"
echo "  Restart Service: systemctl --user restart cmrtc-refind.service"
echo "  Stop Service:    systemctl --user stop cmrtc-refind.service"
echo "  View Logs:       systemctl --user status cmrtc-refind.service"
