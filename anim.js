(function () {
'use strict';

/* ── Page transition overlay ─────────────────────────── */
const pt = document.createElement('div');
pt.id = 'pt';
document.body.prepend(pt);
requestAnimationFrame(() => requestAnimationFrame(() => pt.classList.add('out')));

document.addEventListener('click', function (e) {
  const a = e.target.closest('a[href]');
  if (!a) return;
  try {
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    e.preventDefault();
    const dest = a.href;
    pt.classList.remove('out');
    setTimeout(function () { location.href = dest; }, 500);
  } catch (_) {}
});

/* ── Scroll reveal ───────────────────────────────────── */
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 750;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  })(start);
}

const revObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    entry.target.querySelectorAll('.pcount').forEach(countUp);
    revObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

var ri = 0;
document.querySelectorAll('.rev, .rev-l, .rev-r, .rev-s').forEach(function (el) {
  var d = el.dataset.delay;
  if (d === undefined) {
    el.style.transitionDelay = (ri++ % 7) * 0.08 + 's';
  }
  revObs.observe(el);
});

/* first section / page-hero visible immediately */
setTimeout(function () {
  document.querySelectorAll('.page-hero .rev, .page-hero .rev-l, .page-hero .rev-r, .page-hero .rev-s, section:first-of-type .rev, section:first-of-type .rev-r, section:first-of-type .rev-l').forEach(function (el) {
    el.classList.add('in');
  });
}, 120);

/* ── Scroll header border ────────────────────────────── */
var hdr = document.querySelector('header');
if (hdr) {
  window.addEventListener('scroll', function () {
    hdr.style.borderBottom = window.scrollY > 20 ? '1px solid rgba(255,255,255,.07)' : 'none';
  }, { passive: true });
}

/* ── Mobile nav ─────────────────────────────────────── */
var nv = document.getElementById('nv');
if (nv) {
  var mo = document.getElementById('mo');
  var mc = document.getElementById('mc');
  if (mo) mo.addEventListener('click', function () { nv.classList.add('open'); });
  if (mc) mc.addEventListener('click', function () { nv.classList.remove('open'); });
}

/* ── FAQ accordion ──────────────────────────────────── */
document.querySelectorAll('.fb').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.closest('.fi');
    var body = item.querySelector('.fa');
    var open = item.classList.contains('open');
    document.querySelectorAll('.fi').forEach(function (i) {
      i.classList.remove('open');
      i.querySelector('.fa').classList.remove('open');
    });
    if (!open) { item.classList.add('open'); body.classList.add('open'); }
  });
});

/* ── Calculator ─────────────────────────────────────── */
var opts = document.querySelectorAll('.co');
var cbtn = document.getElementById('cb');
var cres = document.getElementById('cr');
if (opts.length && cbtn && cres) {
  var sel = null;
  opts.forEach(function (o) {
    o.addEventListener('click', function () {
      opts.forEach(function (x) { x.classList.remove('sel'); });
      o.classList.add('sel'); sel = o;
      cbtn.style.opacity = '1'; cbtn.style.pointerEvents = 'auto';
      cres.classList.remove('show');
    });
  });
  cbtn.addEventListener('click', function () {
    if (!sel) return;
    document.getElementById('cn').textContent = sel.dataset.n;
    document.getElementById('ce').textContent = sel.dataset.e;
    cres.classList.add('show');
    cres.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ── Smooth scroll for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 68, behavior: 'smooth' }); }
  });
});

/* ── Parallax orbs on mousemove ─────────────────────── */
var orbs = document.querySelectorAll('.orb');
if (orbs.length) {
  document.addEventListener('mousemove', function (e) {
    var mx = (e.clientX / window.innerWidth - 0.5) * 2;
    var my = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach(function (orb, i) {
      var depth = (i + 1) * 12;
      orb.style.transform = 'translate(' + (mx * depth) + 'px,' + (my * depth) + 'px)';
    });
  }, { passive: true });
}

})();
