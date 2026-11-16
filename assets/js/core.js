/* EFshield demo · bendras scenarijus (visi puslapiai)
   Judesys: GSAP 3 + ScrollTrigger (assets/js/vendor). Viskas išjungiama su prefers-reduced-motion arba ?static=1.
   Perkeliant į XStore: judesio dalis tampa vienu child-theme scenarijumi; krepšelį, meniu ir antraštės slėpimą pakeičia temos funkcijos. */
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  var STATIC = root.classList.contains('is-static');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function money(v) { return v.toFixed(2).replace('.', ',') + ' €'; }

  var EF = window.EF || { products: {}, colors: {} };

  /* ------------------------------------------------------------ atsiradimas slenkant
     Antraštės suskaidytos žodžiais jau HTML'e (build.py), čia tik pridedama klasė, kai blokas pasirodo ekrane. */
  var revealEls = $$('[data-split], [data-reveal]');
  if (STATIC || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------ mygtukų „banga“ nuo pelės taško */
  d.addEventListener('pointerover', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b || b.contains(e.relatedTarget)) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty('--x', (e.clientX - r.left) + 'px');
    b.style.setProperty('--y', (e.clientY - r.top) + 'px');
  });

  /* ------------------------------------------------------------ švelnus slinkimas tik paspaudus vidinę nuorodą
     (visam puslapiui įjungtas „smooth“ trukdo naršant klaviatūra) */
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-demo') || a.hasAttribute('data-cart-open')) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && d.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: STATIC ? 'auto' : 'smooth', block: 'start' });
    if (window.history && history.pushState) history.pushState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ------------------------------------------------------------ sluoksniai: krepšelis, meniu, vaizdo langas */
  var scrim = $('[data-scrim]');
  var openLayerEl = null;
  var lastFocus = null;
  var closeTimer = 0;

  function focusables(el) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), textarea, select, iframe, [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null && !n.hasAttribute('data-lightbox-end'); });
  }
  function finishClose(el) {
    el.hidden = true;
    if (scrim) scrim.hidden = true;
    if (el.matches('[data-lightbox]')) $('[data-lightbox-frame]', el).innerHTML = '';
  }
  function openLayer(el, useScrim) {
    window.clearTimeout(closeTimer);
    if (openLayerEl && openLayerEl !== el) closeLayer(true);
    lastFocus = d.activeElement;
    openLayerEl = el;
    el.hidden = false;
    if (scrim) { scrim.hidden = !useScrim; }
    root.classList.add('is-locked');
    void el.offsetWidth;
    el.classList.add('is-on');
    if (useScrim && scrim) scrim.classList.add('is-on');
    var f = focusables(el)[0];
    if (f) f.focus({ preventScroll: true });
  }
  function closeLayer(instant) {
    var el = openLayerEl;
    if (!el) return;
    openLayerEl = null;
    el.classList.remove('is-on');
    if (scrim) scrim.classList.remove('is-on');
    root.classList.remove('is-locked');
    window.clearTimeout(closeTimer);
    if (instant || STATIC) finishClose(el);
    else closeTimer = window.setTimeout(function () { if (openLayerEl !== el) finishClose(el); }, 560);
    if (lastFocus && lastFocus.focus && !instant) lastFocus.focus({ preventScroll: true });
    $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  d.addEventListener('keydown', function (e) {
    if (!openLayerEl) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(openLayerEl);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    // iš vaizdo grotuvo (iframe) naršyklė pati perkelia fokusą į po jo esantį sargybinį elementą
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last && last.tagName !== 'IFRAME') { e.preventDefault(); first.focus(); }
  });
  var lbEnd = $('[data-lightbox-end]');
  if (lbEnd) lbEnd.addEventListener('focus', function () { var c = $('[data-lightbox-close]'); if (c) c.focus(); });
  if (scrim) scrim.addEventListener('click', function () { closeLayer(); });

  /* ------------------------------------------------------------ pranešimas */
  var toastEl = $('[data-toast]');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-on');
      window.setTimeout(function () { toastEl.hidden = true; }, 400);
    }, 3400);
  }

  /* ------------------------------------------------------------ krepšelis (demo maketas: saugoma naršyklėje) */
  var KEY = 'efshield-demo-krepselis';
  var cart = [];
  try { cart = JSON.parse(window.localStorage.getItem(KEY) || '[]') || []; } catch (err) { cart = []; }
  cart = cart.filter(function (i) { return i && EF.products[i.id] && i.qty > 0; });

  function saveCart() { try { window.localStorage.setItem(KEY, JSON.stringify(cart)); } catch (err) { /* privatus langas */ } }
  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartSum() { return cart.reduce(function (n, i) { return n + i.qty * EF.products[i.id].price; }, 0); }
  function productUrl(item) { return EF.products[item.id].slug + '.html' + (item.color === 'baltas' ? '?spalva=baltas' : ''); }

  function renderCart(bump) {
    var list = $('[data-cart-items]');
    if (!list) return;
    var count = cartCount();
    $$('[data-cart-count]').forEach(function (c) {
      c.textContent = count;
      c.hidden = count === 0;
      if (bump) { c.classList.remove('is-bump'); void c.offsetWidth; c.classList.add('is-bump'); }
    });
    $('[data-cart-empty]').hidden = count > 0;
    $('[data-cart-foot]').hidden = count === 0;
    list.innerHTML = '';
    cart.forEach(function (item, idx) {
      var p = EF.products[item.id];
      var li = d.createElement('li');
      li.innerHTML =
        '<a class="citem__img' + (item.color === 'baltas' ? ' is-dark' : '') + '" href="' + productUrl(item) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="assets/img/products/' + p.img + '-' + item.color + '-sm.webp" alt="" width="84" height="84"></a>' +
        '<div><p class="citem__name"><a href="' + productUrl(item) + '">' + p.name + '</a></p>' +
          '<p class="citem__meta">Spalva: ' + (EF.colors[item.color] || item.color).toLowerCase() + '</p>' +
          '<div class="qty qty--sm">' +
            '<button type="button" data-ci="dec" data-i="' + idx + '" aria-label="Mažinti kiekį: ' + p.name + '"><svg class="ico" aria-hidden="true"><use href="#i-minus"/></svg></button>' +
            '<input type="number" min="1" max="10" value="' + item.qty + '" data-ci="qty" data-i="' + idx + '" aria-label="Kiekis: ' + p.name + '">' +
            '<button type="button" data-ci="inc" data-i="' + idx + '" aria-label="Didinti kiekį: ' + p.name + '"><svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg></button>' +
          '</div></div>' +
        '<div class="citem__right"><span class="price">' + money(p.price * item.qty) + '</span>' +
          '<button class="citem__del" type="button" data-ci="del" data-i="' + idx + '" aria-label="Pašalinti iš krepšelio: ' + p.name + '"><svg class="ico" aria-hidden="true"><use href="#i-trash"/></svg></button></div>';
      list.appendChild(li);
    });
    $('[data-cart-subtotal]').textContent = money(cartSum());
    var total = $('[data-cart-total]');
    if (total) total.textContent = count ? money(cartSum()) : '';
  }
  // po perpiešimo fokusas grąžinamas į tą patį valdiklį (arba artimiausią likusį)
  function refocusCart(kind, idx) {
    var drawer = $('#krepselis');
    if (!drawer || drawer.hidden) return;
    var el = $('[data-ci="' + kind + '"][data-i="' + idx + '"]', drawer) ||
             $('[data-ci="' + kind + '"][data-i="' + Math.max(0, idx - 1) + '"]', drawer) ||
             focusables(drawer)[0];
    if (el) el.focus({ preventScroll: true });
  }
  function addToCart(id, color, qty) {
    if (!EF.products[id]) return;
    qty = Math.max(1, Math.min(10, qty || 1));
    color = color || 'juodas';
    var hit = cart.filter(function (i) { return i.id === id && i.color === color; })[0];
    if (hit) hit.qty = Math.min(10, hit.qty + qty); else cart.push({ id: id, color: color, qty: qty });
    saveCart();
    renderCart(true);
  }
  function openCart() { var el = $('#krepselis'); if (el) openLayer(el, true); }

  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button[data-ci]');
    if (!t) return;
    var kind = t.getAttribute('data-ci'), i = +t.getAttribute('data-i');
    if (!cart[i]) return;
    if (kind === 'del') cart.splice(i, 1);
    else if (kind === 'inc') cart[i].qty = Math.min(10, cart[i].qty + 1);
    else { cart[i].qty -= 1; if (cart[i].qty < 1) cart.splice(i, 1); }
    saveCart(); renderCart();
    refocusCart(kind, i);
  });
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (!t.matches || !t.matches('input[data-ci="qty"]')) return;
    var i = +t.getAttribute('data-i');
    if (!cart[i]) return;
    cart[i].qty = Math.max(1, Math.min(10, parseInt(t.value, 10) || 1));
    saveCart(); renderCart();
    refocusCart('qty', i);
  });

  /* ------------------------------------------------------------ bendri paspaudimai */
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cart-open],[data-cart-close],[data-menu-open],[data-menu-close],[data-demo],[data-video],[data-lightbox-close],[data-add]');
    if (!t) return;
    if (t.hasAttribute('data-demo')) {
      e.preventDefault();
      toast('Demonstracinėje versijoje dalis „' + t.getAttribute('data-demo') + '“ dar nesukurta.');
      return;
    }
    if (t.hasAttribute('data-cart-open')) { e.preventDefault(); openCart(); return; }
    if (t.hasAttribute('data-cart-close')) { closeLayer(); return; }
    if (t.hasAttribute('data-menu-open')) { t.setAttribute('aria-expanded', 'true'); openLayer($('#mobilus-meniu')); return; }
    if (t.hasAttribute('data-menu-close')) { closeLayer(t.tagName === 'A'); return; }
    if (t.hasAttribute('data-lightbox-close')) { closeLayer(); return; }
    if (t.hasAttribute('data-video')) { e.preventDefault(); openVideo(t.getAttribute('data-video'), t.getAttribute('data-video-title') || 'Vaizdo įrašas'); return; }
    if (t.hasAttribute('data-add')) {
      var tile = t.closest('[data-product]');
      addToCart(t.getAttribute('data-add'), tile ? tile.getAttribute('data-color') : 'juodas', 1);
      openCart();
    }
  });

  function lightboxLabel(text) { var l = $('[data-lightbox-close-label]'); if (l) l.textContent = text; }
  function openVideo(id, title) {
    var lb = $('[data-lightbox]');
    if (!lb) return;
    var frame = $('[data-lightbox-frame]', lb);
    frame.className = 'lightbox__frame';
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1" title="' + title.replace(/"/g, '&quot;') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    lb.setAttribute('aria-label', title);
    lightboxLabel('Uždaryti vaizdo įrašą');
    openLayer(lb);
  }
  function openImage(src, alt, dark) {
    var lb = $('[data-lightbox]');
    if (!lb) return;
    var frame = $('[data-lightbox-frame]', lb);
    frame.className = 'lightbox__frame is-img';
    frame.innerHTML = '';
    var img = d.createElement('img');
    img.src = src; img.alt = alt || '';
    if (dark) img.className = 'is-dark';
    frame.appendChild(img);
    lb.setAttribute('aria-label', alt || 'Nuotrauka');
    lightboxLabel('Uždaryti nuotrauką');
    openLayer(lb);
  }
  var lbEl = $('[data-lightbox]');
  if (lbEl) lbEl.addEventListener('click', function (e) { if (e.target === lbEl) closeLayer(); });

  /* ------------------------------------------------------------ skaitikliai (bandymo skaičiai) */
  function runCount(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
    if (STATIC || !hasGsap) { el.textContent = fmt(end); return; }
    var o = { v: 0 };
    window.gsap.to(o, { v: end, duration: 1.5, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } });
  }
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !STATIC) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ------------------------------------------------------------ slinkimo judesys */
  if (hasGsap && !STATIC) {
    var gsap = window.gsap, ST = window.ScrollTrigger;

    // antraštė: slenkant žemyn pasislepia, slenkant aukštyn grįžta (XStore sticky tipas „smart“)
    var header = $('[data-header]');
    if (header) {
      ST.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          var hide = self.direction === 1 && self.scroll() > 420 && !openLayerEl && !header.contains(d.activeElement);
          header.classList.toggle('is-hidden', hide);
        }
      });
      header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    }

    // sluoksniai, judantys skirtingu greičiu; data-speed-min riboja efektą nuo nurodyto ekrano pločio
    $$('[data-speed]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-speed')) || 0;
      var min = el.getAttribute('data-speed-min');
      var make = function () {
        return gsap.fromTo(el, { yPercent: s }, { yPercent: -s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      };
      if (min) gsap.matchMedia().add('(min-width: ' + min + 'px)', make); else make();
    });
    $$('[data-speed-bg]').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -13 }, { yPercent: 13, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // tamsi scena: įslenka su paraštėmis ir išsiplečia iki krašto, Gyvybės gėlė sukasi kartu su slinkimu
    $$('[data-stage]').forEach(function (stage) {
      var panel = $('[data-stage-panel]', stage);
      var ros = $('[data-stage-rosette]', stage);
      if (panel) gsap.fromTo(panel, { '--p': 1 }, { '--p': 0, ease: 'none', scrollTrigger: { trigger: stage, start: 'top 92%', end: 'top 28%', scrub: true } });
      if (ros) gsap.fromTo(ros, { rotation: -30 }, { rotation: 90, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });

    // prekės pakreipimas pagal pelę
    if (FINE) {
      $$('[data-tilt]').forEach(function (box) {
        var layers = $$('[data-tilt-layer]', box);
        if (!layers.length) return;
        var rx = layers.map(function (l) { return gsap.quickTo(l, 'rotationX', { duration: 0.7, ease: 'power3.out' }); });
        var ry = layers.map(function (l) { return gsap.quickTo(l, 'rotationY', { duration: 0.7, ease: 'power3.out' }); });
        var tx = layers.map(function (l) { return gsap.quickTo(l, 'x', { duration: 0.7, ease: 'power3.out' }); });
        var ty = layers.map(function (l) { return gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3.out' }); });
        gsap.set(layers, { transformPerspective: 900, transformOrigin: '50% 60%' });
        box.addEventListener('pointermove', function (e) {
          var r = box.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach(function (l, i) { ry[i](px * 18); rx[i](-py * 14); tx[i](px * 22); ty[i](py * 16); });
        });
        box.addEventListener('pointerleave', function () {
          layers.forEach(function (l, i) { ry[i](0); rx[i](0); tx[i](0); ty[i](0); });
        });
      });
    }

    window.addEventListener('load', function () { ST.refresh(); });
  }

  renderCart();

  window.EFshield = { $: $, $$: $$, STATIC: STATIC, FINE: FINE, hasGsap: hasGsap, toast: toast, addToCart: addToCart, openCart: openCart, openImage: openImage, money: money };
})();
