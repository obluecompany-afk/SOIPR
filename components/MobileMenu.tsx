'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type TabKey = 'sets' | 'onthego' | 'best' | 'deals';

type Card = {
  href: string;
  emoji: string;
  title: string;
  sub: string;
  badge?: string;
  badgeAlt?: boolean;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'sets', label: 'BỘ SẢN PHẨM' },
  { key: 'onthego', label: 'TRÊN ĐƯỜNG' },
  { key: 'best', label: 'BÁN CHẠY' },
  { key: 'deals', label: 'ƯU ĐÃI' },
];

const PANELS: Record<TabKey, Card[]> = {
  sets: [
    { href: '/products', emoji: '🧴', title: 'BỘ MATCHA', sub: 'Refresh & dưỡng ẩm', badge: 'mới' },
    { href: '/products', emoji: '🌸', title: 'BỘ HOA HỒNG', sub: 'Sáng & se khít', badge: 'mới' },
    { href: '/products', emoji: '💄', title: 'BỘ MÔI', sub: 'Plumping lip 3 màu' },
    { href: '/products', emoji: '🧴', title: 'BỘ S.O.I KIT', sub: '4 sản phẩm cốt lõi', badge: 'chỉ tại S.O.I', badgeAlt: true },
  ],
  onthego: [
    { href: '/products', emoji: '✈️', title: 'TRAVEL KIT', sub: 'Mini size cho chuyến đi' },
    { href: '/products', emoji: '💼', title: 'TÚI MỸ PHẨM', sub: 'Gọn nhẹ tiện lợi' },
  ],
  best: [
    { href: '/products', emoji: '⭐', title: 'SERUM C', sub: 'Best seller 2026', badge: 'hot' },
    { href: '/products', emoji: '💧', title: 'KEM DƯỠNG ẨM', sub: 'Cấp nước 24h' },
  ],
  deals: [
    { href: '/collection', emoji: '🎁', title: 'COMBO 2 TẶNG 1', sub: 'Tiết kiệm 33%', badge: 'sale' },
    { href: '/collection', emoji: '🏷️', title: 'FLASH SALE', sub: 'Giảm tới 50%', badge: 'sale' },
  ],
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('sets');

  /* Esc đóng menu */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Khoá body scroll khi menu mở */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <aside
      id="mobile-menu"
      aria-hidden={!isOpen}
      className={[
        'fixed left-0 right-0 w-full z-[90] overflow-y-auto bg-menu',
        'top-[60px] h-[calc(100dvh-60px)]',
        'transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)]',
        isOpen ? 'translate-y-0 visible' : '-translate-y-[110%] invisible',
      ].join(' ')}
    >
      {/* Tabs sticky đầu menu */}
      <div className="sticky top-0 z-[5] flex gap-6 overflow-x-auto border-b border-black/[0.08] bg-menu px-6 py-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
        {TABS.map((t) => {
          const active = t.key === activeTab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={[
                'relative cursor-pointer whitespace-nowrap border-0 bg-transparent px-0 py-2 text-[13px] font-bold uppercase tracking-[1.5px] transition-colors',
                active ? 'text-[#2a2a2a]' : 'text-[#b3aea4]',
                active ? 'after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:bg-[#2a2a2a]' : '',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panel cards */}
      <div className="px-4 pt-[18px] pb-3">
        {PANELS[activeTab].map((c, i) => (
          <Link
            key={`${activeTab}-${i}`}
            href={c.href}
            onClick={onClose}
            className="relative mb-3 grid min-h-[108px] grid-cols-[84px_1fr] items-center gap-3.5 rounded-2xl bg-white p-3 text-[#111] no-underline shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] active:scale-[0.985]"
          >
            <div className="flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-[10px] bg-[#f3f1eb] text-4xl">
              {c.emoji}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 pr-16">
              <h4 className="m-0 text-[15px] font-extrabold uppercase leading-tight tracking-[0.4px] text-[#111] [word-break:break-word]">
                {c.title}
              </h4>
              <p className="m-0 text-[13.5px] font-normal leading-snug text-[#555]">{c.sub}</p>
            </div>
            {c.badge && (
              <span
                className={[
                  'absolute right-2.5 top-2.5 z-[1] whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold lowercase tracking-[0.4px] text-white',
                  c.badgeAlt ? 'bg-[#2a2a2a]' : 'bg-[#4a4a4a]',
                ].join(' ')}
              >
                {c.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* CTA sticky đáy menu */}
      <div className="sticky bottom-0 z-[4] mt-1 px-6 pb-[22px] pt-[18px] bg-gradient-to-b from-menu/0 from-0% to-menu to-[45%]">
        <Link
          href="/collection"
          onClick={onClose}
          className="block rounded-full border-[1.5px] border-[#111] bg-transparent py-3.5 text-center text-xs font-bold uppercase tracking-[1.6px] text-[#111] no-underline transition-colors hover:bg-[#111] hover:text-white"
        >
          XEM TẤT CẢ
        </Link>
      </div>
    </aside>
  );
}
