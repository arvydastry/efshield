/* EFshield demo · interaktyvi skydo schema („Pasukite skydą“)
   Šaltinis centre skleidžia bangas į visas puses. Skydas (balta sienelė) pasukamas vilkimu, rodyklių klavišais
   arba vietų mygtukais. Už skydo esančioje pusėje bangos piešiamos gerokai blankesnės ir punktyru (EFshield bandyme
   su telefonu lauko stipris už skydo buvo apie 12 kartų mažesnis: 6 V/m ir 0,5 V/m). Schema iliustracinė, ne matavimas.
   XStore: HTML valdiklis su šiuo scenarijumi. */
(function () {
  'use strict';

  var WAVE = '255,83,0';
  var CALM_RATIO = 0.5 / 6;          // 1/12
  var TAU = Math.PI * 2;

  function Field(rootEl) {
    this.root = rootEl;
    this.plot = rootEl.querySelector('[data-field-plot]');
    this.canvas = rootEl.querySelector('[data-field-canvas]');
    this.status = rootEl.querySelector('[data-field-status]');
    this.rooms = Array.prototype.slice.call(rootEl.querySelectorAll('[data-room]'));
    this.label = rootEl.querySelector('.field__router');
    this.handle = rootEl.querySelector('[data-field-handle]');
    if (!this.plot || !this.canvas || !this.canvas.getContext) return;
    this.ctx = this.canvas.getContext('2d');
    this.isStatic = document.documentElement.classList.contains('is-static');
    this.angle = this.target = this.rad(this.rooms.length ? +this.rooms[0].getAttribute('data-angle') : -90);
    this.t = 0;
    this.visible = false;
    this.dragging = false;
    this.raf = 0;
    this.bind();
    this.resize();
    this.placeRooms();
    this.update(true);
    this.draw();
  }

  Field.prototype.rad = function (deg) { return deg * Math.PI / 180; };

  Field.prototype.bind = function () {
    var self = this;
    this.rooms.forEach(function (b) {
      b.addEventListener('click', function () { self.setTarget(self.rad(+b.getAttribute('data-angle')), true); });
    });
    // vilkimas
    var plot = this.plot;
    plot.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-room]')) return;
      // liečiamame ekrane skydas sukamas tik už rankenėlės: braukiant per schemą puslapis turi slinkti
      if (e.pointerType === 'touch' && !e.target.closest('[data-field-handle]')) return;
      if (e.pointerType !== 'touch') e.preventDefault();
      self.dragging = true;
      plot.classList.add('is-drag');
      try { plot.setPointerCapture(e.pointerId); } catch (err) { /* nebūtina */ }
      self.fromPointer(e);
    });
    plot.addEventListener('pointermove', function (e) { if (self.dragging) self.fromPointer(e); });
    var end = function () { self.dragging = false; plot.classList.remove('is-drag'); };
    plot.addEventListener('pointerup', end);
    plot.addEventListener('pointercancel', end);
    // klaviatūra: rodyklės ant bet kurio vietos mygtuko suka skydą po 15 laipsnių
    this.root.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      if (!e.target.closest('[data-room]')) return;
      e.preventDefault();
      var dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
      self.setTarget(self.target + dir * self.rad(15), true);
    });
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { self.resize(); self.placeRooms(); self.draw(); }).observe(this.plot);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        self.visible = en[0].isIntersecting;
        if (self.visible) self.loop();
      }, { threshold: 0.05 }).observe(this.plot);
    } else { this.visible = true; this.loop(); }
  };

  Field.prototype.fromPointer = function (e) {
    var r = this.plot.getBoundingClientRect();
    var a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    this.setTarget(a, false);
    this.angle = this.target;      // vilkiant seka pirštą be vėlavimo
    this.update(false);
    if (this.isStatic) this.draw();
  };

  Field.prototype.setTarget = function (a, announce) {
    // trumpiausiu keliu
    var cur = this.target;
    var diff = Math.atan2(Math.sin(a - cur), Math.cos(a - cur));
    this.target = cur + diff;
    if (this.isStatic) { this.angle = this.target; this.update(announce); this.draw(); }
    else { this.update(announce); this.loop(); }
  };

  Field.prototype.resize = function () {
    var r = this.plot.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.size = r.width;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  Field.prototype.placeRooms = function () {
    var self = this;
    var narrow = this.size < 430;
    this.rooms.forEach(function (b) {
      var a = self.rad(+b.getAttribute('data-angle'));
      var k = narrow ? 39 : 41;
      b.style.setProperty('--x', (50 + Math.cos(a) * k) + '%');
      b.style.setProperty('--y', (50 + Math.sin(a) * k) + '%');
    });
  };

  // kurios vietos patenka į uždengtą pusę
  Field.prototype.update = function (announce) {
    var self = this;
    var calm = [];
    var nearest = null, best = 9;
    this.rooms.forEach(function (b) {
      var a = self.rad(+b.getAttribute('data-angle'));
      var diff = Math.abs(Math.atan2(Math.sin(a - self.target), Math.cos(a - self.target)));
      var covered = diff < self.rad(78);
      b.classList.toggle('is-calm', covered);
      b.classList.toggle('is-open', !covered);
      if (covered) calm.push(b);
      if (diff < best) { best = diff; nearest = b; }
    });
    this.rooms.forEach(function (b) {
      b.setAttribute('aria-pressed', (b === nearest && best < self.rad(20)) ? 'true' : 'false');
    });
    if (!this.status) return;
    var txt;
    if (!calm.length) txt = 'Šia kryptimi vietų nėra. Pasukite skydą į vieną iš jų.';
    else if (calm.length === 1) txt = 'Skydas pasuktas į ' + calm[0].getAttribute('data-acc') + '.';
    else txt = 'Uždengta pusė: ' + calm.map(function (b) { return b.textContent.trim().toLowerCase(); }).join(' ir ') + '.';
    if (this.status.textContent !== txt) this.status.textContent = txt;
  };

  Field.prototype.loop = function () {
    var self = this;
    if (this.raf || this.isStatic) return;
    var last = performance.now();
    var step = function (now) {
      self.raf = 0;
      if (!self.visible) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      self.t += dt;
      if (!self.dragging) self.angle += (self.target - self.angle) * Math.min(1, dt * 7);
      self.draw();
      self.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  };

  Field.prototype.draw = function () {
    var c = this.ctx, s = this.size;
    if (!c || !s) return;
    var cx = s / 2, cy = s / 2;
    var R = s * 0.5;                 // bangų pasiekiamas spindulys
    var wall = s * 0.085;            // skydo atstumas nuo šaltinio
    var half = s * 0.115;            // pusė skydo ilgio
    var a = this.angle;
    c.clearRect(0, 0, s, s);

    // pagalbiniai žiedai (erdvės gylis)
    c.lineWidth = 1;
    for (var g = 1; g <= 4; g++) {
      c.strokeStyle = 'rgba(255,255,255,' + (0.085 - g * 0.012) + ')';
      c.beginPath(); c.arc(cx, cy, R * g / 4 - 1, 0, TAU); c.stroke();
    }

    // uždengta pusė: švelnus šviesesnis pusapskritimis
    var grad = c.createRadialGradient(cx, cy, wall, cx, cy, R);
    grad.addColorStop(0, 'rgba(255,255,255,0.075)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = grad;
    c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, a - Math.PI / 2, a + Math.PI / 2); c.closePath(); c.fill();

    // bangos
    var rings = 7, speed = 0.11;
    for (var i = 0; i < rings; i++) {
      var p = ((this.t * speed) + i / rings) % 1;
      var r = wall * 0.5 + p * (R - wall * 0.5);
      var fade = Math.pow(1 - p, 1.25);
      // atvira pusė
      c.strokeStyle = 'rgba(' + WAVE + ',' + (0.95 * fade).toFixed(3) + ')';
      c.lineWidth = 2;
      c.setLineDash([]);
      c.beginPath(); c.arc(cx, cy, r, a + Math.PI / 2, a + Math.PI * 1.5); c.stroke();
      // uždengta pusė: gerokai blankiau, punktyru
      if (r > wall + 4) {
        c.strokeStyle = 'rgba(' + WAVE + ',' + (0.95 * fade * CALM_RATIO * 2.2).toFixed(3) + ')';
        c.lineWidth = 1.25;
        c.setLineDash([3, 7]);
        c.beginPath(); c.arc(cx, cy, r, a - Math.PI / 2, a + Math.PI / 2); c.stroke();
      }
    }
    c.setLineDash([]);

    // atspindys: nuo skydo atgal grįžtantys lankai (veidrodžio principas)
    var mx = cx + Math.cos(a) * wall * 2, my = cy + Math.sin(a) * wall * 2;
    for (var j = 0; j < 2; j++) {
      var q = ((this.t * speed * 1.6) + j / 2) % 1;
      var rr = wall * 1.05 + q * wall * 1.5;
      c.strokeStyle = 'rgba(' + WAVE + ',' + (0.55 * (1 - q)).toFixed(3) + ')';
      c.lineWidth = 1.5;
      c.setLineDash([2, 6]);
      c.beginPath(); c.arc(mx, my, rr, a + Math.PI - 0.62, a + Math.PI + 0.62); c.stroke();
    }
    c.setLineDash([]);

    // skydas
    var wx = cx + Math.cos(a) * wall, wy = cy + Math.sin(a) * wall;
    var nx = -Math.sin(a), ny = Math.cos(a);
    c.strokeStyle = '#fff';
    c.lineWidth = Math.max(6, s * 0.014);
    c.lineCap = 'butt';
    c.beginPath(); c.moveTo(wx - nx * half, wy - ny * half); c.lineTo(wx + nx * half, wy + ny * half); c.stroke();
    // rankenėlė (rodo, kad galima vilkti)
    var hx = cx + Math.cos(a) * (wall + s * 0.06), hy = cy + Math.sin(a) * (wall + s * 0.06);
    if (this.handle) {
      var px = (hx / s * 100).toFixed(2) + '%', py = (hy / s * 100).toFixed(2) + '%';
      if (this._hx !== px || this._hy !== py) {
        this.handle.style.setProperty('--hx', px); this.handle.style.setProperty('--hy', py);
        this._hx = px; this._hy = py;
      }
    }
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.beginPath(); c.arc(hx, hy, 4, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.35)';
    c.lineWidth = 1;
    c.beginPath(); c.arc(hx, hy, 10, 0, TAU); c.stroke();

    // šaltinio užrašas visada priešingoje nei skydas pusėje, kad sienelė jo neuždengtų
    if (this.label) {
      var ld = Math.max(34, s * 0.068);
      this.label.style.transform = 'translate(-50%,-50%) translate(' + (-Math.cos(a) * ld).toFixed(1) + 'px,' + (-Math.sin(a) * ld).toFixed(1) + 'px)';
    }

    // šaltinis
    c.fillStyle = 'rgb(' + WAVE + ')';
    c.beginPath(); c.arc(cx, cy, Math.max(5, s * 0.011), 0, TAU); c.fill();
    c.strokeStyle = 'rgba(' + WAVE + ',0.45)';
    c.lineWidth = 1.5;
    c.beginPath(); c.arc(cx, cy, Math.max(10, s * 0.022), 0, TAU); c.stroke();
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-field]'), function (el) { new Field(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
