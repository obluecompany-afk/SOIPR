/* ============================================================
 * S.O.I — Animations (Rhode-style)
 * Sticky header + hero reveal + parallax + cursor blob + scroll reveal
 * Vanilla JS, no dependencies, ~4KB
 * ============================================================ */

(function () {
  'use strict';

  // Skip animations cho user prefer-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---------- 1. STICKY HEADER hide/show ---------- */
  (function () {
    var header = document.querySelector('.kb-header');
    if (!header) return;
    var lastY = 0, ticking = false;

    function update() {
      var y = window.scrollY;
      var delta = y - lastY;
      if (y < 60) {
        header.classList.remove('is-hidden');
      } else if (delta > 4) {
        header.classList.add('is-hidden');
      } else if (delta < -4) {
        header.classList.remove('is-hidden');
      }
      header.classList.toggle('is-scrolled', y > 30);
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  })();

  /* ---------- 2. TEXT REVEAL letter-by-letter ---------- */
  (function () {
    var titles = document.querySelectorAll('.kb-hero__title, .kb-section-title, .kb-product__title');
    titles.forEach(function (el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      var text = el.textContent.trim();
      if (text.length > 80 || text.length < 1) return;
      el.innerHTML = '';
      var words = text.split(' ');
      words.forEach(function (word, wi) {
        var wrap = document.createElement('span');
        wrap.className = 'kb-reveal-word';
        var inner = document.createElement('span');
        inner.className = 'kb-reveal-inner';
        inner.style.transitionDelay = (wi * 0.06) + 's';
        inner.textContent = word;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
      titles.forEach(function (el) { io.observe(el); });
    }
  })();

  /* ---------- 3. PARALLAX hero ---------- */
  (function () {
    var hero = document.querySelector('.kb-hero');
    if (!hero) return;
    var content = hero.querySelector('.kb-hero__content');
    var cards = hero.querySelector('.kb-hero__cards');
    var ticking = false;

    function update() {
      var rect = hero.getBoundingClientRect();
      var progress = -rect.top / hero.offsetHeight;
      if (progress < -0.1 || progress > 1.5) { ticking = false; return; }
      if (content) content.style.transform = 'translateY(' + (progress * 60) + 'px)';
      if (cards) cards.style.transform = 'translateY(calc(-50% + ' + (progress * 80) + 'px))';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  })();

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var elements = document.querySelectorAll(
      '.kb-product-card, .kb-matched-card, .kb-drop-card, .kb-carousel-item, .kb-family-card, .kb-feature-banner, .kb-thin-tech, .kb-specs, .kb-newsletter, .kb-section-sub'
    );
    elements.forEach(function (el, i) {
      el.classList.add('kb-fade-in');
      // Stagger delay theo grid column
      var siblings = el.parentElement ? el.parentElement.children.length : 1;
      var idx = Array.prototype.indexOf.call(el.parentElement ? el.parentElement.children : [], el);
      el.style.transitionDelay = (idx % 4) * 0.08 + 's';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 5. CURSOR BLOB (desktop only) ---------- */
  (function () {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth < 1024) return;

    var blob = document.createElement('div');
    blob.className = 'kb-cursor-blob';
    document.body.appendChild(blob);

    var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var blobX = mouseX, blobY = mouseY;
    var visible = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        blob.classList.add('is-active');
        visible = true;
      }
    });
    document.addEventListener('mouseleave', function () {
      blob.classList.remove('is-active');
      visible = false;
    });

    function animate() {
      blobX += (mouseX - blobX) * 0.18;
      blobY += (mouseY - blobY) * 0.18;
      blob.style.transform = 'translate3d(' + (blobX - 16) + 'px,' + (blobY - 16) + 'px,0)';
      requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, .kb-product-card, .kb-shade, .kb-thumb')) {
        blob.classList.add('is-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, .kb-product-card, .kb-shade, .kb-thumb')) {
        blob.classList.remove('is-hover');
      }
    });
  })();

  /* ---------- 6. IMAGE FADE-IN ON LOAD ---------- */
  (function () {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('is-loaded');
      } else {
        img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
        img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
      }
    });
  })();

  /* ---------- 7. ANCHOR SMOOTH SCROLL ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  /* ---------- 8. MAGNETIC BUTTON (subtle Rhode-style) ---------- */
  (function () {
    if (window.matchMedia('(hover: none)').matches) return;
    var magneticEls = document.querySelectorAll('.kb-btn-primary, .kb-fab, .kb-rewards-btn, .kb-plus-btn');
    magneticEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  })();

})();
