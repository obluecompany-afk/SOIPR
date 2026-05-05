export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-4 text-xs uppercase tracking-widest text-text-muted">
        Phase 1 · Layout chung · Step 1.2 ✓
      </p>
      <h2 className="font-serif text-5xl leading-tight">
        Header · Mobile Menu · Footer sẵn sàng
      </h2>
      <p className="mt-6 max-w-md mx-auto text-sm text-text-muted">
        Thử thu nhỏ cửa sổ &lt; 1024px để xem mobile menu Rhode-style. Cuộn xuống
        cuối để thấy footer 3 cột.
      </p>
      <ul className="mt-10 flex flex-col gap-2 text-left text-sm text-text-muted">
        <li>· Hamburger morph 3 vạch ↔ 1 vạch khi mở menu</li>
        <li>· Tab tabs đổi panel sản phẩm</li>
        <li>· Esc / click X để đóng menu</li>
        <li>· Footer dark, form đăng ký newsletter (placeholder)</li>
      </ul>
    </main>
  );
}
