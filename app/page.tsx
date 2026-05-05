export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-60px)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 text-xs uppercase tracking-widest text-text-muted">
        Phase 1 · Layout chung · Step 1.1 ✓
      </p>
      <h2 className="font-serif text-5xl leading-tight">
        Header & Mobile Menu sẵn sàng
      </h2>
      <p className="mt-6 max-w-md text-sm text-text-muted">
        Thử thu nhỏ cửa sổ &lt; 1024px để thấy hamburger morph + menu Rhode-style
        trượt từ trên xuống.
      </p>
      <ul className="mt-10 flex flex-col gap-2 text-left text-sm text-text-muted">
        <li>· Tab tabs đổi panel sản phẩm</li>
        <li>· Esc / click X để đóng menu</li>
        <li>· Click thẻ sản phẩm → tự đóng menu trước khi điều hướng</li>
      </ul>
    </main>
  );
}
