# 🚀 Deploy lên Vercel

## ⚠️ Lý do 404 trước đó

Vercel cần biết:
1. Đâu là root (folder chứa HTML)
2. File nào là index
3. Routing rules

→ Em đã thêm 2 file config:
- **`vercel.json`** — routing & cache rules
- **`.vercelignore`** — exclude file thừa (Sapo theme zip, docs, .DS_Store)

---

## 🎯 Cách deploy (chọn 1 trong 3)

### Cách 1: Vercel CLI (nhanh nhất)

```bash
# Cài CLI nếu chưa có
npm install -g vercel

# Vào folder dự án
cd /Users/mac/Documents/TIRTIR

# Login
vercel login

# Deploy preview
vercel

# Deploy production (lúc nào sẵn sàng)
vercel --prod
```

CLI hỏi:
- Set up and deploy? → **Y**
- Which scope? → chọn account anh
- Link to existing project? → **N** (lần đầu)
- Project name? → ví dụ `soi-beauty`
- Code directory? → **`./`** (hoặc Enter để mặc định)
- Want to override settings? → **N**

→ Vercel build + deploy → trả về URL `https://soi-beauty.vercel.app`

### Cách 2: Push GitHub + Vercel Dashboard

```bash
cd /Users/mac/Documents/TIRTIR
git init
git add .
git commit -m "S.O.I theme demo"
git remote add origin https://github.com/<user>/soi-beauty.git
git push -u origin main
```

Rồi vào https://vercel.com/new:
1. Import từ Git provider
2. Chọn repo `soi-beauty`
3. Framework Preset: **Other** (hoặc Static)
4. Root Directory: `./` (mặc định)
5. Build Command: **để trống**
6. Output Directory: **để trống** (hoặc `./`)
7. Deploy

### Cách 3: Drag-and-drop ZIP lên Vercel

1. Tạo zip:
   ```bash
   cd /Users/mac/Documents/TIRTIR
   zip -r soi-deploy.zip *.html assets/ -x "*.DS_Store"
   ```
2. Vào https://vercel.com/new → drag-and-drop file `soi-deploy.zip`
3. Vercel auto-detect static site → deploy

---

## 🔍 Sau khi deploy thành công

URL truy cập:
- `https://<project>.vercel.app/` → Trang chủ (`index.html`)
- `https://<project>.vercel.app/preview` → Trang tổng hợp (`all-pages.html`)
- `https://<project>.vercel.app/product` → Trang sản phẩm (cleanUrls đã bật)
- `https://<project>.vercel.app/cart`
- `https://<project>.vercel.app/checkout`

`cleanUrls: true` cho phép truy cập `/product` thay vì `/product.html`.

---

## 📋 Files được deploy

Vercel sẽ deploy 28 file:
- 25 file `.html`
- 3 file trong `assets/`: `theme.css`, `theme.js`, `chrome.js`

**KHÔNG deploy** (theo `.vercelignore`):
- `soi-theme/` (Sapo theme — chỉ dùng upload Sapo)
- `*.zip`, `*.md`, `*.png`, `start.sh`
- `.DS_Store`, `.git/`

→ Tổng dung lượng deploy: **~85KB** (rất nhanh)

---

## 🧪 Verify config local trước khi deploy

```bash
cd /Users/mac/Documents/TIRTIR
npx vercel dev
```

Vercel sẽ chạy local server emulate production tại `http://localhost:3000`.

Test các URL:
- `/` → index
- `/preview` → all-pages
- `/product` → product.html (clean URL)
- `/assets/theme.css` → CSS file

---

## 🐛 Nếu vẫn 404 sau khi setup

1. **Verify `vercel.json` ở root**:
   ```bash
   ls -la /Users/mac/Documents/TIRTIR/vercel.json
   ```

2. **Re-deploy ép cache fresh**:
   ```bash
   vercel --prod --force
   ```

3. **Check Build Logs** trên Vercel dashboard:
   - Vercel → Project → Deployments → click deploy gần nhất
   - Tab "Build Logs" — xem có error gì

4. **Check route URL** đang truy cập:
   - 404 ở `/index` → bình thường (em đã redirect → `/`)
   - 404 ở `/all-pages` → vào `/preview` hoặc `/all-pages.html`

5. **Inspect bằng curl**:
   ```bash
   curl -I https://<project>.vercel.app/
   curl -I https://<project>.vercel.app/index.html
   ```

---

## 🎨 Custom domain (nếu có)

Sau khi deploy thành công, vào:
- Vercel Project → Settings → Domains
- Add `soi.vn` (hoặc subdomain)
- Vercel hướng dẫn setup DNS A/CNAME

---

## 💡 Tips

- **Preview deploys**: Mỗi `git push` Vercel tạo URL preview riêng (anh test trước khi merge)
- **Production**: Chỉ deploy khi `vercel --prod` hoặc merge vào branch chính
- **Free tier**: 100GB bandwidth/tháng — đủ cho demo
- **Analytics**: Vercel có sẵn Web Analytics free
