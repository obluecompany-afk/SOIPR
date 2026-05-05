# S.O.I — Next.js + Supabase + Vercel

K-Beauty ecommerce site đang migrate từ static HTML sang stack hiện đại.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility-first styling)
- **Supabase** (Postgres + Auth + Storage) — kích hoạt ở Phase 3
- **Vercel** (deploy)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Cấu trúc

```
.
├── app/             # Next.js App Router (routes + layouts)
├── components/      # React components dùng chung
├── lib/             # Helpers (supabase client, utils)
├── supabase/        # Migrations SQL + generated types (Phase 3)
├── scripts/         # Shell scripts (view-legacy.sh, ...)
├── legacy/          # HTML/CSS/JS gốc — giữ làm reference
└── ...config files
```

## Roadmap

- [x] **Phase 0** — Foundation: Next.js skeleton + Tailwind + folder layout
- [ ] **Phase 1** — Layout chung: Header, Footer, MobileMenu, CartDrawer
- [ ] **Phase 2** — Static pages: home, collection, product, cart, checkout...
- [ ] **Phase 3** — Supabase data: products, variants, dynamic queries
- [ ] **Phase 4** — Auth + Order: login, đặt hàng, lịch sử

## Xem bản HTML cũ

```bash
bash scripts/view-legacy.sh
# → http://localhost:8080
```
