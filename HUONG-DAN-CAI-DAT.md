# Hướng dẫn cài đặt Theme S.O.I lên Sapo

## 📦 Cấu trúc theme hoàn chỉnh (33 file .bwt)

```
soi-theme/
├── assets/
│   ├── theme.css
│   └── theme.js
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.bwt
├── locales/
│   ├── vi.json
│   └── en.json
├── snippets/                          (5 file)
│   ├── header.bwt
│   ├── footer.bwt
│   ├── cart-drawer.bwt
│   ├── hero-banner.bwt
│   └── product-card.bwt
└── templates/                         (19 file + 8 customers/)
    ├── index.bwt                      ← Trang chủ
    ├── 404.bwt
    ├── article.bwt                    ← Bài blog
    ├── blog.bwt                       ← Danh sách blog
    ├── cart.bwt
    ├── collection.bwt                 ← Trang danh mục
    ├── collection.ajaxload.bwt        ← AJAX load more
    ├── list_collections.bwt           ← Tất cả danh mục
    ├── page.bwt                       ← Trang tĩnh mặc định
    ├── page.about.bwt                 ← Trang Giới thiệu
    ├── page.contact.bwt               ← Trang Liên hệ (có form)
    ├── page.guide.bwt                 ← Trang Hướng dẫn
    ├── password.bwt                   ← Trang khi shop đóng
    ├── product.bwt                    ← Trang sản phẩm
    ├── product.view.bwt               ← AJAX quick view
    ├── product.wishlist.bwt           ← Sản phẩm yêu thích
    ├── search.bwt                     ← Kết quả tìm kiếm
    ├── search.data.bwt                ← Live search JSON
    ├── search.data_list.bwt           ← Live search HTML dropdown
    └── customers/
        ├── login.bwt
        ├── register.bwt
        ├── account.bwt
        ├── addresses.bwt
        ├── change_password.bwt
        ├── reset_password.bwt
        ├── orders.bwt
        └── order.bwt
```

## ⚠️ Quan trọng: Extension `.bwt`

Sapo dùng `.bwt` (Bizweb Theme) chứ KHÔNG phải `.liquid`. Tất cả file đã đổi sang `.bwt` đúng chuẩn Sapo.

---

## 🚀 Cài đặt 5 bước

### Bước 1 — Kiểm tra cấu trúc

```bash
cd /Users/mac/Documents/TIRTIR/soi-theme
ls
# Phải thấy: assets/  config/  layout/  locales/  snippets/  templates/
```

### Bước 2 — Đóng gói zip (đã làm sẵn)

```bash
cd /Users/mac/Documents/TIRTIR/soi-theme
zip -r ../soi-theme-v1.zip . -x "*.DS_Store" "*.md"
```

### Bước 3 — Upload Sapo Admin

1. Đăng nhập: `https://{shop-name}.mysapo.net/admin`
2. **Website** → **Giao diện** → **Tải lên giao diện**
3. Chọn `soi-theme-v1.zip` → Upload

### Bước 4 — Tạo collection trên Sapo

| Handle | Hiển thị ở |
|---|---|
| `best-sellers` | Trang chủ — Best Sellers |
| `trending` | Trang chủ — Carousel |
| `just-dropped` | Trang chủ — Just Dropped |
| `makeup` | Menu Trang điểm |
| `skincare` | Menu Chăm sóc da |
| `deals` | Menu Ưu đãi |
| `face` | Collection banner FACE |
| `lips` | Collection banner LIPS |

### Bước 5 — Tạo pages + menu

**Pages cần tạo (Website → Trang nội dung):**
- `/pages/gift-card` → Thẻ quà tặng
- `/pages/virtual-services` → Dịch vụ ảo
- `/pages/contact` → Liên hệ (dùng template `page.contact`)
- `/pages/tiracels` → Tiracels
- `/pages/rewards` → Phần thưởng
- `/pages/about` → Về chúng tôi (dùng template `page.about`)
- `/pages/guide` → Hướng dẫn (dùng template `page.guide`)

**Menu cần tạo (Website → Navigation):**
- `main-menu`: 10 mục trong header
- `footer`: Collabs, Accessibility, Terms, Privacy, Shipping, Refund

---

## 🎯 Danh sách tính năng đầy đủ

### Khách vãng lai
- ✅ Xem trang chủ, sản phẩm, danh mục, blog
- ✅ Tìm kiếm (live search dropdown)
- ✅ Giỏ hàng (drawer + trang riêng)
- ✅ Thanh toán
- ✅ Đăng ký nhận tin qua form newsletter

### Khách đã đăng ký
- ✅ Đăng ký tài khoản (`customers/register`)
- ✅ Đăng nhập (`customers/login`)
- ✅ Quên/đặt lại mật khẩu (`customers/reset_password`)
- ✅ Đổi mật khẩu (`customers/change_password`)
- ✅ Xem lịch sử đơn hàng (`customers/orders`)
- ✅ Chi tiết đơn (`customers/order`)
- ✅ Quản lý địa chỉ (`customers/addresses`)
- ✅ Sản phẩm yêu thích (`product.wishlist`)

### Admin shop
- ✅ Tạm khóa shop → hiện `password.bwt` (form đăng ký nhận thông báo)
- ✅ Đổi settings qua Theme Editor (logo, banner, collection handles)

---

## 🐛 Troubleshooting

### Upload lỗi "File không hợp lệ"
→ Đảm bảo zip **không bọc folder cha**. Giải nén phải thấy ngay `assets/`, `layout/`...

```bash
cd soi-theme && zip -r ../theme.zip . -x "*.DS_Store"
```

### Template không được nhận diện
→ Kiểm tra extension đúng `.bwt` (không phải `.liquid`)
→ Tên file đúng chuẩn: `customers/login.bwt` (có subfolder)

### Trang trắng sau upload
→ `layout/theme.bwt` phải có `{{ content_for_header }}` và `{{ content_for_layout }}`

### Form contact/login không submit được
→ Đảm bảo Sapo hỗ trợ `{% form 'contact' %}`, `{% form 'customer_login' %}`
→ Nếu không hỗ trợ, đổi sang `<form action="/contact" method="post">`

---

## ✅ Checklist đóng gói

- [x] `.bwt` extension cho mọi file liquid
- [x] `layout/theme.bwt` có `content_for_header` + `content_for_layout`
- [x] Đủ 4 template bắt buộc: `index`, `product`, `collection`, `cart`
- [x] Thư mục `customers/` với 8 file
- [x] 3 variant của page: `page.about`, `page.contact`, `page.guide`
- [x] `password.bwt` cho trang khoá shop
- [x] `list_collections.bwt` cho trang tất cả danh mục
- [x] 3 AJAX endpoint: `collection.ajaxload`, `search.data`, `search.data_list`
- [x] `product.view` (quick view) + `product.wishlist`
- [x] `settings_schema.json` hợp lệ
- [x] Dùng `{% include %}` không dùng `{% render %}`
- [x] UTF-8 không BOM
- [x] Zip < 50MB (hiện tại 37KB)

---

## 🔧 Lệnh rebuild zip

```bash
cd /Users/mac/Documents/TIRTIR/soi-theme && \
  rm -f ../soi-theme-v1.zip && \
  zip -r ../soi-theme-v1.zip . -x "*.DS_Store" "*.md" && \
  echo "✅ Đã tạo: ../soi-theme-v1.zip ($(ls -lh ../soi-theme-v1.zip | awk '{print $5}'))"
```
