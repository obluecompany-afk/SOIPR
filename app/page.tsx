'use client';

import { useCart } from '@/lib/cart-context';
import { formatVND } from '@/lib/format';

const DEMO_PRODUCTS = [
  { id: 'demo-matcha', name: 'Bộ Matcha', variant: 'Refresh & dưỡng ẩm', price: 850000, image: '🧴' },
  { id: 'demo-rose', name: 'Bộ Hoa Hồng', variant: 'Sáng & se khít', price: 720000, image: '🌸' },
  { id: 'demo-lip', name: 'Bộ Môi', variant: 'Plumping lip 3 màu', price: 480000, image: '💄' },
];

export default function Home() {
  const cart = useCart();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-4 text-xs uppercase tracking-widest text-text-muted">
        Phase 1 · Layout chung · Step 1.3 ✓
      </p>
      <h2 className="font-serif text-5xl leading-tight">
        Header · Mobile Menu · Footer · Cart Drawer
      </h2>
      <p className="mt-6 max-w-md mx-auto text-sm text-text-muted">
        Bấm "Thêm vào giỏ" rồi mở icon giỏ hàng để xem CartDrawer Rhode-style trượt từ phải.
      </p>

      <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DEMO_PRODUCTS.map((p) => (
          <article
            key={p.id}
            className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 p-5"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-cream text-5xl">
              {p.image}
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">{p.name}</h3>
            <p className="text-xs text-text-muted">{p.variant}</p>
            <p className="text-sm font-semibold">{formatVND(p.price)}</p>
            <button
              type="button"
              onClick={() => {
                cart.add(p);
                cart.open();
              }}
              className="mt-1 w-full bg-black px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary"
            >
              Thêm vào giỏ
            </button>
          </article>
        ))}
      </section>

      <ul className="mt-14 flex flex-col gap-2 text-left text-sm text-text-muted max-w-md mx-auto">
        <li>· Click giỏ hàng → drawer slide từ phải</li>
        <li>· Click overlay đen / nút ✕ / Esc → đóng</li>
        <li>· +/- thay đổi số lượng, "Xóa" remove item</li>
        <li>· Refresh page → cart giữ qua localStorage</li>
        <li>· Free ship progress bar khi đạt 1.250.000₫</li>
      </ul>
    </main>
  );
}
