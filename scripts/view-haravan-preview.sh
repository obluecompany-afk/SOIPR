#!/bin/bash
# Preview haravan-theme đã render Liquid → HTML, serve port 8081
# Chạy song song với scripts/view-legacy.sh (port 8080) để check chéo

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PREVIEW="$ROOT/dist/preview"
PORT=${1:-8081}

# Render trước (idempotent)
if [ ! -d "$ROOT/node_modules/liquidjs" ]; then
  echo "📦 Cài liquidjs..."
  cd "$ROOT" && npm install --silent
fi
echo "🔧 Render Liquid templates..."
cd "$ROOT" && npm run preview --silent

if [ ! -d "$PREVIEW" ]; then
  echo "❌ Render thất bại"
  exit 1
fi

# Kill server cũ trên port này
lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null || true

cd "$PREVIEW"
echo ""
echo "🌐 Haravan preview: http://localhost:$PORT"
echo "   So sánh với legacy: http://localhost:8080"
echo "   (Ctrl+C để dừng)"

if command -v python3 &> /dev/null; then
  python3 -m http.server $PORT
elif command -v python &> /dev/null; then
  python -m SimpleHTTPServer $PORT
else
  echo "❌ Cần Python để chạy server"
  exit 1
fi
