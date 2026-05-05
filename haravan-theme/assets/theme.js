/* S.O.I — Haravan theme JS
   Quản lý: mobile menu, cart drawer, header sticky, animations toggle
   KHÔNG quản lý cart state (do Haravan native handle qua /cart/add, /cart/change)
*/
(function () {
  'use strict';

  var body = document.body;

  /* ===== Helpers ===== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ===== Sync header height var (cho mobile menu top:var(--kb-header-h)) ===== */
  function syncHeaderHeight() {
    var h = $('.kb-header');
    if (!h) return;
    document.documentElement.style.setProperty('--kb-header-h', h.offsetHeight + 'px');
  }
  syncHeaderHeight();
  window.addEventListener('load', syncHeaderHeight);
  window.addEventListener('resize', syncHeaderHeight);

  /* ===== Body lock (chia sẻ giữa cart drawer + mobile menu) ===== */
  function isAnyDrawerOpen() {
    return body.classList.contains('kb-mm-open') || body.classList.contains('kb-cart-open');
  }
  function syncBodyLock() {
    if (isAnyDrawerOpen()) body.classList.add('kb-drawer-lock');
    else body.classList.remove('kb-drawer-lock');
  }

  /* ===== Mobile menu (Rhode-style) ===== */
  function openMenu() {
    closeCart();
    body.classList.add('kb-mm-open');
    var btn = $('.kb-hamburger'); if (btn) {
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Đóng menu');
    }
    syncHeaderHeight();
    syncBodyLock();
  }
  function closeMenu() {
    body.classList.remove('kb-mm-open');
    var btn = $('.kb-hamburger'); if (btn) {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Menu');
    }
    syncBodyLock();
  }
  function toggleMenu() {
    if (body.classList.contains('kb-mm-open')) closeMenu();
    else openMenu();
  }

  /* ===== Cart drawer ===== */
  function openCart() {
    closeMenu();
    body.classList.add('kb-cart-open');
    syncBodyLock();
  }
  function closeCart() {
    body.classList.remove('kb-cart-open');
    syncBodyLock();
  }

  /* ===== Mobile menu tab switch ===== */
  function switchTab(key) {
    $$('.kb-mm-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-mm-tab') === key);
    });
    $$('[data-mm-panel]').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-mm-panel') === key);
    });
  }

  /* ===== Delegated click handlers ===== */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-kb-toggle-menu]'))) { e.preventDefault(); toggleMenu(); return; }
    if ((t = e.target.closest('[data-kb-open-menu]')))  { e.preventDefault(); openMenu(); return; }
    if ((t = e.target.closest('[data-kb-close-menu]'))) { e.preventDefault(); closeMenu(); return; }
    if ((t = e.target.closest('[data-kb-open-cart]')))  { e.preventDefault(); openCart(); return; }
    if ((t = e.target.closest('[data-kb-close-cart]'))) { e.preventDefault(); closeCart(); return; }
    if ((t = e.target.closest('[data-mm-tab]'))) {
      e.preventDefault();
      switchTab(t.getAttribute('data-mm-tab'));
      return;
    }
    /* Click link bên trong menu → đóng menu trước khi điều hướng */
    if (e.target.closest('#mobile-menu a')) closeMenu();
  });

  /* ===== Esc đóng drawer/menu ===== */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (body.classList.contains('kb-mm-open')) closeMenu();
    if (body.classList.contains('kb-cart-open')) closeCart();
  });

  /* ===== Free-ship progress bar (Haravan: window.theme_cart_total inject từ Liquid) ===== */
  function syncFreeShip() {
    var threshold = parseFloat(body.getAttribute('data-free-ship-threshold') || '1250000') || 1250000;
    var total = parseFloat(body.getAttribute('data-cart-total') || '0') || 0;
    var pct = Math.min(100, (total / threshold) * 100);
    var bar = $('[data-free-ship-bar]');
    if (bar) bar.style.width = pct + '%';
    var msg = $('[data-free-ship-msg]');
    if (msg) {
      var remaining = Math.max(0, threshold - total);
      if (remaining === 0) {
        msg.textContent = '✓ Đơn hàng đã đủ điều kiện miễn phí vận chuyển';
      } else {
        msg.textContent = 'Thêm ' + remaining.toLocaleString('vi-VN') + '₫ để được miễn phí vận chuyển';
      }
    }
  }
  syncFreeShip();
  window.addEventListener('load', syncFreeShip);

  /* ===== Qty selector +/- (button-span-button + hidden input) ===== */
  function setupQty(scope) {
    $$('[data-qty]', scope || document).forEach(function (qty) {
      var display = qty.querySelector('[data-qty-display]');
      var input = qty.querySelector('[data-qty-input]');
      var minus = qty.querySelector('[data-qty-minus]');
      var plus = qty.querySelector('[data-qty-plus]');
      if (!display || !input || qty.dataset.qtyReady === '1') return;
      qty.dataset.qtyReady = '1';
      function set(val) {
        var v = Math.max(1, parseInt(val, 10) || 1);
        display.textContent = v;
        input.value = v;
      }
      if (minus) minus.addEventListener('click', function () { set(parseInt(input.value, 10) - 1); });
      if (plus)  plus.addEventListener('click',  function () { set(parseInt(input.value, 10) + 1); });
    });
  }
  setupQty();
  document.addEventListener('DOMContentLoaded', function () { setupQty(); });

  /* ===== Product thumb gallery — click thumb đổi main image ===== */
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('[data-thumb-src]');
    if (!thumb) return;
    var src = thumb.getAttribute('data-thumb-src');
    var mainImg = $('[data-main-image]');
    if (mainImg && src) mainImg.src = src;
    $$('.kb-thumb').forEach(function (t) { t.classList.toggle('active', t === thumb); });
  });

  /* ===== Variant shade selector — click chấm tròn đổi variant ===== */
  document.addEventListener('click', function (e) {
    var shade = e.target.closest('.kb-shade[data-variant-id]');
    if (!shade) return;
    e.preventDefault();
    if (shade.disabled) return;
    var grid = shade.parentElement;
    grid.querySelectorAll('.kb-shade').forEach(function (s) { s.classList.remove('selected'); });
    shade.classList.add('selected');
    var input = document.querySelector('[data-variant-input]');
    if (input) input.value = shade.getAttribute('data-variant-id');
    var label = document.querySelector('[data-selected-variant]');
    if (label) label.textContent = shade.getAttribute('data-variant-title');
  });

  /* ===== Accordion toggle (mô tả, vận chuyển, thành phần...) ===== */
  document.addEventListener('click', function (e) {
    var head = e.target.closest('.kb-accordion__head');
    if (!head) return;
    var item = head.parentElement;
    var body = item.querySelector('.kb-accordion__body');
    var sign = head.querySelector('span');
    var open = item.classList.toggle('open');
    if (body) body.hidden = !open;
    if (sign) sign.textContent = open ? '−' : '+';
  });

  /* ===== Auto add body class khi có sticky CTA (cho padding-bottom) ===== */
  if ($('.kb-sticky-cta')) body.classList.add('kb-has-sticky-cta');

  /* ===== Variant select dropdown change → cập nhật price + label ===== */
  document.addEventListener('change', function (e) {
    var sel = e.target.closest('.kb-variant-select');
    if (!sel) return;
    var label = document.querySelector('[data-selected-variant]');
    if (label) label.textContent = sel.options[sel.selectedIndex].text.split('—')[0].trim();
  });

  /* Expose cho debug */
  window.kbTheme = { openMenu: openMenu, closeMenu: closeMenu, openCart: openCart, closeCart: closeCart, setupQty: setupQty };
})();
