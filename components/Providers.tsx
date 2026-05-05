'use client';

import { CartProvider } from '@/lib/cart-context';
import type { ReactNode } from 'react';

/**
 * Wrapper gom tất cả Context providers cần dùng client-side.
 * Đặt trong layout.tsx (Server Component) — chỉ Providers là Client.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
