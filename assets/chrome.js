/* S.O.I shared chrome injector — chỉ dùng cho preview HTML tĩnh */
(function () {
  'use strict';

  var headerHTML = `
    <header class="kb-header">
      <button class="kb-hamburger" data-kb-open-menu aria-label="Menu">☰</button>
      <a href="index.html" class="kb-logo">S<span class="kb-logo__dot">.</span>O<span class="kb-logo__dot">.</span>I</a>
      <nav class="kb-nav">
        <ul>
          <li><a href="collection.html">Mua sắm</a></li>
          <li><a href="collection.html">Trang điểm</a></li>
          <li><a href="collection.html">Chăm sóc da</a></li>
          <li><a href="collection.html">Ưu đãi</a></li>
          <li><a href="#">Thẻ quà tặng</a></li>
          <li><a href="#">Dịch vụ ảo</a></li>
          <li><a href="contact.html">Liên hệ</a></li>
          <li><a href="#">Tiracels</a></li>
          <li><a href="blog.html">Tin tức</a></li>
          <li><a href="#">Phần thưởng</a></li>
        </ul>
      </nav>
      <div class="kb-header__icons">
        <a href="login.html" class="kb-icon" aria-label="Tài khoản">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>
          </svg>
        </a>
        <a href="search.html" class="kb-icon" aria-label="Tìm kiếm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21"/>
          </svg>
        </a>
        <button type="button" class="kb-icon kb-icon--cart" data-kb-open-cart aria-label="Giỏ hàng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <path d="M6 8h12l-1 12H7L6 8z"/>
            <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
          </svg>
          <sup class="kb-cart-count">2</sup>
        </button>
      </div>
    </header>
  `;

  var footerHTML = `
    <footer class="kb-footer">
      <div class="kb-footer__grid">
        <div class="kb-footer__col">
          <div class="kb-logo">S<span class="kb-logo__dot">.</span>O<span class="kb-logo__dot">.</span>I</div>
          <h4>ĐĂNG KÝ — GIẢM 10%</h4>
          <p>Là người đầu tiên biết về BST mới và ưu đãi độc quyền.</p>
          <form onsubmit="event.preventDefault(); alert('Cảm ơn đã đăng ký!');">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <button type="submit" class="kb-join-btn">JOIN</button>
          </form>
        </div>
        <div class="kb-footer__col">
          <h4>DANH MỤC</h4>
          <ul>
            <li><a href="about.html">Về chúng tôi</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
            <li><a href="guide.html">Hướng dẫn</a></li>
            <li><a href="#">Điều khoản</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Giao hàng</a></li>
          </ul>
        </div>
        <div class="kb-footer__col">
          <h4>LIÊN HỆ</h4>
          <p>S.O.I Inc.<br/>Copyright &copy; 2026. Đã đăng ký bản quyền</p>
          <p>Hỗ trợ khách hàng <strong>CHAT TRỰC TUYẾN</strong></p>
          <p><strong>HỆ THỐNG CỬA HÀNG</strong></p>
        </div>
      </div>
    </footer>
  `;

  var cartHTML = `
    <aside id="cart-drawer" class="kb-cart-drawer">
      <div class="kb-cart-drawer__head">
        <h3>GIỎ HÀNG (0)</h3>
        <button type="button" data-kb-close-cart aria-label="Đóng">✕</button>
      </div>
      <div class="kb-cart-drawer__free">
        <span class="kb-free-msg">Thêm 1.250.000₫ để được miễn phí vận chuyển.</span>
        <div class="kb-cart-drawer__progress"><span style="width:0%"></span></div>
      </div>
      <div class="kb-cart-drawer__label">Sản phẩm</div>
      <div class="kb-cart-drawer__subtotal"><span>TẠM TÍNH</span><strong>0₫</strong></div>
      <button type="button" class="kb-btn-primary kb-btn-block kb-btn-checkout" onclick="window.location='checkout.html'">
        <span>THANH TOÁN</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
      </button>
      <p class="kb-cart-drawer__note">Phí ship, thuế và khuyến mãi được tính tại trang thanh toán.</p>
    </aside>
    <div class="kb-cart-overlay" data-kb-close-cart></div>
  `;

  var mobileMenuHTML = `
    <aside id="mobile-menu" class="kb-mobile-menu">
      <div class="kb-mobile-menu__head">
        <div class="kb-logo">S<span class="kb-logo__dot">.</span>O<span class="kb-logo__dot">.</span>I</div>
        <button type="button" data-kb-close-menu>✕</button>
      </div>
      <ul>
        <li><a href="collection.html">Mua sắm</a></li>
        <li><a href="collection.html">Trang điểm</a></li>
        <li><a href="collection.html">Chăm sóc da</a></li>
        <li><a href="collection.html">Ưu đãi</a></li>
        <li><a href="contact.html">Liên hệ</a></li>
        <li><a href="blog.html">Tin tức</a></li>
        <li><a href="login.html">Đăng nhập</a></li>
      </ul>
    </aside>
    <div class="kb-menu-overlay" data-kb-close-menu></div>
  `;

  var fabHTML = `
    <button type="button" class="kb-rewards-btn">🎁 Rewards</button>
    <button type="button" class="kb-fab" aria-label="Chat">💬</button>
  `;

  function inject() {
    var hdr = document.querySelector('[data-kb-header]');
    if (hdr) hdr.outerHTML = headerHTML;
    var ftr = document.querySelector('[data-kb-footer]');
    if (ftr) ftr.outerHTML = footerHTML;
    var drw = document.querySelector('[data-kb-chrome]');
    if (drw) drw.outerHTML = cartHTML + mobileMenuHTML + fabHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
