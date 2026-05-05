'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CartItem = {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  /** Đã hydrate từ localStorage chưa — dùng để tránh hydration mismatch */
  mounted: boolean;
  add: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Tổng số lượng (để hiển thị badge) */
  count: number;
  /** Tổng tiền */
  subtotal: number;
};

const STORAGE_KEY = 'soi-cart';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Hydrate từ localStorage 1 lần sau mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore parse error */
    }
    setMounted(true);
  }, []);

  /* Persist mỗi lần items đổi (chỉ sau khi đã mount) */
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota error */
    }
  }, [items, mounted]);

  /* Esc đóng drawer */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  /* Lock body scroll khi drawer mở */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const add = useCallback<CartContextValue['add']>((it) => {
    const qty = it.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((p) => p.id === it.id && p.variant === it.variant);
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [...prev, { ...it, quantity: qty }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const update = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(0, quantity) } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    isOpen,
    mounted,
    add,
    remove,
    update,
    clear,
    open,
    close,
    toggle,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
