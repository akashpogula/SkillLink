/**
 * ──────────────────────────────────────────────────────
 *  Modular Scroll-Triggered Particle Reveal & Typing System
 * ──────────────────────────────────────────────────────
 *
 *  Usage:  Drop a .particle-reveal-wrapper anywhere in
 *          the DOM. Each wrapper must contain:
 *            • canvas.particle-canvas   (absolute, z-0)
 *            • .particle-text           (relative, z-10) with data-text="..."
 *
 *  The script auto-discovers every instance, initialises its
 *  dedicated canvas context and particle pool, and wires a
 *  GSAP ScrollTrigger that simultaneously drives:
 *    1. Particle convergence from dispersed to text cluster
 *    2. Forward and reverse scroll-scrubbed character typing
 *
 *  Adding more blocks later requires ZERO JS changes.
 * ──────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Configuration ───────────────────────────── */
  const PARTICLE_COUNT = 50;       // per wrapper (40-60 ambient particles)
  const PARTICLE_MIN_R = 0.8;      // px
  const PARTICLE_MAX_R = 2.0;      // px
  const PARTICLE_ALPHA = 0.40;
  const SCATTER_PAD = 1.6;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function createParticle(cw, ch) {
    const homeX = cw * 0.5 + rand(-cw * 0.35, cw * 0.35);
    const homeY = ch * 0.5 + rand(-ch * 0.30, ch * 0.30);
    const angle = rand(0, Math.PI * 2);
    const radius = rand(cw * 0.4, cw * SCATTER_PAD);
    const scatX = cw * 0.5 + Math.cos(angle) * radius;
    const scatY = ch * 0.5 + Math.sin(angle) * radius;

    return {
      homeX, homeY, scatX, scatY,
      x: scatX, y: scatY,
      r: rand(PARTICLE_MIN_R, PARTICLE_MAX_R),
      alpha: rand(PARTICLE_ALPHA * 0.5, PARTICLE_ALPHA),
      drift: rand(0.2, 0.8),
      phase: rand(0, Math.PI * 2)
    };
  }

  function init() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.querySelectorAll('.particle-reveal-wrapper').forEach((wrapper) => {
      const canvas = wrapper.querySelector('.particle-canvas');
      const textElement = wrapper.querySelector('.particle-text');
      if (!canvas || !textElement) return;

      const ctx = canvas.getContext('2d');
      let particles = [];
      let progress = 0;          // 0 = fully scattered, 1 = fully converged
      let rafId = null;
      let isVisible = false;

      // ── 1. Text Preparation ──
      let fullText = textElement.getAttribute('data-text');
      if (!fullText) {
        fullText = textElement.textContent.trim();
        textElement.setAttribute('data-text', fullText);
      }
      textElement.innerHTML = ""; // Ensure empty on load
      textElement.style.opacity = "1";

      // ── 2. Canvas Sizing & Particle Pool ──
      function resize() {
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(createParticle(rect.width, rect.height));
        }
      }

      resize();
      window.addEventListener('resize', resize);

      // ── 3. Render Loop (Scoped per Canvas) ──
      let time = 0;
      function draw() {
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        ctx.clearRect(0, 0, w, h);
        time += 0.01;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const targetX = lerp(p.scatX, p.homeX, progress);
          const targetY = lerp(p.scatY, p.homeY, progress);

          const floatX = Math.sin(time * p.drift + p.phase) * (3 * (1 - progress * 0.7));
          const floatY = Math.cos(time * p.drift * 0.7 + p.phase) * (2 * (1 - progress * 0.7));

          p.x = targetX + floatX;
          p.y = targetY + floatY;

          const drawAlpha = p.alpha * (0.3 + progress * 0.7);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${drawAlpha})`;
          ctx.fill();

          if (p.r > 1.4 && progress > 0.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${drawAlpha * 0.15 * progress})`;
            ctx.fill();
          }
        }

        if (isVisible) {
          rafId = requestAnimationFrame(draw);
        }
      }

      // ── 4. Visibility Observer (Zero CPU when off-screen) ──
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              rafId = requestAnimationFrame(draw);
            }
          } else {
            isVisible = false;
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      }, { rootMargin: '200px' });

      observer.observe(wrapper);

      // ── 5. GSAP Scroll-Scrubbed Text Typing & Simultaneous Particle Convergence ──
      if (typeof gsap !== 'undefined') {
        // Create a proxy object to hold the typing progress
        const textProxy = { length: 0 };

        gsap.to(textProxy, {
          length: fullText.length,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            end: "top 45%",
            scrub: 1, // Smoothly links to scroll position
            onUpdate: (self) => {
              // Simultaneously sync canvas particle convergence progress (0 -> 1)
              progress = self.progress;
            }
          },
          onUpdate: () => {
            // Slice the string based on the current scroll progress
            const currentLength = Math.max(0, Math.floor(textProxy.length));
            textElement.innerHTML = fullText.substring(0, currentLength);

            // Synchronize particle convergence progress
            if (fullText.length > 0) {
              progress = textProxy.length / fullText.length;
            }
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
