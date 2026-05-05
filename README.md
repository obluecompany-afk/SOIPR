# S.O.I — Haravan Theme

Theme Liquid cho **S.O.I** chạy trên platform Haravan. Giao diện K-Beauty (Rhode-style) đã có sẵn ở `legacy/` — port qua `haravan-theme/`.

## Cấu trúc repo

```
.
├── haravan-theme/   # Liquid theme — deliverable chính
│   ├── assets/      # CSS, JS, fonts
│   ├── config/      # settings_schema + settings_data
│   ├── layout/      # theme.liquid (HTML wrapper)
│   ├── locales/     # vi.json, en.default.json
│   ├── snippets/    # header, footer, cart-drawer...
│   └── templates/   # index, product, collection, cart...
├── legacy/          # Design reference (KHÔNG deploy, chỉ tham khảo)
│   ├── *.html       # 25 trang HTML thiết kế gốc
│   └── assets/      # theme.css (58KB), theme.js, animations.js, chrome.js
├── scripts/
│   └── view-legacy.sh   # Mở HTML cũ trên localhost:8080 để xem design
└── README.md
```

## Xem design gốc (localhost)

```bash
bash scripts/view-legacy.sh
# → http://localhost:8080
# Mở các trang index.html, product.html, collection.html...
```

## Build & deploy Haravan theme

### Bước 1 — Cài Haravan CLI

```bash
npm install -g @haravan/cli
haravan login
```

### Bước 2 — Local dev (live reload)

```bash
cd haravan-theme
haravan theme serve
```

### Bước 3 — Deploy

```bash
cd haravan-theme
haravan theme push   # upload lên store
```

> **Cần có**: Haravan store account + API token (lấy ở dashboard, mục Apps → Private apps).

## Roadmap

- [x] Phase 2.1 — Theme skeleton (folders, configs, placeholder snippets/templates)
- [ ] Phase 2.2 — Port chi tiết design từ `legacy/*.html` + `legacy/assets/theme.css` qua Liquid
  - Header (Rhode-style hamburger morph + nav)
  - Mobile menu (tabs ngang + thẻ sản phẩm + CTA)
  - Footer (3 cột dark BG + form newsletter)
  - Cart drawer (slide phải, free-ship progress, dùng `cart` object Haravan)
  - Hero banner (Supabase image + slow-zoom)
  - Product card grid
- [ ] Phase 2.3 — Hoàn thiện CSS production trong `assets/theme.css`
- [ ] Phase 2.4 — Setup Haravan CLI dev workflow + push lên store thử
- [ ] Phase 2.5 — Customer pages (account, login, register, orders, addresses)
- [ ] Phase 2.6 — Search + Blog (article, blog list) + Page (about, contact, guide) + 404

## Source code references

| Mục đích | File reference trong `legacy/` |
|---|---|
| HTML structure | `index.html`, `product.html`, `collection.html`, `cart.html`... |
| Master stylesheet | `assets/theme.css` (58KB — toàn bộ CSS đã viết) |
| Cart logic + drawer | `assets/theme.js` (31KB) |
| Animation Rhode-style | `assets/animations.js` |
| Header/Footer/Drawer JS inject | `assets/chrome.js` |

Khi port qua Liquid, **dùng những file này làm chuẩn** để giao diện không thay đổi.

## Convention Haravan quan trọng

- File extension: **`.liquid`** (không phải `.bwt` như Sapo)
- Cart logic: do **Haravan handle native** — KHÔNG cần localStorage, không cần Context React
- Form add to cart: `<form action="/cart/add" method="post">` với `<input name="id">` (variant ID)
- Checkout: `<button name="checkout">` trong form `<form action="/cart" method="post">`
- Cart object: `{{ cart.item_count }}`, `{{ cart.items }}`, `{{ cart.total_price | money }}`
- Image: `{{ product.featured_image | product_img_url: 'medium' }}`
- Money: `{{ price | money }}` (auto format theo store config VND)
