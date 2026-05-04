# 🎨 Cách chỉnh Sapo để trông GIỐNG HTML preview

## Tổng quan: Vì sao Sapo trông khác preview?

Theme **code** giống hệt preview. Khác biệt chỉ do **dữ liệu**:
- Preview dùng **emoji + text demo** (cố định)
- Sapo render từ **data thật trong shop** (sản phẩm, collection, ảnh, menu)

→ Muốn Sapo giống preview, anh phải **cấu hình data** trong admin.

---

## 🎯 Checklist 7 bước chỉnh admin

### Bước 1 — Upload ảnh vào Tệp Media

**Admin → Tệp tin** (Files/Media)
Upload các ảnh:
- `logo.png` (logo S.O.I, nền trong suốt, 300×80)
- `banner-matcha.jpg` (hero banner, 1600×600)
- `bs-1.jpg`, `bs-2.jpg`... (ảnh sản phẩm, 800×800)

Copy URL mỗi ảnh sau khi upload để paste vào Theme Editor.

---

### Bước 2 — Tạo 3 Collection chính

**Admin → Website → Danh mục sản phẩm → + Thêm danh mục**

| Tên | Handle (URL) | Mô tả |
|---|---|---|
| Sản phẩm bán chạy | **`best-sellers`** | Gán 4 sản phẩm hot |
| Trending | **`trending`** | Gán 5-8 sản phẩm đang hot (cho carousel) |
| Mới ra mắt | **`just-dropped`** | Gán 2 sản phẩm mới nhất |

⚠️ **Handle phải chính xác** — theme đọc theo handle này.

Hoặc vào **Theme Editor → Collection hiển thị trang chủ** đổi handle theo shop anh.

---

### Bước 3 — Thêm sản phẩm

**Admin → Website → Sản phẩm → + Thêm sản phẩm**

Cho mỗi sản phẩm điền:
1. **Tên**: VD "Mask Fit Red Cushion"
2. **Mô tả**: "For Long-Lasting Glow" — sẽ hiện trên card
3. **Ảnh chính**: upload (Sapo cần ảnh mới hiển thị đẹp, không có emoji)
4. **Giá**: 625000 (VND raw, Sapo format tự)
5. **Giá gốc** (compare_at_price): nếu có sale, điền giá cao hơn để hiện gạch
6. **Variants**: nếu có màu/size → thêm options + variant
7. **Collections**: tick `best-sellers`, `trending`, hoặc `just-dropped`
8. **Tag**: thêm tag để filter (cushion, lip, skincare...)

Làm tối thiểu **10 sản phẩm** để trang chủ hiển thị đủ 4 sections.

---

### Bước 4 — Theme Editor (Chỉnh visual)

**Admin → Website → Giao diện → file-wrapped → Tuỳ chỉnh**

Có 8 nhóm settings, anh lần lượt chỉnh:

#### A. Thông tin chung
- **Tên thương hiệu**: `S.O.I` (giữ nguyên)
- **Logo ảnh (URL)**: paste URL logo từ Tệp Media (để trống = dùng text)
- **Màu chủ đạo**: `#C8102E` (đỏ) hoặc đổi theo thương hiệu
- **Màu chữ**, **Màu nền**: giữ mặc định

#### B. Thanh thông báo
- **Hiển thị**: ✅ bật
- **Nội dung**: `FREE SHIP cho đơn từ 1.250.000₫`
- **Link**: `/collections/deals`

#### C. Banner trang chủ
- **Nhãn nhỏ**: `ƯU ĐÃI MÙA XUÂN`
- **Tiêu đề**: `BỘ SƯU TẬP MATCHA`
- **Ngày**: `20/04 – 27/04`
- **Ảnh nền banner (URL)**: paste URL `banner-matcha.jpg`
- **Link click banner**: `/collections/trending`
- **Màu nền banner**: `#c9dfb7` (xanh matcha)

#### D. Collection hiển thị trang chủ
- **Handle Best Sellers**: `best-sellers`
- **Handle Trending**: `trending`
- **Handle Just Dropped**: `just-dropped`
- **Số sản phẩm Best Sellers**: `4`

#### E. Miễn phí vận chuyển
- **Mức đơn tối thiểu**: `1250000`

#### F. Mạng xã hội
- Paste URL Facebook / Instagram / TikTok / YouTube shop anh

#### G. Thông tin liên hệ
- Địa chỉ, email, hotline, giờ làm việc → sẽ hiện footer + trang contact

#### H. SEO / Social preview
- Meta description
- Ảnh Open Graph (URL): paste ảnh 1200×630 từ Tệp Media

**Bấm Lưu** ở góc phải trên mỗi lần đổi.

---

### Bước 5 — Tạo Menu Navigation

**Admin → Website → Navigation → + Thêm menu**

**Menu 1: Main Menu (header)**
- Tên: `Main menu`
- Handle: `main-menu`
- Thêm 10 link:
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

**Menu 2: Footer Menu**
- Handle: `footer`
- Thêm link chính sách:
  - Collabs, Accessibility, Terms, Privacy, Shipping, Refund

---

### Bước 6 — Tạo Pages nội dung

**Admin → Website → Trang nội dung → + Thêm trang**

Tạo các trang (URL handle quan trọng):

| Tiêu đề | Handle | Template |
|---|---|---|
| Về chúng tôi | `about` | `page.about` |
| Liên hệ | `contact` | `page.contact` |
| Hướng dẫn | `guide` | `page.guide` |
| Thẻ quà tặng | `gift-card` | `page` |
| Dịch vụ ảo | `virtual-services` | `page` |
| Tiracels | `tiracels` | `page` |
| Phần thưởng | `rewards` | `page` |
| Thử ảo | `thu-ao` | `page` |
| Tìm màu | `tim-mau` | `page` |
| Trắc nghiệm da | `trac-nghiem-da` | `page` |

Chọn template phù hợp ở dropdown khi tạo page.

---

### Bước 7 — Tạo Blog

**Admin → Website → Blog & Bài viết → + Blog**

- Tên: `Tin tức`
- Handle: `news` → URL `/blogs/news`
- Viết 3-5 bài đầu tiên để có content

---

## 🎨 Các điểm visual preview có, Sapo cần config

| Preview có | Sapo cần làm gì |
|---|---|
| Hero xanh matcha + "MATCHA REFRESH" | Theme Editor → Banner: upload ảnh + set màu `#c9dfb7` |
| 4 sản phẩm Best Sellers | Tạo collection `best-sellers` + gán sản phẩm |
| Carousel sản phẩm trending | Tạo collection `trending` + 5-8 sản phẩm có ảnh đẹp |
| 2 card Just Dropped màu pink/orange | Tạo collection `just-dropped` + 2 sản phẩm mới |
| Menu header 10 mục | Tạo Navigation `main-menu` + 10 link |
| Footer: social, liên hệ | Theme Editor → Mạng xã hội + Thông tin liên hệ |
| Logo "S.O.I" Times New Roman | Giữ mặc định hoặc upload logo ảnh |
| Giá hiện "625.000₫" | Sapo Settings → Tiền tệ → **VNĐ** (quan trọng) |

---

## 🔍 Kiểm tra cuối cùng

Sau khi config xong, vào URL shop `https://<shop>.mysapo.net/`:

- ✅ Header: 10 mục menu hiện đúng
- ✅ Hero: banner ảnh + tiêu đề matcha
- ✅ 4 sản phẩm Best Sellers (có ảnh, tên, giá VND)
- ✅ 3 card Get Matched (thử ảo / tìm màu / quiz)
- ✅ Carousel trending
- ✅ 2 card Just Dropped
- ✅ Newsletter
- ✅ Footer: social icons, contact, menu
- ✅ Click sản phẩm → trang product với shade picker
- ✅ Click Add to Cart → /cart → Thanh toán → Sapo checkout

## ⚠️ Nếu thiếu ảnh → sản phẩm hiện placeholder xám
- Khắc phục: upload ảnh product.featured_image trong admin
- Kích thước khuyến nghị: 1000×1000 (square) cho product, 1600×600 cho banner

## 🐛 Nếu hiện $ thay vì ₫
- **Admin → Cài đặt → Tiền tệ → chọn VNĐ**
- Format: `{{amount_no_decimals_with_comma_separator}}₫`
- Tắt Multi-currency nếu không cần

## 💡 Tips
- Ảnh **< 500KB** mỗi file → tải trang nhanh
- Dùng WebP format nếu Sapo support
- Theme Editor có preview 3 chế độ: mobile/tablet/desktop (icons góc trên)
- Lưu thường xuyên — Sapo không auto-save
