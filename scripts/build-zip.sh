#!/bin/bash
# Build Haravan theme zip để upload qua dashboard
# Usage: bash scripts/build-zip.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/haravan-theme"
DIST="$ROOT/dist"

if [ ! -d "$SRC" ]; then
  echo "❌ Không tìm thấy $SRC"
  exit 1
fi

# Clean & prepare
mkdir -p "$DIST"
rm -f "$DIST/soi-theme.zip" "$DIST/soi-theme-wrapped.zip"

# Loại bỏ .DS_Store trước khi đóng gói
find "$SRC" -name ".DS_Store" -delete 2>/dev/null || true

# Tạo staging dir tạm để loại bỏ file không cần (.gitkeep, README.md)
STAGE="$DIST/_stage"
rm -rf "$STAGE"
mkdir -p "$STAGE"
cp -R "$SRC"/* "$STAGE/"

# Loại bỏ README.md và .gitkeep khỏi staging
find "$STAGE" -name ".gitkeep" -delete 2>/dev/null || true
rm -f "$STAGE/README.md"

# === Phiên bản 1: Shopify-style (no wrapper folder) ===
cd "$STAGE"
zip -rq "$DIST/soi-theme.zip" \
  assets config layout locales snippets templates \
  -x "*.DS_Store" -x "*/.DS_Store"
cd "$ROOT"

# === Phiên bản 2: Wrapped folder (Sapo fallback) ===
WRAP="$DIST/_wrap"
rm -rf "$WRAP"
mkdir -p "$WRAP/soi-theme"
cp -R "$STAGE"/* "$WRAP/soi-theme/"
cd "$WRAP"
zip -rq "$DIST/soi-theme-wrapped.zip" soi-theme \
  -x "*.DS_Store" -x "*/.DS_Store"
cd "$ROOT"

# Cleanup staging
rm -rf "$STAGE" "$WRAP"

# === Report ===
echo "✓ Built:"
ls -lh "$DIST"/*.zip | awk '{printf "  %s  %s\n", $5, $NF}'
echo ""
echo "📦 Phiên bản 1: dist/soi-theme.zip (Shopify-chuẩn — KHÔNG wrapper)"
echo "📦 Phiên bản 2: dist/soi-theme-wrapped.zip (có wrapper folder soi-theme/)"
echo ""
echo "→ Upload lên Haravan dashboard: Cấu hình → Giao diện → Tải lên giao diện"
echo "→ Thử phiên bản 1 trước. Nếu báo lỗi 'invalid theme structure', dùng phiên bản 2."
