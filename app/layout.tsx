import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'S.O.I — K-Beauty',
  description: 'S.O.I — Skincare & Beauty store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
