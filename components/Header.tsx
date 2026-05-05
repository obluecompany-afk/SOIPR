'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

const NAV = [
  { href: '/collection', label: 'Mua sắm' },
  { href: '/collection', label: 'Trang điểm' },
  { href: '/collection', label: 'Chăm sóc da' },
  { href: '/collection', label: 'Ưu đãi' },
  { href: '/gift-card', label: 'Thẻ quà tặng' },
  { href: '/contact', label: 'Liên hệ' },
  { href: '/blog', label: 'Tin tức' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={[
          'sticky top-0 z-[100] flex items-center justify-between gap-5 border-b transition-colors duration-300',
          'px-4 py-3 lg:px-[30px] lg:py-[14px]',
          isMenuOpen ? 'border-transparent bg-menu' : 'border-[#EAEAEA] bg-white',
        ].join(' ')}
      >
        {/* Hamburger (mobile only) */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Đóng menu' : 'Menu'}
          className="relative z-[210] block h-8 w-8 cursor-pointer border-0 bg-transparent p-0 lg:hidden"
        >
          <span
            className={[
              'absolute left-1.5 right-1.5 h-[1.6px] rounded bg-[#111] transition-all duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]',
              isMenuOpen ? 'top-[15px] opacity-0' : 'top-[9px] opacity-100',
            ].join(' ')}
          />
          <span className="absolute left-1.5 right-1.5 top-[15px] h-[1.6px] rounded bg-[#111] transition-all duration-[450ms]" />
          <span
            className={[
              'absolute left-1.5 right-1.5 h-[1.6px] rounded bg-[#111] transition-all duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]',
              isMenuOpen ? 'top-[15px] opacity-0' : 'top-[21px] opacity-100',
            ].join(' ')}
          />
        </button>

        <Logo href="/" className="ml-0 lg:ml-10" />

        {/* Nav desktop */}
        <nav className="hidden flex-1 lg:block">
          <ul className="flex justify-center gap-5 xl:gap-[14px]">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[10px] font-medium uppercase tracking-wider text-[#1A1A1A] transition-colors hover:text-primary xl:text-[11px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            aria-label="Tài khoản"
            className="hidden p-1.5 text-[#111] transition-colors hover:text-primary lg:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </Link>
          <Link
            href="/search"
            aria-label="Tìm kiếm"
            className="inline-flex p-1.5 text-[#111] transition-colors hover:text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            className="relative inline-flex p-1.5 text-[#111] transition-colors hover:text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden>
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </Link>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
