/*
  Passionate UI — interactions légères
  - apparition progressive des sections de la vitrine
  - fermeture du menu mobile (clic extérieur, touche Échap, redimensionnement)
  - compteurs animés de la bande de statistiques
*/
(function () {
  'use strict';

  /* Marque le document : le voile d'apparition n'existe que si JS tourne */
  document.documentElement.classList.add('pa-js');

  document.addEventListener('DOMContentLoaded', function () {

    /* ----- Apparition au défilement ----- */
    var revealables = document.querySelectorAll('.pa-reveal');

    if (revealables.length) {
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealables.forEach(function (el) { observer.observe(el); });
      } else {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
      }
    }

    /* ----- Compteurs de la bande de statistiques ----- */
    var counters = document.querySelectorAll('[data-count-to]');

    function runCounter(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var decimals = (el.getAttribute('data-count-decimals') | 0);
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (start === null) { start = timestamp; }
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) { window.requestAnimationFrame(step); }
      }

      window.requestAnimationFrame(step);
    }

    if (counters.length && 'IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ----- Menu mobile ----- */
    var trigger = document.querySelector('.menu-trigger');
    var navList = document.querySelector('.header-area .nav');

    function closeMenu() {
      if (!trigger || !navList) { return; }
      if (window.jQuery) {
        window.jQuery(navList).slideUp(200);
      } else {
        navList.style.display = 'none';
      }
      trigger.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
    }

    if (trigger) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'Ouvrir le menu');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('tabindex', '0');

      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trigger.click();
        }
      });
    }

    document.addEventListener('click', function (event) {
      if (window.innerWidth > 992) { return; }
      if (!trigger || trigger.getAttribute('aria-expanded') !== 'true') { return; }
      if (event.target.closest('.main-nav')) { return; }
      closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeMenu(); }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth > 992 && navList) {
          navList.style.display = '';
          if (trigger) {
            trigger.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
          }
        }
      }, 150);
    });

  });
})();
