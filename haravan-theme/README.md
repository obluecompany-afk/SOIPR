# S.O.I — Haravan Theme

Theme Liquid cho Haravan storefront. Build từ design Next.js (`/components`) + reuse Sapo theme cũ trong `/legacy/soi-theme`.

## Cấu trúc Haravan-chuẩn

```
haravan-theme/
├── assets/          # CSS, JS, images, fonts (theme.css, theme.js)
├── config/          # settings_schema.json, settings_data.json
├── layout/          # theme.liquid (HTML wrapper, head/body)
├── locales/         # vi.json, en.default.json (i18n)
├── snippets/        # Component fragments (header, footer, cart-drawer)
└── templates/       # Page templates
    ├── index.liquid       # Home
    ├── product.liquid     # Product detail
    ├── collection.liquid  # Collection list
    ├── cart.liquid        # Cart page
    └── customers/         # account, login, register, addresses...
```

## Roadmap

- [x] **Step 2.1** — Skeleton (folders + placeholder files)
- [ ] **Step 2.2** — Port snippets header/footer/cart-drawer + index/product/collection từ Next.js components
- [ ] **Step 2.3** — Build theme.css từ Tailwind config (PostCSS pipeline)
- [ ] **Step 2.4** — Setup `@haravan/cli` + `theme dev` workflow
- [ ] **Step 2.5** — Test với store dev Haravan (cần API credentials)

## Khác Sapo (legacy/soi-theme)

| Sapo | Haravan |
|---|---|
| `.bwt` | `.liquid` |
| `config/` (số ít) | `config/` (số ít, OK) |
| `layout/` | `layout/` |
| Form action `/cart` | Form action `/cart/add` (POST), checkout button name="checkout" |
| Setting types: text, color, checkbox | Full Shopify-style: text, image, url, range, select, color... |

## Dev workflow (sẽ setup ở Step 2.4)

```bash
# Sau khi xin API token + cài CLI
npm install -g @haravan/cli
haravan login
haravan theme serve  # local preview với hot reload
haravan theme push   # deploy lên store
```

## Hai stack cùng tồn tại

- `app/`, `components/`, `lib/` — Next.js (giữ làm design reference + có thể deploy thành site marketing/landing trên Vercel)
- `haravan-theme/` — Liquid theme thực sự chạy trên Haravan storefront
- `legacy/` — bản HTML/Sapo cũ, không còn dùng nhưng giữ lịch sử
