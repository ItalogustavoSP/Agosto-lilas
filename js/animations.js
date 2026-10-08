/* Mulher Segura — camada de movimento e microinterações
 * Mantém o conteúdo original. Sem bibliotecas externas.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  ready(function () {
    var body = document.body;
    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    body.appendChild(progress);
    var progressBar = progress.firstElementChild;
    var ticking = false;

    function updateScroll() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.transform = 'scaleX(' + Math.min(100, Math.max(0, amount)) / 100 + ')';
      var header = document.querySelector('.top');
      if (header) header.classList.toggle('top-scrolled', window.scrollY > 18);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }, { passive: true });
    updateScroll();

    // Entrada progressiva: cada elemento aparece apenas quando entra na área visível.
    var revealSelector = '.intro, .stories-head, .carousel, .stories-more, .how-help, .quick, .card, .help-friend, .head, .danger, .helprow, .notice, .steps, .form-card, .mapgrid, .story-grid, .story-cta, .rights, .chat, .footer';
    var observer = null;
    var observed = new WeakSet();

    function revealWithin(root) {
      if (reduceMotion) return;
      var elements = [];
      if (root.matches && root.matches(revealSelector)) elements.push(root);
      if (root.querySelectorAll) elements = elements.concat(Array.prototype.slice.call(root.querySelectorAll(revealSelector)));
      elements.forEach(function (el, index) {
        if (observed.has(el)) return;
        observed.add(el);
        el.classList.add('motion-reveal');
        el.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 65 + 'ms');
        if (observer) observer.observe(el);
        else el.classList.add('motion-visible');
      });
    }

    if (!reduceMotion && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    }

    document.querySelectorAll('.screen.active').forEach(revealWithin);
    // As telas são alternadas pelo app.js; observar a tela ativa quando o usuário navega.
    var screens = document.querySelectorAll('.screen');
    if ('MutationObserver' in window) {
      var screenObserver = new MutationObserver(function (records) {
        records.forEach(function (record) {
          if (record.target.classList.contains('active')) revealWithin(record.target);
        });
      });
      screens.forEach(function (screen) {
        screenObserver.observe(screen, { attributes: true, attributeFilter: ['class'] });
      });
    }

    // Destaque de luz segue discretamente o ponteiro, sem interferir nos cliques.
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.card, .story, .right, .helprow, .q, .place, .intro, .carousel, .helpimg').forEach(function (el) {
        el.classList.add('motion-spotlight');
        el.addEventListener('pointermove', function (event) {
          var rect = el.getBoundingClientRect();
          el.style.setProperty('--spot-x', (event.clientX - rect.left) + 'px');
          el.style.setProperty('--spot-y', (event.clientY - rect.top) + 'px');
        }, { passive: true });
      });

      document.querySelectorAll('.card, .story, .right, .helprow, .q, .place').forEach(function (el) {
        el.classList.add('motion-lift');
      });
    }

    // Efeito de onda ao clicar, mantendo o comportamento original dos botões.
    document.addEventListener('click', function (event) {
      var button = event.target.closest('button, .btn, .q');
      if (!button || reduceMotion) return;
      var rect = button.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'interaction-ripple';
      ripple.style.left = (event.clientX ? event.clientX - rect.left : rect.width / 2) + 'px';
      ripple.style.top = (event.clientY ? event.clientY - rect.top : rect.height / 2) + 'px';
      button.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 650);
    });

    // Movimento sutil do fundo do destaque inicial.
    var hero = document.querySelector('.intro');
    if (hero && finePointer && !reduceMotion) {
      hero.addEventListener('pointermove', function (event) {
        var rect = hero.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty('--hero-shift-x', (x * 9).toFixed(2) + 'px');
        hero.style.setProperty('--hero-shift-y', (y * 7).toFixed(2) + 'px');
      }, { passive: true });
      hero.addEventListener('pointerleave', function () {
        hero.style.setProperty('--hero-shift-x', '0px');
        hero.style.setProperty('--hero-shift-y', '0px');
      });
    }

    // Swipe no carrossel em telas sensíveis ao toque; setas e pontos continuam disponíveis.
    var carousel = document.getElementById('carousel');
    if (carousel) {
      var touchStartX = 0;
      var touchStartY = 0;
      carousel.addEventListener('touchstart', function (event) {
        var touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }, { passive: true });
      carousel.addEventListener('touchend', function (event) {
        var touch = event.changedTouches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25 && typeof window.slideBy === 'function') {
          window.slideBy(dx < 0 ? 1 : -1);
        }
      }, { passive: true });
    }

    // Pausa as animações não essenciais quando a aba não está visível.
    document.addEventListener('visibilitychange', function () {
      body.classList.toggle('tab-hidden', document.hidden);
    });

    body.classList.add('motion-enabled');
  });
})();
