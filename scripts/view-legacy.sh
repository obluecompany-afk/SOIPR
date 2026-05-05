#!/bin/bash
# Mở trang HTML cũ (legacy) trong browser để tham khảo khi migrate

set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
LEGACY="$DIR/legacy"
PORT=${1:-8080}

if [ ! -d "$LEGACY" ]; then
  echo "❌ Không tìm thấy folder legacy/"
  exit 1
fi

cd "$LEGACY"

# Kill existing server on this port
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true

echo "🌐 Legacy preview: http://localhost:$PORT"
echo "   (Ctrl+C để dừng)"

if command -v python3 &> /dev/null; then
  python3 -m http.server $PORT
elif command -v python &> /dev/null; then
  python -m SimpleHTTPServer $PORT
else
  echo "❌ Cần Python để chạy server"
  exit 1
fi
