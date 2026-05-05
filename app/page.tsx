export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="font-serif text-6xl tracking-wide">
        S<span className="text-primary">.</span>O
        <span className="text-primary">.</span>I
      </h1>
      <p className="mt-4 text-sm tracking-widest text-text-muted uppercase">
        Welcome — Next.js skeleton ready
      </p>
      <div className="mt-8 flex flex-col gap-2 text-sm text-text-muted">
        <p>Phase 0 · Foundation · Step 0.1 ✓</p>
        <p>Stack: Next.js 16 · TypeScript · Tailwind · Supabase (sắp tới)</p>
      </div>
    </main>
  );
}
