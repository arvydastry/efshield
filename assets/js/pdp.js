/* EFshield demo · prekės puslapis */
(function () {
  'use strict';
  var E = window.EFshield;
  if (!E) return;
  var $ = E.$, $$ = E.$$;
  var pdp = $('[data-pdp]');
  if (!pdp) return;

  var id = pdp.getAttribute('data-product');
  var EF = window.EF || { colors: {} };
  var main = $('[data-gallery-main]');
  var slides = $$('.gslide', main);
  var thumbs = $$('[data-thumb]');
  var radios = $$('input[name="spalva"]', pdp);
  var colorName = $('[data-color-name]');
  var stickyImg = $('[data-sticky-img]');
  var stickyColor = $('[data-sticky-color]');
  var color = 'juodas';

  /* ---------- galerija ---------- */
  function show(i) {
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    thumbs.forEach(function (t, k) {
      t.classList.toggle('is-on', k === i);
      t.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    var s = slides[i];
    var product = s.classList.contains('gslide--product');
    main.setAttribute('data-kind', product ? 'product' : 'photo');
    main.setAttribute('data-bg', product && s.getAttribute('data-color') === 'baltas' ? 'ink' : 'mist');
  }
  function active() { return slides.filter(function (s) { return s.classList.contains('is-on'); })[0] || slides[0]; }

  function setColor(c, keepSlide) {
    color = c;
    pdp.setAttribute('data-color', c);
    radios.forEach(function (r) { r.checked = r.value === c; });
    var label = EF.colors[c] || c;
    if (colorName) colorName.textContent = label.toLowerCase();
    if (stickyColor) stickyColor.textContent = label;
    if (stickyImg) {
      stickyImg.src = stickyImg.src.replace(/-(juodas|baltas)-sm\.webp$/, '-' + c + '-sm.webp');
      stickyImg.classList.toggle('is-dark', c === 'baltas');
    }
    if (!keepSlide) {
      var idx = slides.findIndex(function (s) { return s.getAttribute('data-color') === c; });
      if (idx > -1) show(idx);
    }
  }
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      show(+t.getAttribute('data-thumb'));
      var c = t.getAttribute('data-color');
      if (c) setColor(c, true);
    });
  });
  radios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setColor(r.value); }); });
  show(0);
  // spalva gali ateiti iš pirmo puslapio ar krepšelio nuorodos (?spalva=baltas)
  var wanted = /[?&]spalva=(juodas|baltas)/.exec(window.location.search);
  if (wanted && wanted[1] !== color) setColor(wanted[1]);

  // priartinimas pelės vietoje (XStore: Product Images zoom)
  if (E.FINE && !E.STATIC) {
    main.addEventListener('pointermove', function (e) {
      if (e.target.closest('.gallery__zoom')) return;
      var img = $('img', active());
      var r = main.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
      main.classList.add('is-zoom');
      img.style.transformOrigin = x + '% ' + y + '%';
      img.style.transform = 'scale(1.75)';
    });
    main.addEventListener('pointerleave', function () {
      main.classList.remove('is-zoom');
      slides.forEach(function (s) { var img = $('img', s); img.style.transform = ''; });
    });
  }
  // peržiūros langas
  function openBig() {
    var s = active();
    var img = $('img', s);
    E.openImage(img.currentSrc || img.src, img.alt, s.getAttribute('data-color') === 'baltas');
  }
  main.addEventListener('click', openBig);

  /* ---------- kiekis ir pirkimas ---------- */
  var qtyInput = $('[data-qty-input]');
  function clampQty(v) { return Math.max(1, Math.min(10, parseInt(v, 10) || 1)); }
  var dec = $('[data-qty-dec]'), inc = $('[data-qty-inc]');
  if (dec) dec.addEventListener('click', function () { qtyInput.value = clampQty(+qtyInput.value - 1); });
  if (inc) inc.addEventListener('click', function () { qtyInput.value = clampQty(+qtyInput.value + 1); });
  if (qtyInput) qtyInput.addEventListener('change', function () { qtyInput.value = clampQty(qtyInput.value); });

  var buy = $('[data-buy]');
  if (buy) buy.addEventListener('submit', function (e) {
    e.preventDefault();
    E.addToCart(id, color, clampQty(qtyInput ? qtyInput.value : 1));
    E.openCart();
  });

  var both = $('[data-add-both]');
  if (both) both.addEventListener('click', function () {
    both.getAttribute('data-add-both').split(',').forEach(function (pid) {
      E.addToCart(pid, pid === id ? color : 'juodas', 1);
    });
    E.openCart();
  });

  /* ---------- lipni pirkimo juosta (XStore: Sticky Cart) ---------- */
  var bar = $('[data-stickybuy]');
  var buyBtn = $('[data-buy-btn]');
  if (bar && buyBtn && 'IntersectionObserver' in window) {
    var stickyBtn = $('[data-sticky-add]', bar);
    var footer = $('.footer');
    var pastBuy = false, atFooter = false;
    var sync = function () {
      var on = pastBuy && !atFooter;
      bar.classList.toggle('is-on', on);
      bar.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (stickyBtn) stickyBtn.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (en) {
      pastBuy = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      sync();
    }).observe(buyBtn);
    if (footer) new IntersectionObserver(function (en) { atFooter = en[0].isIntersecting; sync(); }, { threshold: 0.35 }).observe(footer);
    if (stickyBtn) stickyBtn.addEventListener('click', function () { E.addToCart(id, color, 1); E.openCart(); });
  }

  /* ---------- informacijos skiltys (XStore: Tabs, „Accordion style“) ---------- */
  $$('[data-acc] .acc__item').forEach(function (item) {
    var btn = $('button', item);
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
