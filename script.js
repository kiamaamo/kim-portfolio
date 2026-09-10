/* ================================================================
   Kim Maamo | Virtual Assistant — One-Pager Interactions
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Header: shadow on scroll
     ---------------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------
     Scrollspy: highlight the active nav link
     ---------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter((section) => section);

  const onScrollSpy = () => {
    const position = window.scrollY + 140;

    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= position) current = section;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  window.addEventListener('resize', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ----------------------------------------------------------------
     Scroll reveal: fade sections in as they enter the viewport
     ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('active'));
  }

})();

/* ================================================================
   SERVICES SLIDER
   Auto-advancing image slider for the Services section.
   - Auto-play every 5 seconds (pauses on hover)
   - Prev/Next arrow navigation
   - Dot indicators (auto-generated from the number of slides)
   - Touch/swipe support for mobile
   - Adding more slides requires NO JS changes — just add another
     .service-slide block in index.html and the dots/nav adapt.
   ================================================================ */

(function () {
  const slider = document.querySelector('.service-slider');
  if (!slider) return;

  const track = slider.querySelector('.service-slides');
  const slides = Array.from(slider.querySelectorAll('.service-slide'));
  const prevBtn = slider.querySelector('.service-prev');
  const nextBtn = slider.querySelector('.service-next');
  const dotsWrap = slider.querySelector('.service-dots');

  if (!track || slides.length === 0) return;

  const pageSize = 3;
  const totalPages = Math.ceil(slides.length / pageSize);
  let currentPage = 0;

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';

    for (let i = 0; i < totalPages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
      dot.addEventListener('click', () => {
        currentPage = i;
        updateSlider();
      });
      dotsWrap.appendChild(dot);
    }
  };

  const updateSlider = () => {
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    const pageWidth = slides[0].offsetWidth * pageSize + gap * (pageSize - 1);

    track.style.transition = 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease';
    track.style.opacity = '1';

    requestAnimationFrame(() => {
      track.style.transform = 'translateX(-' + (currentPage * pageWidth) + 'px)';
    });

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index >= currentPage * pageSize && index < (currentPage + 1) * pageSize);
    });

    if (dotsWrap) {
      const dots = Array.from(dotsWrap.children);
      dots.forEach((dot, index) => dot.classList.toggle('active', index === currentPage));
    }

    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
  };

  buildDots();

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage -= 1;
        updateSlider();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage += 1;
        updateSlider();
      }
    });
  }

  window.addEventListener('resize', updateSlider);
  updateSlider();
})();