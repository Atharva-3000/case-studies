/* Shared motion for every page on the case studies site.
   Mirrors the portfolio (Framer): sections rise ~100px and fade in on scroll,
   hero content lifts in on load, images settle from a slight zoom, smooth wheel scrolling.
   Content is fully visible without JS or with reduced motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('has-motion');

  // Smooth scrolling (Lenis), driven by the GSAP ticker so ScrollTrigger stays in sync
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -70 });
        history.replaceState(null, '', id);
      });
    });
  }

  var EASE = 'expo.out';

  // Hero: children of [data-hero] lift in on load, one after another
  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    gsap.fromTo(hero.children, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: EASE, stagger: 0.09, delay: 0.05, clearProps: 'transform' });
  });

  // Section reveals: explicit [data-reveal] plus the shared building blocks
  var auto = '.head, .top, .shead, .plate, .card, .pdr > div, .problems li, .timeline li, .states, .legend, .phones, .quote, .flow, .rules, .doc, .next > a, .case, .numbers .n, .principle, .gallery > figure, .pair > *, .socials a, .contact > div, .ctop, figure.shot, .probs > *, .stat, .vs, .tri > *, .split > *, .more > div, .docs > *, .where, .facts';
  var seen = new Set();
  document.querySelectorAll('[data-reveal], ' + auto).forEach(function (el) {
    if (seen.has(el) || el.closest('[data-hero]')) return;
    // skip elements nested inside another revealed element
    var p = el.parentElement, nested = false;
    while (p) { if (seen.has(p)) { nested = true; break; } p = p.parentElement; }
    if (nested) return;
    seen.add(el);
    var dist = parseFloat(el.getAttribute('data-reveal')) || 100;
    gsap.fromTo(el, { y: dist, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.3, ease: EASE, clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });

  // Images settle from a slight zoom as they scroll through (skip annotated screens)
  document.querySelectorAll('.plate figure > img, figure.shot > img, [data-zoom]').forEach(function (img) {
    if (img.closest('.annot')) return;
    img.parentElement.style.overflow = 'hidden';
    gsap.fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom 55%', scrub: true } });
  });

  // Big display numbers count up once
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count')), pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
    var obj = { v: 0 };
    gsap.to(obj, { v: end, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = pre + Math.round(obj.v).toLocaleString('en-US') + suf; } });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
