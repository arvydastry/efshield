/* EFshield demo · pirmas puslapis */
(function () {
  'use strict';
  var E = window.EFshield;
  if (!E) return;
  var $ = E.$, $$ = E.$$, STATIC = E.STATIC;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var motion = E.hasGsap && !STATIC;
  var desktop = window.matchMedia('(min-width: 1001px)');

  /* ---------- hero: nuotrauka slenka lėčiau, bangų sluoksnis seka pelę ---------- */
  var hero = $('[data-hero]');
  if (hero && motion) {
    var photo = $('[data-hero-photo]', hero);
    var waves = $('[data-hero-waves]', hero);
    gsap.to(photo, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    if (E.FINE && waves) {
      var wx = gsap.quickTo(waves, 'x', { duration: 0.9, ease: 'power3.out' });
      var wy = gsap.quickTo(waves, 'y', { duration: 0.9, ease: 'power3.out' });
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        wx(((e.clientX - r.left) / r.width - 0.5) * -26);
        wy(((e.clientY - r.top) / r.height - 0.5) * -18);
      });
    }
  }

  /* ---------- faktų juosta: greitėja slenkant ---------- */
  var track = $('.marquee__track');
  if (track && motion) {
    var tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 46, repeat: -1 });
    var settle;
    ST.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        var v = Math.min(4, Math.abs(self.getVelocity()) / 500);
        gsap.to(tween, { timeScale: 1 + v, duration: 0.3, overwrite: true });
        window.clearTimeout(settle);
        settle = window.setTimeout(function () { gsap.to(tween, { timeScale: 1, duration: 1.2, overwrite: true }); }, 140);
      }
    });
  }

  /* ---------- prekių plytelės: spalvos pasirinkimas (nuorodos į prekę perduoda spalvą) ---------- */
  $$('.ptile').forEach(function (tile) {
    var links = $$('[data-color-link]', tile);
    var apply = function (color) {
      tile.setAttribute('data-color', color);
      links.forEach(function (a) {
        a.href = a.getAttribute('href').split('?')[0] + (color === 'baltas' ? '?spalva=baltas' : '');
      });
    };
    tile.addEventListener('change', function (e) { if (e.target.matches('input[type="radio"]')) apply(e.target.value); });
    var checked = $('input[type="radio"]:checked', tile);
    if (checked) apply(checked.value);
  });

  /* ---------- „Dizainas“: žodžiai ryškėja slenkant (tekstas lieka įprastu tekstu ekrano skaitytuvams) ---------- */
  var big = $('[data-words]');
  if (big && motion) {
    var text = big.textContent.replace(/\s+/g, ' ').trim();
    big.textContent = '';
    var words = text.split(' ').map(function (w) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      big.appendChild(s);
      big.appendChild(document.createTextNode(' '));
      return s;
    });
    ST.create({
      trigger: big, start: 'top 88%', end: 'bottom 68%', scrub: true,
      onUpdate: function (self) {
        var n = Math.round(self.progress * words.length);
        words.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
      }
    });
  }

  /* ---------- panaudojimo kortelės: ankstesnė kortelė traukiasi tik tada, kai kita ją jau dengia ---------- */
  var stack = $('[data-stack]');
  var cards = $$('[data-stack-card]');
  if (cards.length && motion) {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 641px)', function () {
      cards.forEach(function (card, i) {
        var inner = card.firstElementChild;
        var img = $('.ucard__media img', card);
        if (img) gsap.fromTo(img, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
        if (i === cards.length - 1) return;
        gsap.to(inner, {
          scale: 0.93, '--veil': 0.28, ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top 58%', end: 'top 10%', scrub: true }
        });
      });
    });
  }
  // klaviatūra: jei fokusas patenka į kortelę, kurią uždengė kita, puslapis paslenkamas iki jos vietos
  if (stack && cards.length) {
    cards.forEach(function (card, i) {
      card.addEventListener('focusin', function (e) {
        if (!e.target.matches(':focus-visible') || getComputedStyle(card).position !== 'sticky') return;
        var gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
        var top = stack.getBoundingClientRect().top + window.scrollY + i * (card.offsetHeight + gap);
        var stickTop = parseFloat(getComputedStyle(card).top) || 0;
        window.scrollTo({ top: Math.max(0, top - stickTop - 4), behavior: 'auto' });
      });
    });
  }

  /* ---------- video juosta: įkeliama ir grojama tik matoma ---------- */
  var video = $('.calm__video');
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var on = en[0].isIntersecting;
      if (on && !STATIC) {
        if (!video.src) video.src = video.getAttribute('data-src');
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* automatinis grojimas uždraustas: lieka plakatas */ });
      } else if (!video.paused) {
        video.pause();
      }
    }, { rootMargin: '200px 0px' }).observe(video);
  }

  /* ---------- patarimai ----------
     Kompiuteryje visi patarimai matomi; užvedus ar paspaudus keičiasi tik šalia esanti nuotrauka.
     Siauresniame ekrane tai išskleidžiamas sąrašas (vienas atidarytas punktas). */
  var tipsList = $('[data-tips]');
  if (tipsList) {
    var tips = $$('.tip', tipsList);
    var views = $$('[data-tips-view] img');
    var current = 0;
    var show = function (i) {
      tips.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
      if (i !== current) {
        views.forEach(function (v, k) {
          v.classList.toggle('is-prev', k === current);
          v.classList.toggle('is-on', k === i);
        });
      }
      current = i;
      syncAria();
    };
    var syncAria = function () {
      tips.forEach(function (t, k) {
        var b = $('button', t);
        if (desktop.matches) {
          // viskas matoma: mygtukai neveikia kaip jungikliai, todėl išimami iš Tab eilės
          b.setAttribute('aria-expanded', 'true');
          b.setAttribute('aria-disabled', 'true');
          b.tabIndex = -1;
        } else {
          b.setAttribute('aria-expanded', k === current ? 'true' : 'false');
          b.removeAttribute('aria-disabled');
          b.tabIndex = 0;
        }
      });
    };
    tips.forEach(function (t, i) {
      $('button', t).addEventListener('click', function () { show(i); });
      t.addEventListener('pointerenter', function (e) { if (desktop.matches && e.pointerType === 'mouse') show(i); });
    });
    if (desktop.addEventListener) desktop.addEventListener('change', syncAria);
    syncAria();
    // šoninės nuotraukos užkraunamos iš anksto, kad keičiantis nebūtų tuščio tarpo
    var view = $('[data-tips-view]');
    if (view && 'IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        views.forEach(function (v) { v.loading = 'eager'; });
        tio.disconnect();
      }, { rootMargin: '600px 0px' });
      tio.observe(tipsList);
    }
  }

  /* ---------- kontaktų forma (demo: nesiunčiama) ---------- */
  var form = $('[data-form]');
  if (form) {
    var counter = $('[data-counter]', form);
    var out = $('[data-count-out]', form);
    if (counter && out) counter.addEventListener('input', function () { out.textContent = counter.value.length; });

    var boxes = $$('.field-in', form).filter(function (b) { return $('[data-err]', b); });
    var isBad = function (input) {
      if (input.type === 'checkbox') return !input.checked;
      var v = input.value.trim();
      return !v || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
    };
    var mark = function (box, bad) {
      var input = $('input, textarea', box);
      box.classList.toggle('is-bad', bad);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      $('[data-err]', box).hidden = !bad;
    };
    boxes.forEach(function (box) {
      var input = $('input, textarea', box);
      // klaida dingsta vos tik laukas pataisomas
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', function () {
        if (box.classList.contains('is-bad') && !isBad(input)) mark(box, false);
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      boxes.forEach(function (box) {
        var input = $('input, textarea', box);
        var bad = isBad(input);
        mark(box, bad);
        if (bad && !firstBad) firstBad = input;
      });
      var done = $('[data-form-done]', form);
      if (firstBad) { firstBad.focus(); if (done) done.hidden = true; return; }
      form.reset();
      if (out) out.textContent = '0';
      if (done) { done.hidden = false; done.focus(); }
    });
  }
})();
