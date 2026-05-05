'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function NewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');
    /* TODO Phase 4: gửi lên Supabase table `subscribers` */
    await new Promise((r) => setTimeout(r, 600));
    setStatus('success');
    setName('');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3500);
  }

  const disabled = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Họ tên"
        required
        disabled={disabled}
        className="border-b border-white/30 bg-transparent py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white disabled:opacity-50"
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        disabled={disabled}
        className="border-b border-white/30 bg-transparent py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="mt-2 self-start bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
      >
        {status === 'submitting' ? 'Đang gửi…' : 'JOIN'}
      </button>
      {status === 'success' && (
        <p className="text-xs text-green-300">Cảm ơn đã đăng ký!</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-300">Có lỗi xảy ra, thử lại.</p>
      )}
    </form>
  );
}
