#!/bin/bash
# S.O.I — Khởi động website demo localhost

PORT=${1:-8080}
DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$DIR"

# Kill existing servers on this port
lsof -ti:$PORT | xargs kill -9 2>/dev/null

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   🎨  S.O.I — K-Beauty Website Demo          ║"
echo "╠══════════════════════════════════════════════╣"
echo "║                                              ║"
echo "║   Trang tổng hợp:                            ║"
echo "║   http://localhost:$PORT/all-pages.html        ║"
echo "║                                              ║"
echo "║   Trang chủ:                                 ║"
echo "║   http://localhost:$PORT/index.html            ║"
echo "║                                              ║"
echo "║   Bấm Ctrl+C để dừng server                  ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Open browser sau 1.5s
(sleep 1.5; open "http://localhost:$PORT/all-pages.html") &

# Start server (blocks)
python3 -m http.server $PORT
