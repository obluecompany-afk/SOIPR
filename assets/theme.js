// S.O.I Theme JS
(function () {
  'use strict';

  var body = document.body;

  /* ===== CART MODULE — state persist trong localStorage ===== */
  var CART_KEY = 'kb-cart';
  // Đọc ngưỡng free-ship từ body[data-free-ship-threshold] (set bởi Sapo từ settings)
  // Đơn vị VND, mặc định 1.250.000₫
  var FREE_SHIP_THRESHOLD = parseFloat(
    (document.body && document.body.getAttribute('data-free-ship-threshold')) || '1250000'
  ) || 1250000;
  // IS_SAPO = true khi chạy trên Sapo production (cart do server render)
  // false = preview HTML tĩnh (dùng localStorage)
  var IS_SAPO = document.body && document.body.hasAttribute('data-sapo');

  function cartGet() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function cartSet(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
    cartRender();
  }
  function cartAdd(item) {
    var items = cartGet();
    var key = item.id + '::' + (item.variant || '');
    var existing = items.find(function (x) { return (x.id + '::' + (x.variant || '')) === key; });
    if (existing) existing.quantity += item.quantity;
    else items.push(item);
    cartSet(items);
  }
  function cartUpdateQty(id, variant, newQty) {
    var items = cartGet();
    var key = id + '::' + (variant || '');
    items = items.map(function (x) {
      if ((x.id + '::' + (x.variant || '')) === key) x.quantity = Math.max(1, newQty);
      return x;
    });
    cartSet(items);
  }
  function cartRemove(id, variant) {
    var key = id + '::' + (variant || '');
    cartSet(cartGet().filter(function (x) { return (x.id + '::' + (x.variant || '')) !== key; }));
  }
  function cartClear() { cartSet([]); }
  function cartTotals() {
    var items = cartGet();
    var subtotal = items.reduce(function (s, x) { return s + x.price * x.quantity; }, 0);
    var count = items.reduce(function (s, x) { return s + x.quantity; }, 0);
    return { items: items, subtotal: subtotal, count: count };
  }
  window.kbCart = {
    get: cartGet, add: cartAdd, update: cartUpdateQty,
    remove: cartRemove, clear: cartClear, totals: cartTotals,
  };

  function formatMoney(n) {
    // VND: 625000 → "625.000₫"
    return Math.round(n).toLocaleString('vi-VN') + '₫';
  }

  function cartItemHTML(it) {
    var line = it.price * it.quantity;
    var unitPrice = it.quantity > 1 ? '<span class="kb-cart-item__unit">' + formatMoney(it.price) + ' ×' + it.quantity + '</span>' : '';
    return '<div class="kb-cart-item" data-cart-id="' + it.id + '" data-cart-variant="' + (it.variant || '') + '">' +
      '<div class="kb-cart-item__img">' + (it.image || '🛍️') + '</div>' +
      '<div class="kb-cart-item__info">' +
        '<div class="kb-cart-item__top">' +
          '<div class="kb-cart-item__name">' + it.name + '</div>' +
          '<button type="button" class="kb-cart-item__remove" data-cart-remove aria-label="Xoá sản phẩm" title="Xoá">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">' +
              '<path d="M3 6h18"/>' +
              '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
              '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' +
              '<line x1="10" y1="11" x2="10" y2="17"/>' +
              '<line x1="14" y1="11" x2="14" y2="17"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        (it.variant ? '<div class="kb-cart-item__variant">' + it.variant + '</div>' : '') +
        '<div class="kb-cart-item__bottom">' +
          '<div class="kb-qty kb-qty--sm">' +
            '<button type="button" data-cart-qty="-1" aria-label="Giảm">−</button>' +
            '<span>' + it.quantity + '</span>' +
            '<button type="button" data-cart-qty="+1" aria-label="Tăng">+</button>' +
          '</div>' +
          '<div class="kb-cart-item__price">' +
            unitPrice +
            '<strong>' + formatMoney(line) + '</strong>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function cartRender() {
    // Trên Sapo production: cart được server render, KHÔNG re-render từ localStorage
    // (tránh xoá mất items mà Sapo đã render)
    if (IS_SAPO) {
      // Chỉ update cart-count badge từ dataset nếu Sapo set sẵn
      return;
    }
    var t = cartTotals();
    // ---- Render cart drawer ----
    var drawer = document.getElementById('cart-drawer');
    if (drawer) {
      var title = drawer.querySelector('.kb-cart-drawer__head h3');
      if (title) title.textContent = 'GIỎ HÀNG (' + t.count + ')';

      var listContainer = drawer.querySelector('[data-cart-list]') || drawer.querySelector('.kb-cart-drawer__label');
      // Clear old items
      drawer.querySelectorAll('.kb-cart-item').forEach(function (el) { el.remove(); });
      // Remove old empty notice
      drawer.querySelectorAll('.kb-cart-empty').forEach(function (el) { el.remove(); });

      if (t.items.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'kb-cart-empty';
        empty.style.cssText = 'padding:40px 0;text-align:center;color:#888;';
        empty.textContent = 'Giỏ hàng trống';
        var label = drawer.querySelector('.kb-cart-drawer__label');
        if (label) label.style.display = 'none';
        var subt = drawer.querySelector('.kb-cart-drawer__subtotal');
        if (subt) subt.style.display = 'none';
        var checkout = drawer.querySelector('.kb-btn-primary.kb-btn-block');
        if (checkout) checkout.style.display = 'none';
        var note = drawer.querySelector('.kb-cart-drawer__note');
        if (note) note.style.display = 'none';
        var free = drawer.querySelector('.kb-cart-drawer__free');
        if (free) free.style.display = 'none';
        if (label && label.parentNode) label.parentNode.insertBefore(empty, label);
        else drawer.appendChild(empty);
      } else {
        // Show normal elements
        ['.kb-cart-drawer__label', '.kb-cart-drawer__subtotal', '.kb-cart-drawer__note', '.kb-cart-drawer__free'].forEach(function (sel) {
          var el = drawer.querySelector(sel); if (el) el.style.display = '';
        });
        var checkout2 = drawer.querySelector('.kb-btn-primary.kb-btn-block');
        if (checkout2) checkout2.style.display = '';

        // Insert items after label
        var label2 = drawer.querySelector('.kb-cart-drawer__label');
        var anchor = label2 || drawer.querySelector('.kb-cart-drawer__free');
        var html = t.items.map(cartItemHTML).join('');
        if (anchor) anchor.insertAdjacentHTML('afterend', html);

        // Update free shipping bar
        var freeBar = drawer.querySelector('.kb-cart-drawer__free');
        if (freeBar) {
          var msgEl = freeBar.querySelector('.kb-free-msg');
          var progEl = freeBar.querySelector('.kb-cart-drawer__progress span');
          var remaining = FREE_SHIP_THRESHOLD - t.subtotal;
          if (remaining <= 0) {
            if (msgEl) msgEl.textContent = 'Chúc mừng! Đơn hàng của bạn được miễn phí vận chuyển.';
            if (progEl) progEl.style.width = '100%';
          } else {
            if (msgEl) msgEl.textContent = 'Thêm ' + formatMoney(remaining) + ' để được miễn phí vận chuyển.';
            if (progEl) progEl.style.width = Math.min(100, (t.subtotal / FREE_SHIP_THRESHOLD) * 100) + '%';
          }
        }

        // Update subtotal
        drawer.querySelectorAll('.kb-cart-drawer__subtotal strong').forEach(function (el) {
          el.textContent = formatMoney(t.subtotal);
        });
      }
    }

    // ---- Render cart page nếu đang ở cart.html ----
    var cartPage = document.querySelector('[data-cart-page]');
    if (cartPage) {
      var pageTitle = cartPage.querySelector('.kb-section-title');
      if (pageTitle) pageTitle.textContent = 'GIỎ HÀNG (' + t.count + ')';
      var pageList = cartPage.querySelector('[data-cart-list]');
      if (pageList) {
        if (t.items.length === 0) {
          pageList.innerHTML = '<p style="text-align:center;padding:60px 0;color:#888;">' +
            'Giỏ hàng của bạn đang trống.<br/><a href="collection.html" style="color:var(--color-primary);">Tiếp tục mua sắm →</a></p>';
          var subtRow = cartPage.querySelector('.kb-cart-drawer__subtotal');
          if (subtRow) subtRow.style.display = 'none';
          var chkBtn = cartPage.querySelector('[data-kb-checkout]');
          if (chkBtn) chkBtn.style.display = 'none';
        } else {
          pageList.innerHTML = t.items.map(cartItemHTML).join('');
          cartPage.querySelectorAll('.kb-cart-drawer__subtotal').forEach(function (r) { r.style.display = ''; });
          var chk = cartPage.querySelector('[data-kb-checkout]');
          if (chk) chk.style.display = '';
          cartPage.querySelectorAll('.kb-cart-drawer__subtotal strong').forEach(function (el) {
            el.textContent = formatMoney(t.subtotal);
          });
        }
      }
    }

    // ---- Cart count badge ở header ----
    document.querySelectorAll('.kb-cart-count').forEach(function (el) {
      el.textContent = t.count;
      el.style.display = t.count > 0 ? '' : 'none';
    });
  }

  // Render lần đầu khi load
  if (document.readyState !== 'loading') cartRender();
  else document.addEventListener('DOMContentLoaded', cartRender);

  // Cart item qty +/-
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cart-qty]');
    if (!btn) return;
    var item = btn.closest('[data-cart-id]');
    if (!item) return;
    var delta = parseInt(btn.getAttribute('data-cart-qty'), 10);
    var id = item.getAttribute('data-cart-id');
    var variant = item.getAttribute('data-cart-variant');
    var items = cartGet();
    var line = items.find(function (x) { return (x.id + '::' + (x.variant || '')) === (id + '::' + variant); });
    if (!line) return;
    cartUpdateQty(id, variant, line.quantity + delta);
  });

  // Cart item remove
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cart-remove]');
    if (!btn) return;
    var item = btn.closest('[data-cart-id]');
    if (!item) return;
    if (!confirm('Xoá sản phẩm này khỏi giỏ?')) return;
    cartRemove(item.getAttribute('data-cart-id'), item.getAttribute('data-cart-variant'));
    showToast('Đã xoá khỏi giỏ');
  });

  /* ---- Drawer state — chỉ unlock body khi không còn drawer nào mở ---- */
  function anyDrawerOpen() {
    var d = document.getElementById('cart-drawer');
    var m = document.getElementById('mobile-menu');
    return (d && d.classList.contains('open')) || (m && m.classList.contains('open'));
  }
  function syncBodyLock() {
    if (anyDrawerOpen()) body.classList.add('kb-drawer-open');
    else body.classList.remove('kb-drawer-open');
  }

  /* ---- Cart drawer ---- */
  function openCart() {
    closeMenu(); // không cho phép 2 drawer cùng mở
    var d = document.getElementById('cart-drawer');
    var o = document.querySelector('.kb-cart-overlay');
    if (d) d.classList.add('open');
    if (o) o.classList.add('open');
    syncBodyLock();
  }
  function closeCart() {
    var d = document.getElementById('cart-drawer');
    var o = document.querySelector('.kb-cart-overlay');
    if (d) d.classList.remove('open');
    if (o) o.classList.remove('open');
    syncBodyLock();
  }
  window.kbOpenCart = openCart;
  window.kbCloseCart = closeCart;

  /* ---- Mobile menu (Rhode-style top-down) ---- */
  function syncHamburger(isOpen) {
    var btn = document.querySelector('.kb-hamburger');
    if (!btn) return;
    btn.classList.toggle('is-open', !!isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Menu');
  }
  function openMenu() {
    closeCart();
    var m = document.getElementById('mobile-menu');
    if (m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); }
    syncHamburger(true);
    syncBodyLock();
  }
  function closeMenu() {
    var m = document.getElementById('mobile-menu');
    if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
    syncHamburger(false);
    syncBodyLock();
  }
  function toggleMenu() {
    var m = document.getElementById('mobile-menu');
    if (m && m.classList.contains('open')) closeMenu(); else openMenu();
  }

  /* ---- Delegated click handlers ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kb-open-cart]');
    if (t) { e.preventDefault(); openCart(); return; }
    t = e.target.closest('[data-kb-close-cart]');
    if (t) { e.preventDefault(); closeCart(); return; }
    t = e.target.closest('[data-kb-toggle-menu]');
    if (t) { e.preventDefault(); toggleMenu(); return; }
    t = e.target.closest('[data-kb-open-menu]');
    if (t) { e.preventDefault(); openMenu(); return; }
    t = e.target.closest('[data-kb-close-menu]');
    if (t) { e.preventDefault(); closeMenu(); return; }
    /* tap link bên trong menu => đóng menu trước khi điều hướng */
    var lnk = e.target.closest('#mobile-menu a');
    if (lnk) { closeMenu(); }
  });

  /* Esc đóng menu */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Accordion toggle ---- */
  document.addEventListener('click', function (e) {
    var head = e.target.closest('.kb-accordion__head');
    if (!head) return;
    var item = head.parentElement;
    var isOpen = item.classList.toggle('open');
    var body = item.querySelector('.kb-accordion__body');
    var sign = head.querySelector('span');
    if (body) body.hidden = !isOpen;
    if (sign) sign.textContent = isOpen ? '—' : '+';
  });

  /* ---- Qty steppers cho form product (không phải cart) ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.kb-qty button');
    if (!btn) return;
    // Nếu là qty trong cart item → đã xử lý bởi data-cart-qty
    if (btn.hasAttribute('data-cart-qty')) return;
    var wrap = btn.parentElement;
    var span = wrap.querySelector('span');
    if (!span) return;
    var v = parseInt(span.textContent, 10) || 1;
    v = btn.textContent.trim() === '+' ? v + 1 : Math.max(1, v - 1);
    span.textContent = v;
    var hidden = wrap.querySelector('input[type="hidden"][name="quantity"]');
    if (hidden) hidden.value = v;
  });

  /* ---- Shade swatch select (product page) ---- */
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('.kb-shade');
    if (!sw) return;
    var grid = sw.closest('.kb-shade-grid');
    if (!grid) return;
    grid.querySelectorAll('.kb-shade.selected').forEach(function (s) { s.classList.remove('selected'); });
    sw.classList.add('selected');
    // Sync variant label if present
    var label = document.querySelector('[data-selected-variant]');
    var wrap = sw.closest('.kb-shade-wrap');
    var input = wrap ? wrap.querySelector('input[type="radio"]') : null;
    if (input) input.checked = true;
    if (label && sw.title) label.textContent = sw.title;
  });

  /* ---- Thumb click (product page) — đổi active + swap main image ---- */
  document.addEventListener('click', function (e) {
    var th = e.target.closest('.kb-thumb');
    if (!th) return;
    // Toggle active
    th.parentElement.querySelectorAll('.kb-thumb.active').forEach(function (t) { t.classList.remove('active'); });
    th.classList.add('active');

    // Tìm main image container gần nhất (cùng gallery)
    var gallery = th.closest('.kb-product__gallery');
    if (!gallery) return;
    var main = gallery.querySelector('.kb-product__main-image');
    if (!main) return;

    // Fade transition
    main.style.transition = 'opacity 0.15s';
    main.style.opacity = '0';

    setTimeout(function () {
      // Nếu thumb có <img>, clone nó vào main
      var thumbImg = th.querySelector('img');
      if (thumbImg) {
        main.innerHTML = '<img src="' + thumbImg.src + '" alt="' + (thumbImg.alt || '') + '" />';
      } else {
        // Nếu chỉ có emoji/text, copy phóng to sang main
        var content = th.innerHTML.trim();
        main.innerHTML = '<div class="kb-emoji-huge">' + content + '</div>';
      }
      main.style.opacity = '1';
    }, 150);
  });

  /* ---- ADD TO CART — lấy variant + qty đang chọn trên product page ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-kb-add-to-cart]');
    if (!btn) return;
    e.preventDefault();

    // Lấy qty hiện tại từ .kb-product__buy .kb-qty
    var qtyEl = document.querySelector('.kb-product__buy .kb-qty span');
    var qty = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    if (IS_SAPO) {
      // Sapo mode: POST form đến /cart/add (Sapo handles) rồi redirect /cart hoặc ajax
      var form = document.querySelector('.kb-product-form') || document.querySelector('form[action="/cart/add"]');
      if (form) {
        // Sync qty into form
        var qtyInput = form.querySelector('input[name="quantity"]');
        if (qtyInput) qtyInput.value = qty;
        form.submit();
        return;
      }
      // Fallback: manual POST
      var fd = new FormData();
      var variantRadio = document.querySelector('input[name="id"]:checked');
      fd.append('id', variantRadio ? variantRadio.value : (btn.getAttribute('data-variant-id') || btn.getAttribute('data-product-id')));
      fd.append('quantity', qty);
      fetch('/cart/add.js', { method: 'POST', body: fd })
        .then(function () { showToast('Đã thêm vào giỏ'); window.location = '/cart'; })
        .catch(function () { window.location = '/cart'; });
      return;
    }

    // Preview mode: lưu localStorage
    var variantEl = document.querySelector('[data-selected-variant]');
    var variant = variantEl ? variantEl.textContent.trim() : '';
    var item = {
      id: btn.getAttribute('data-product-id'),
      name: btn.getAttribute('data-product-name'),
      price: parseFloat(btn.getAttribute('data-product-price')) || 0,
      image: btn.getAttribute('data-product-image') || '',
      variant: variant,
      quantity: qty,
    };
    cartAdd(item);
    showToast('Đã thêm "' + item.name + '" vào giỏ');
    setTimeout(function () {
      if (window.kbOpenCart) window.kbOpenCart();
    }, 400);
  });

  /* ---- Toast helper ---- */
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'kb-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 2400);
  }
  window.kbToast = showToast;

  /* ---- Tool buttons (FIND MY SHADE / TRY IT ON) ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kb-tool]');
    if (!t) return;
    var kind = t.getAttribute('data-kb-tool');
    if (kind === 'find-shade') showToast('Tính năng Find My Shade sắp ra mắt');
    else if (kind === 'try-on') showToast('Tính năng Try It On sắp ra mắt');
  });

  /* ---- Quick add to cart (carousel + pair-with +) ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-kb-quick-add]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();  // ngăn <a> parent navigate sang product

    // Tìm container cha chứa data product (kb-carousel-item hoặc kb-pair-card)
    var host = btn.closest('[data-product-id]') || btn.closest('.kb-carousel-item') || btn.closest('.kb-pair-card');

    if (IS_SAPO) {
      // Sapo mode: POST /cart/add.js với variant_id đầu tiên
      var variantId = host ? (host.getAttribute('data-variant-id') || host.getAttribute('data-product-id')) : null;
      if (!variantId) { showToast('Không tìm thấy sản phẩm'); return; }
      var fd = new FormData();
      fd.append('id', variantId);
      fd.append('quantity', 1);
      fetch('/cart/add.js', { method: 'POST', body: fd })
        .then(function (r) { return r.json(); })
        .then(function () {
          showToast('Đã thêm vào giỏ');
          document.querySelectorAll('.kb-cart-count').forEach(function (el) {
            var n = parseInt(el.textContent, 10) || 0;
            el.textContent = n + 1;
          });
        })
        .catch(function () { window.location = '/cart'; });
      return;
    }
    var id = host ? host.getAttribute('data-product-id') : null;
    var name = host ? host.getAttribute('data-product-name') : null;
    var price = host ? parseFloat(host.getAttribute('data-product-price')) : null;
    var image = host ? host.getAttribute('data-product-image') : '';

    // Fallback nếu host không có data-* → đọc từ element con
    if (!id || !name) {
      var nameEl = host && (host.querySelector('.kb-product-mini__name') || host.querySelector('.kb-pair-card__name'));
      var priceEl = host && (host.querySelector('.kb-product-mini__price') || host.querySelector('.kb-pair-card__price'));
      if (nameEl) name = nameEl.textContent.trim();
      if (priceEl) {
        // Parse "517.500₫ 575.000₫" → lấy số đầu tiên (bỏ dấu chấm)
        var m = priceEl.textContent.match(/([0-9.]+)₫/);
        if (m) price = parseFloat(m[1].replace(/\./g, ''));
      }
      id = id || (name || 'quick-add').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (!name || price == null || isNaN(price)) {
      showToast('Không thể thêm sản phẩm');
      return;
    }

    cartAdd({ id: id, name: name, price: price, image: image, variant: '', quantity: 1 });
    showToast('Đã thêm "' + name + '" vào giỏ');
  });

  /* ---- Prevent href="#" scroll-to-top ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#"]');
    if (!a) return;
    // Nếu có data-attr xử lý khác thì không chặn
    if (a.hasAttribute('data-kb-open-cart') || a.hasAttribute('data-kb-close-cart')
        || a.hasAttribute('data-kb-open-menu') || a.hasAttribute('data-kb-close-menu')) return;
    e.preventDefault();
  });

  /* ---- Esc closes drawers ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeCart(); closeMenu(); }
  });

  /* ---- Mark body if sticky CTA present ---- */
  if (document.querySelector('.kb-sticky-cta')) {
    body.classList.add('kb-has-sticky-cta');
  }

  /* ---- Wishlist toggle (localStorage) ---- */
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('kb-wishlist') || '[]'); }
    catch (e) { return []; }
  }
  function setWishlist(arr) {
    try { localStorage.setItem('kb-wishlist', JSON.stringify(arr)); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-kb-favorite]');
    if (!btn) return;
    e.preventDefault();
    var id = btn.getAttribute('data-product-id');
    var list = getWishlist();
    var i = list.indexOf(id);
    if (i > -1) {
      list.splice(i, 1);
      setFavoriteVisual(btn, false);
      showToast('Đã xoá khỏi yêu thích');
    } else {
      list.push(id);
      setFavoriteVisual(btn, true);
      showToast('Đã thêm vào yêu thích');
    }
    setWishlist(list);
  });
  function setFavoriteVisual(btn, active) {
    var icon = btn.querySelector('.kb-favorite__icon');
    var lbl = btn.querySelector('.kb-favorite__label');
    if (active) {
      btn.classList.add('is-active');
      if (icon) icon.textContent = '♥';
      if (lbl) lbl.textContent = 'Đã yêu thích';
    } else {
      btn.classList.remove('is-active');
      if (icon) icon.textContent = '♡';
      if (lbl) lbl.textContent = 'Thêm vào yêu thích';
    }
  }
  if (document.readyState !== 'loading') initWishlist();
  else document.addEventListener('DOMContentLoaded', initWishlist);
  function initWishlist() {
    var list = getWishlist();
    document.querySelectorAll('[data-kb-favorite]').forEach(function (btn) {
      var id = btn.getAttribute('data-product-id');
      if (list.indexOf(id) > -1) setFavoriteVisual(btn, true);
    });
  }

  /* ---- Video mute/unmute toggle ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-kb-video-mute]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var media = btn.closest('.kb-carousel-media');
    if (!media) return;
    var video = media.querySelector('video');
    if (!video) return;
    // Mute other videos first (single source of sound)
    if (video.muted) {
      document.querySelectorAll('.kb-carousel-media video').forEach(function (v) {
        if (v !== video) {
          v.muted = true;
          var otherBtn = v.parentElement.querySelector('[data-kb-video-mute]');
          if (otherBtn) updateMuteIcon(otherBtn, true);
        }
      });
    }
    video.muted = !video.muted;
    updateMuteIcon(btn, video.muted);
    if (!video.muted) { try { video.play(); } catch (_) {} }
  });
  function updateMuteIcon(btn, muted) {
    var off = btn.querySelector('.kb-video-mute__off');
    var on = btn.querySelector('.kb-video-mute__on');
    if (off) off.hidden = !muted;
    if (on) on.hidden = muted;
  }

  /* ---- Auto-scroll carousel: 1.5s mỗi lần, animation 0.7s ---- */
  function initCarouselAutoScroll() {
    var carousel = document.querySelector('.kb-carousel');
    if (!carousel) return;

    var INTERVAL = 1500;   // 1.5s giữa các lần trượt
    var DURATION = 700;    // 0.7s duration animation
    var paused = false;
    var timer = null;

    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function updateCenterCard() {
      var rect = carousel.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var items = carousel.querySelectorAll('.kb-carousel-item');
      var closest = null, closestDist = Infinity;
      items.forEach(function (it) {
        var r = it.getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - centerX);
        if (d < closestDist) { closestDist = d; closest = it; }
      });
      items.forEach(function (it) {
        var isCenter = (it === closest);
        it.classList.toggle('is-center', isCenter);
        // Center card tự play, card bên cạnh tự pause (trừ khi hover)
        var v = it.querySelector('video');
        if (v && !it.matches(':hover')) {
          if (isCenter) { try { var p = v.play(); if (p && p.catch) p.catch(function(){}); } catch (_) {} }
          else { try { v.pause(); } catch (_) {} }
        }
      });
    }

    var rafPending = false;
    carousel.addEventListener('scroll', function () {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () { updateCenterCard(); rafPending = false; });
    }, { passive: true });
    window.addEventListener('resize', updateCenterCard);

    function animateScrollTo(target) {
      var start = carousel.scrollLeft;
      var diff = target - start;
      var startTime = performance.now();
      function step(now) {
        var elapsed = now - startTime;
        var t = Math.min(1, elapsed / DURATION);
        carousel.scrollLeft = start + diff * easeInOutQuad(t);
        if (t < 1) requestAnimationFrame(step);
        else updateCenterCard();
      }
      requestAnimationFrame(step);
    }

    function getStep() {
      var item = carousel.querySelector('.kb-carousel-item');
      if (!item) return 0;
      var gap = parseFloat(getComputedStyle(carousel).gap) || 14;
      return item.offsetWidth + gap;
    }

    function advance() {
      if (paused) return;
      var step = getStep();
      var maxScroll = carousel.scrollWidth - carousel.clientWidth;
      var next = carousel.scrollLeft + step;
      if (next >= maxScroll - 2) {
        // Về đầu
        animateScrollTo(0);
      } else {
        animateScrollTo(next);
      }
    }

    function start() { stop(); timer = setInterval(advance, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // Pause khi hover (desktop) hoặc user đang drag/scroll bằng tay
    carousel.addEventListener('mouseenter', function () { paused = true; });
    carousel.addEventListener('mouseleave', function () { paused = false; });
    carousel.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    carousel.addEventListener('touchend', function () {
      setTimeout(function () { paused = false; }, 2000);
    }, { passive: true });

    // Init: scroll sao cho card đầu vào giữa màn hình (padding 40px của carousel)
    requestAnimationFrame(function () {
      updateCenterCard();
    });
    start();

    // Pause khi tab ẩn
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  }
  if (document.readyState !== 'loading') initCarouselAutoScroll();
  else document.addEventListener('DOMContentLoaded', initCarouselAutoScroll);

  /* ---- Hover hoặc click video → play; leave → pause ---- */
  function safePlay(v) { try { var p = v.play(); if (p && p.catch) p.catch(function(){}); } catch (_) {} }
  function safePause(v) { try { v.pause(); } catch (_) {} }

  function initCarouselVideos() {
    var items = document.querySelectorAll('.kb-carousel-item');
    items.forEach(function (item) {
      var video = item.querySelector('video');
      if (!video) return;
      // Pause mặc định
      safePause(video);

      // Hover → play
      item.addEventListener('mouseenter', function () { safePlay(video); });
      item.addEventListener('mouseleave', function () {
        // Pause trừ khi card đang là center (center auto-plays)
        if (!item.classList.contains('is-center')) safePause(video);
      });

      // Touch (mobile): tap vào media → play; tap lần 2 → pause
      item.addEventListener('touchstart', function () { safePlay(video); }, { passive: true });
    });
  }

  // Click vào vùng video → toggle play/pause, KHÔNG navigate
  document.addEventListener('click', function (e) {
    var media = e.target.closest('.kb-carousel-media');
    if (!media) return;
    // Nếu click nút mute → không can thiệp (đã có handler riêng)
    if (e.target.closest('[data-kb-video-mute]')) return;
    e.preventDefault();     // chặn <a> parent navigate
    e.stopPropagation();
    var video = media.querySelector('video');
    if (!video) return;
    if (video.paused) safePlay(video);
    else safePause(video);
  });

  if (document.readyState !== 'loading') initCarouselVideos();
  else document.addEventListener('DOMContentLoaded', initCarouselVideos);

  /* ---- Hero carousel (dot indicator + arrow feedback) ---- */
  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('.kb-hero__arrow');
    if (!arrow) return;
    var dots = document.querySelectorAll('.kb-hero__dots span');
    if (!dots.length) return;
    var idx = -1;
    dots.forEach(function (d, i) { if (d.classList.contains('active')) idx = i; });
    if (idx === -1) idx = 0;
    var dir = arrow.classList.contains('kb-hero__arrow--right') ? 1 : -1;
    var next = (idx + dir + dots.length) % dots.length;
    dots[idx].classList.remove('active');
    dots[next].classList.add('active');
  });
  document.addEventListener('click', function (e) {
    var dot = e.target.closest('.kb-hero__dots span');
    if (!dot) return;
    var parent = dot.parentElement;
    parent.querySelectorAll('span').forEach(function (d) { d.classList.remove('active'); });
    dot.classList.add('active');
  });
})();
