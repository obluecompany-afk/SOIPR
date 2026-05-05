import Link from 'next/link';

type LogoProps = {
  href?: string;
  className?: string;
  /** kích thước: 'sm' | 'md' (mặc định) | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** màu chữ chính — mặc định đen #111, footer dùng 'text-white' */
  textClass?: string;
};

const sizeClass = {
  sm: 'text-lg',
  md: 'text-3xl',
  lg: 'text-5xl',
};

/**
 * Logo S.O.I — Times New Roman, dấu chấm đỏ #C8102E giữa các chữ.
 * Dùng cho header, footer, mobile menu.
 */
export default function Logo({
  href = '/',
  className = '',
  size = 'md',
  textClass = 'text-[#111]',
}: LogoProps) {
  const inner = (
    <span
      className={`font-serif font-bold tracking-wider leading-none ${sizeClass[size]} ${textClass} ${className}`}
    >
      S<span className="text-primary">.</span>O<span className="text-primary">.</span>I
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="flex-shrink-0 transition-opacity hover:opacity-85" aria-label="S.O.I">
      {inner}
    </Link>
  );
}
