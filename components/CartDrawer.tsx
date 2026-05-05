'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatVND, FREE_SHIPPING_THRESHOLD } from '@/lib/format';

export default function CartDrawer() {
  const { items, isOpen, close, remove, update, subtotal, mounted } = useCart();

  /* Tránh hydration mismatch — render placeholder cho đến khi mount */
  const displayItems = mounted ? items : [];
  const displaySubtotal = mounted ? subtotal : 0;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - displaySubtotal);
  const progress = Math.min(100, (displaySubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-[150] bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* Drawer */}
      <aside
        aria-label="Giỏ hàng"
        aria-hidden={!isOpen}
        className={[
          'fixed right-0 top-0 z-[160] flex h-[100dvh] w-full max-w-[420px] flex-col bg-white shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(.7,0,.2,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">
            Giỏ hàng ({mounted ? displayItems.length : 0})
          </h3>
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="text-lg text-gray-500 transition-colors hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Free shipping bar */}
        {displayItems.length > 0 && (
          <div className="border-b border-gray-100 bg-cream px-5 py-3">
            {remaining > 0 ? (
              <p className="text-xs text-text-muted">
                Thêm <strong className="text-primary">{formatVND(remaining)}</strong> để
                được miễn phí vận chuyển.
              </p>
            ) : (
              <p className="text-xs font-semibold text-green-700">
                ✓ Đơn hàng đã đủ điều kiện miễn phí ship
              </p>
            )}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
              <span
                className="block h-full bg-primary transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!mounted ? (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
              Đang tải…
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-text-muted">Giỏ hàng trống</p>
              <Link
                href="/collection"
                onClick={close}
                className="text-sm font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                Mua sắm →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {displayItems.map((it) => (
                <li
                  key={`${it.id}-${it.variant ?? ''}`}
                  className="flex gap-3 border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream text-3xl">
                    {it.image ?? '🛍️'}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      {it.name}
                    </p>
                    {it.variant && (
                      <p className="text-xs text-text-muted">{it.variant}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold">
                      {formatVND(it.price * it.quantity)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-sm">
                        <button
                          type="button"
                          onClick={() => update(it.id, it.quantity - 1)}
                          aria-label="Giảm số lượng"
                          className="px-2 text-base leading-none text-gray-600 hover:text-black"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => update(it.id, it.quantity + 1)}
                          aria-label="Tăng số lượng"
                          className="px-2 text-base leading-none text-gray-600 hover:text-black"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label="Xóa khỏi giỏ"
                        className="text-xs text-text-muted underline transition-colors hover:text-primary"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer subtotal + checkout */}
        {displayItems.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="uppercase tracking-widest">Tạm tính</span>
              <strong className="text-base">{formatVND(displaySubtotal)}</strong>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="flex items-center justify-center gap-2 bg-black py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-primary"
            >
              Tiến hành thanh toán
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-2 text-center text-[11px] text-text-muted">
              Phí ship, thuế và khuyến mãi tính ở trang thanh toán.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
