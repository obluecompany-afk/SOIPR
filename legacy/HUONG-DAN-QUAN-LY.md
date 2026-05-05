# Hướng dẫn quản lý nội dung S.O.I sau khi deploy

## 🏗️ Cơ chế

Theme **không lưu** dữ liệu. Admin panel Sapo là nguồn duy nhất. Khi khách vào trang, Sapo đọc data từ DB và bơm vào biến Liquid (`product`, `collection`, `cart`…) cho template render.

→ **Sửa data trong admin → website cập nhật tự động. KHÔNG cần upload theme mới.**

---

## 📦 Sản phẩm & Kho

**Đường dẫn**: `Admin → Website → Sản phẩm`

### Thêm sản phẩm mới
1. Bấm **+ Thêm sản phẩm**
2. Điền: tên, mô tả, ảnh, giá, giá gốc, tồn kho
3. **Biến thể (variants)**: nếu có màu/size → thêm options (Color: 10C Shell, 25N Honey…)
4. **Handle URL**: Sapo tự tạo từ tên, có thể sửa (VD: `mask-fit-ai-filter-cushion`)
5. **Tags** (để filter): `cushion`, `new`, `bestseller`
6. **Collection**: tick các danh mục sản phẩm sẽ xuất hiện
7. Lưu

### Sản phẩm xuất hiện ở đâu trong theme?
| Vị trí theme | Object Liquid | Cần setup gì trong admin? |
|---|---|---|
| Trang chủ → Best Sellers | `collections['best-sellers'].products` | Tạo collection handle = `best-sellers`, gán sản phẩm |
| Trang chủ → Video carousel | `collections['trending'].products` | Tạo collection handle = `trending` |
| Trang chủ → Just Dropped | `collections['just-dropped'].products` | Tạo collection handle = `just-dropped` |
| Trang danh mục `/collections/makeup` | `collection.products` | Gán sản phẩm vào collection `makeup` |
| Trang sản phẩm `/products/xxx` | `product.*` | Không cần setup — truy cập bằng handle |
| Trang search `/search?q=cushion` | `search.results` | Sapo tự index theo title/tag/desc |

### Tồn kho — ẩn/hiện "SOLD OUT"
Theme hiện **chưa** wire `product.available`. Em thêm được vào `product-card.bwt`:
```liquid
{% if product.available == false %}
  <span class="kb-badge-soldout">SOLD OUT</span>
{% endif %}
```
(đã có trong theme hiện tại — Sapo tự set `available=false` khi tất cả variant hết hàng)

---

## 🗂️ Danh mục (Collections)

**Đường dẫn**: `Admin → Website → Danh mục sản phẩm`

### 8 collection CẦN TẠO (theo theme mapping)

| Handle | Tên hiển thị | Xuất hiện ở |
|---|---|---|
| `best-sellers` | Sản phẩm bán chạy | Trang chủ — section Best Sellers |
| `trending` | Đang hot | Trang chủ — video carousel |
| `just-dropped` | Mới ra mắt | Trang chủ — section Just Dropped |
| `face` | Trang điểm mặt | Banner FACE trang collection |
| `lips` | Trang điểm môi | Banner LIPS trang collection |
| `makeup` | Trang điểm | Menu header "Trang điểm" |
| `skincare` | Chăm sóc da | Menu header "Chăm sóc da" |
| `deals` | Khuyến mãi | Menu header "Ưu đãi" |

### Cách gán sản phẩm vào collection
- **Collection tự động**: Đặt rule theo tag/price/vendor (VD: "tag = cushion" → tự vào collection Cushion)
- **Collection thủ công**: Kéo thả từng sản phẩm

Nếu muốn đổi handle: Theme Editor → **Collection hiển thị trang chủ** → đổi "Handle Best Sellers" từ `best-sellers` → handle mới.

---

## 💸 Mã giảm giá

**Đường dẫn**: `Admin → Khuyến mãi → Mã giảm giá`

### Tạo mã
1. Bấm **+ Tạo mã giảm giá**
2. Mã: `WELCOME10`
3. Loại: `% giảm` hoặc `Số tiền giảm` hoặc `Free shipping`
4. Giá trị: 10%
5. Điều kiện: đơn tối thiểu $30, chỉ lần đầu mua, v.v.
6. Giới hạn: số lần dùng, ngày hết hạn
7. Áp dụng cho: toàn shop / collection cụ thể / sản phẩm cụ thể

### User dùng thế nào?
Có 2 cách:
1. **Link trực tiếp**: `https://shop.mysapo.net/discount/WELCOME10` → tự áp dụng vào session
2. **Nhập tại checkout**: Trang `checkout.html` em đã có ô input "Mã giảm giá" → Sapo native xử lý

Theme **không cần code thêm** — Sapo tự tính và hiện:
- `cart.cart_level_discount_applications` — áp dụng toàn giỏ
- `item.line_level_discount_allocations` — áp dụng từng line
- `cart.total_discount` — tổng giảm

---

## 👥 Khách hàng & Đơn hàng

**Đường dẫn**:
- `Admin → Khách hàng` — list account, edit profile, xem lịch sử mua
- `Admin → Đơn hàng` — list order, mark shipped, refund

Theme hiện có sẵn flow:
- Register → `customers/register.bwt` → tạo account trong Sapo
- Login → `customers/login.bwt`
- Account dashboard `customers/account.bwt` → đọc `customer.orders`
- Order detail `customers/order.bwt` → đọc `order.*`

→ **Không cần sửa theme**, chỉ cần user tự đăng ký và Sapo quản lý toàn bộ.

---

## 📄 Trang nội dung & Blog

### Pages (About / Contact / Guide)
**Đường dẫn**: `Admin → Website → Trang nội dung`

1. Tạo page mới, URL: `/pages/about`, nội dung (WYSIWYG editor)
2. **Template**: chọn `page` hoặc `page.about` / `page.contact` / `page.guide`
3. Nếu chọn `page.about` → Sapo render file `templates/page.about.bwt` của theme

Theme đọc: `{{ page.title }}`, `{{ page.content }}`

### Blog
**Đường dẫn**: `Admin → Website → Blog & Bài viết`

1. Tạo blog tên "Tin tức", handle `news` → URL `/blogs/news`
2. Viết bài → tự ra ở `article.bwt`
3. Menu header "Tin tức" đã link `/blogs/news`

---

## 🧭 Menu Navigation

**Đường dẫn**: `Admin → Website → Navigation`

### Menu cần tạo

**Menu 1: `main-menu`** (header — 10 mục):
- Mua sắm → `/collections/all`
- Trang điểm → `/collections/makeup`
- Chăm sóc da → `/collections/skincare`
- Ưu đãi → `/collections/deals`
- Thẻ quà tặng → `/pages/gift-card`
- Dịch vụ ảo → `/pages/virtual-services`
- Liên hệ → `/pages/contact`
- Tiracels → `/pages/tiracels`
- Tin tức → `/blogs/news`
- Phần thưởng → `/pages/rewards`

**Menu 2: `footer`** (footer — 6 mục):
- Collabs, Accessibility, Terms, Privacy, Shipping, Refund

Theme đọc: `{% for link in linklists['main-menu'].links %}` — tự render.
Đổi link trong admin → **website cập nhật ngay**, không cần sửa code.

---

## 🎨 Theme Editor — chỉnh visual không cần code

**Đường dẫn**: `Admin → Website → Giao diện → Chỉnh sửa giao diện` (nút dấu chấm ba)

Hiện có **9 nhóm settings** (em vừa mở rộng):

### 1. Thông tin chung
- Logo text "S.O.I" hoặc upload logo ảnh (ưu tiên ảnh nếu có)
- Màu chủ đạo (đỏ `#C8102E`)
- Màu chữ, màu nền

### 2. Thanh thông báo (Announcement bar)
- Checkbox bật/tắt
- Text tuỳ ý
- Link tuỳ chọn

### 3. Banner trang chủ
- Nhãn nhỏ, tiêu đề, ngày
- Upload ảnh nền
- Link khi click
- Màu nền

### 4. Collection hiển thị trang chủ
- 3 handle collection (Best / Trending / Just Dropped)
- Số sản phẩm hiển thị

### 5. Free shipping
- Ngưỡng USD (mặc định 50)

### 6. Mạng xã hội
- URL: Facebook, Instagram, TikTok, YouTube

### 7. Thông tin liên hệ
- Địa chỉ, email, hotline, giờ làm việc (hiện trong contact.bwt + footer)

### 8. SEO / Social preview
- Meta description mặc định
- Ảnh Open Graph 1200×630

Save → Sapo ghi vào `settings_data.json` → template đọc `{{ settings.xxx }}` → web update.

---

## 📁 Sửa code trực tiếp (khi cần tuỳ biến sâu)

### Cách 1: Code editor trong Sapo admin
`Admin → Website → Giao diện → Chỉnh sửa code`

Thấy cây file giống em đã zip:
- `layout/theme.bwt`
- `templates/*.bwt`
- `snippets/*.bwt`
- `assets/theme.css`, `theme.js`
- `config/settings_schema.json`
- `locales/*.json`

Edit trực tiếp → **Lưu** → site cập nhật ngay.

⚠️ **Luôn bấm "Tạo bản sao" (Duplicate theme) trước khi sửa lớn** để rollback nếu hỏng.

### Cách 2: Upload theme mới
Em sửa ở local → gửi `soi-theme-v1.1.zip` → anh upload qua `Tải lên giao diện` → Sapo giữ theme cũ làm backup → nếu hài lòng bấm **Xuất bản** (publish).

---

## 🔄 Workflow khuyến nghị sau launch

```
Nhu cầu                    → Làm ở đâu?

Thêm 50 sản phẩm mới       → Admin Panel (hoặc import CSV)
Chạy sale Black Friday     → Tạo discount code "BLACK50"
Đổi banner Matcha → Xmas   → Theme Editor → Banner trang chủ → upload ảnh mới
Thay logo                  → Theme Editor → Logo ảnh
Đổi màu thương hiệu        → Theme Editor → Màu chủ đạo
Viết blog tuần             → Admin → Blog → Bài mới
Thêm trang "Hỏi đáp"       → Admin → Trang nội dung → template: page
Đổi link trong footer      → Admin → Navigation → footer menu
Sửa copy "Free ship $50"   → Theme Editor → Announcement text
Thêm field "Bảo hành"      → Code editor (cần lập trình viên)
Đổi layout product page    → Code editor hoặc upload theme mới
```

---

## ❓ Khi nào cần Claude / developer quay lại?

Chỉ cần gọi em khi:
- Thêm section mới (VD: lookbook, comparison table)
- Tích hợp app bên thứ 3 (reviews, wishlist với backend)
- Đổi layout trang lớn (VD: redesign homepage)
- Tối ưu hiệu năng, SEO
- Bug hiển thị khó fix qua Theme Editor

Các task "CRUD" hàng ngày (thêm sản phẩm, đổi banner, tạo mã) — anh tự làm qua admin, **không cần code**.
