import Link from 'next/link';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';

const MENU_LINKS = [
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/contact', label: 'Liên hệ' },
  { href: '/guide', label: 'Hướng dẫn' },
  { href: '/terms', label: 'Điều khoản' },
  { href: '/privacy', label: 'Chính sách bảo mật' },
  { href: '/shipping', label: 'Giao hàng' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1A1A1A] px-6 py-16 text-white lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-12">
        {/* Cột 1 — Newsletter */}
        <div>
          <Logo href="/" textClass="text-white" className="mb-6 inline-block" />
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
            Đăng ký — giảm 10%
          </h4>
          <p className="text-sm leading-relaxed text-white/70">
            Là người đầu tiên biết về BST mới và ưu đãi độc quyền.
          </p>
          <NewsletterForm />
        </div>

        {/* Cột 2 — Danh mục */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
            Danh mục
          </h4>
          <ul className="flex flex-col gap-3">
            {MENU_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 — Liên hệ */}
        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
            Liên hệ
          </h4>
          <p className="text-sm leading-relaxed text-white/70">
            S.O.I Inc.
            <br />
            Copyright © {year}. Đã đăng ký bản quyền.
          </p>
          <p className="mt-4 text-sm text-white/70">
            Hỗ trợ khách hàng:{' '}
            <strong className="font-semibold text-white">CHAT TRỰC TUYẾN</strong>
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white">
            Hệ thống cửa hàng
          </p>
          <ul className="mt-3 flex gap-5 text-xs uppercase tracking-[0.15em] text-white/60">
            <li>
              <Link href="#" className="transition-colors hover:text-white">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-white">
                TikTok
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-white">
                YouTube
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
