import Link from 'next/link';

type LogoProps = {
  href?: string;
  className?: string;
  /** kích thước: 'sm' | 'md' (mặc định) | 'lg' */
  size?: 'sm' | 'md' | 'lg';
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
export default function Logo({ href = '/', className = '', size = 'md' }: LogoProps) {
  const inner = (
    <span className={`font-serif font-bold tracking-wider text-[#111] leading-none ${sizeClass[size]} ${className}`}>
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
