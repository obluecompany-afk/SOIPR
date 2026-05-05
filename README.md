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

### Cách 1 — Upload zip qua Haravan dashboard (KHUYẾN NGHỊ — không cần API token)

```bash
bash scripts/build-zip.sh
# → tạo dist/soi-theme.zip (Shopify-chuẩn)
# → tạo dist/soi-theme-wrapped.zip (fallback có wrapper folder)
```

Sau đó vào Haravan dashboard:
1. **Cấu hình → Giao diện → Tải lên giao diện**
2. Chọn `dist/soi-theme.zip` (thử phiên bản 1 trước)
3. Nếu báo lỗi "invalid theme structure" → thử `dist/soi-theme-wrapped.zip`
4. Sau khi upload xong, bấm **Xuất bản** để dùng theme mới

### Cách 2 — Haravan CLI (cần API token, có live reload)

```bash
npm install -g @haravan/cli
haravan login                        # nhập store URL + token
cd haravan-theme && haravan theme serve   # dev với hot reload
haravan theme push                   # upload thay cho zip
```

> **Cần có**: Haravan store account + API token (lấy ở dashboard, mục Apps → Private apps).

## Roadmap

- [x] **Phase 2.1** — Theme skeleton
- [x] **Phase 2.2** — Port snippets header, footer, mobile-menu, cart-drawer, product-card
- [x] **Phase 2.3-2.10** — Port toàn bộ templates: index, product, collection, cart, customer (login/register/account/orders/addresses/reset_password), search, blog, article, page, page.contact, 404
- [x] **Phase 2.11** — Build zip script (`scripts/build-zip.sh`)
- [ ] **Phase 2.12** — Test upload `dist/soi-theme.zip` lên Haravan store thật
- [ ] **Phase 2.13** — Iterate fix bug sau khi xem trên store

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
