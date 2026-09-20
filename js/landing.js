import { mockData } from './mock-data.js';

function initLanding() {
  initScrollAnimations();
  initHowItWorksScroll();
  renderServices();
  renderFeaturedProviders();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanding);
} else {
  initLanding();
}

/* =========================================
   SCROLL ANIMATIONS
   Pixaai-style: reveal-up + fade-up via IntersectionObserver
   ========================================= */

function initScrollAnimations() {
  // Immediately reveal hero elements above the fold
  document.querySelectorAll('.section-hero .fade-up').forEach(el => el.classList.add('is-visible'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = '.fade-up, .scroll-reveal-left, .scroll-reveal-right, .reveal-up, .scale-in';
  const animatedElements = Array.from(document.querySelectorAll(selectors)).filter(el => !el.closest('#how-it-works'));

  if (prefersReducedMotion) {
    animatedElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once (Pixaai pattern)
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* =========================================
   HOW IT WORKS (GSAP STICKY STACKING)
   ========================================= */
function initHowItWorksScroll() {
  const section = document.getElementById('how-it-works');
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  const cards = section.querySelectorAll('.sticky-card');

  cards.forEach((card, index) => {
    const art = card.querySelector('.card-art');
    
    // 1. Position/Fade Reveal (Opacity handled by unified spotlight logic in index.html)
    gsap.fromTo(card,
      { y: 40 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 20%',
          scrub: 1
        }
      }
    );

    // Reveal geometric art
    if (art) {
      gsap.fromTo(art,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            end: 'top 20%',
            scrub: 1
          }
        }
      );
    }

    // 2. The Overlap Scale/Dim: when the NEXT card scrolls up
    if (index < cards.length - 1) {
      const nextCard = cards[index + 1];
      gsap.fromTo(card,
        { scale: 1, filter: 'brightness(1)' },
        {
          scale: 0.95,
          filter: 'brightness(0.3)',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top 80%', 
            end: 'top 20%',
            scrub: 1
          }
        }
      );
    }
  });
}

/* =========================================
   RENDER SERVICES GRID
   ========================================= */
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const categories = mockData.categories || [];

  grid.innerHTML = categories.map(cat => `
    <a href="./pages/client.html" class="service-cat magnetic reveal-up" style="text-decoration:none; color:inherit; display:block;">
      ${cat.image
        ? `<div class="service-img-wrapper"><img src="${cat.image}" alt="${cat.name}" class="service-img" loading="lazy"></div>`
        : '<div class="service-img-wrapper" style="background:rgba(99,102,241,0.08);aspect-ratio:16/9;"></div>'
      }
      <h3 class="service-name">${cat.name}</h3>
    </a>
  `).join('');

  // Re-observe newly rendered elements
  const newEls = grid.querySelectorAll('.reveal-up');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    newEls.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  newEls.forEach(el => obs.observe(el));
}

/* =========================================
   RENDER FEATURED PROVIDERS
   ========================================= */
function getInitials(name) {
  if (!name) return 'SC';
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase();
}

function renderFeaturedProviders() {
  const container = document.getElementById('featured-providers-container');
  if (!container) return;

  const providers = mockData.featuredProviders || [];

  container.innerHTML = providers.map((p, i) => {
    const avatarSrc = p.avatar || p.image || '';
    const initials = getInitials(p.name);
    const reviewsCount = p.reviewsCount || (p.reviews ? p.reviews.length : 0);

    return `
    <a href="./pages/client.html" class="provider-card reveal-up stagger-${Math.min(i + 1, 4)}" style="text-decoration:none; color:inherit; display:flex;">
      <div class="provider-card-header">
        <div class="provider-avatar-container">
          <img src="${avatarSrc}" alt="${p.name}" class="provider-avatar" loading="lazy" onerror="this.classList.add('avatar-img-failed');">
          <div class="provider-avatar-fallback" aria-hidden="true">${initials}</div>
        </div>
        <div class="provider-info">
          <h4>${p.name}</h4>
          <p class="provider-skill">${p.skill}</p>
        </div>
      </div>
      <div class="provider-meta">
        <span class="rating">⭐ ${p.rating} (${reviewsCount} reviews)</span>
      </div>
    </a>
  `;
  }).join('');

  // Observe newly added cards
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = container.querySelectorAll('.reveal-up');
  if (prefersReducedMotion) { cards.forEach(el => el.classList.add('is-visible')); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  cards.forEach(el => obs.observe(el));
}
