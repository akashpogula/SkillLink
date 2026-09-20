/**
 * SkillConnect — Premium Interactions Engine
 *
 * Cuberto-inspired interaction system:
 * 1. Magnetic interaction (buttons, CTAs)
 * 2. Liquid/color-wipe hover (cursor-position clip-path)
 * 3. Layered typography (cursor-reactive ghost text)
 * 4. Scroll-scrubbed stacked cards (GSAP ScrollTrigger)
 * 5. Page transition wipes
 * 6. Connection/network background animation
 * 7. Card tilt / cursor-light effect
 *
 * Respects prefers-reduced-motion.
 * All listeners use { passive: true } where possible.
 * Proper cleanup for SPA view switches.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // Global mouse position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('pointermove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // =========================================
  // 1. MAGNETIC INTERACTION (Dampened Ultra-Subtle Physics)
  // =========================================
  function initMagnetic() {
    if (prefersReducedMotion || !isFinePointer) return;

    const magneticEls = document.querySelectorAll('.magnetic');
    if (!magneticEls.length) return;

    magneticEls.forEach(function (el) {
      // Smooth easing for magnetic pull and snap-back
      el.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      el.style.willChange = 'transform';

      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        // Dampened magnetic math: 0.12 multiplier (moves only a few pixels)
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.12;

        // Apply translation only on X and Y (no 3D rotation)
        el.style.transform = 'translate3d(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px, 0)';
      });

      el.addEventListener('mouseleave', function () {
        // Snap back smoothly to origin
        el.style.transform = 'translate3d(0px, 0px, 0px)';
      });
    });
  }

  // =========================================
  // 2. LIQUID/COLOR-WIPE HOVER (Reversible)
  // =========================================
  function initLiquidHover() {
    if (prefersReducedMotion || !isFinePointer) return;

    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(function (btn) {
      function updatePos(e) {
        const rect = btn.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)).toFixed(1);
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)).toFixed(1);
        btn.style.setProperty('--mx', x + '%');
        btn.style.setProperty('--my', y + '%');
      }

      btn.addEventListener('pointerenter', function (e) {
        updatePos(e);
      }, { passive: true });

      btn.addEventListener('pointermove', function (e) {
        updatePos(e);
      }, { passive: true });

      btn.addEventListener('pointerleave', function (e) {
        updatePos(e);
      }, { passive: true });
    });
  }

  // =========================================
  // 3. MAGNETIC TYPOGRAPHY + PARTICLE EMISSION
  // =========================================
  // 3. MAGNETIC TYPOGRAPHY & "ON DEMAND" PARTICLE GRAVITY WELL
  // =========================================
  function initMagneticTypography() {
    if (prefersReducedMotion || !isFinePointer) return;

    var heroTitle = document.getElementById('hero-title') || document.querySelector('.hero-title');
    var heroSection = document.getElementById('hero') || document.querySelector('.section-hero');
    var container = heroTitle ? heroTitle.parentElement : null;
    var canvas = document.getElementById('hero-particle-canvas');
    var onDemandEl = document.getElementById('hero-on-demand') || (heroTitle ? heroTitle.querySelector('.hero-serif-accent') : null);

    if (!heroTitle || !container) return;

    // ── Clean up any leftover ghost layers ──
    var oldGhosts = container.querySelectorAll('.hero-ghost-layer, .text-ghost-layer');
    oldGhosts.forEach(function (g) { g.remove(); });

    // ── Magnetic Text Pull State (Preserved) ──
    var magnetTargetX = 0;
    var magnetTargetY = 0;
    var magnetCurrX = 0;
    var magnetCurrY = 0;
    var isHovering = false;
    var rafId = null;

    var MAGNET_LERP = 0.08;        // slow, silky interpolation
    var MAGNET_STRENGTH = 0.018;    // very high resistance — subtle tug
    var MAGNET_MAX = 12;            // max pixels of displacement

    // ── Particle System State: "On Demand" Gravity Well ──
    var particles = [];
    var emitAccum = 0;
    var cursorCanvasX = -9999;
    var cursorCanvasY = -9999;
    var isCursorInAttractorZone = false;

    // Particle attraction parameters
    var ATTRACTION_RADIUS = 320;   // proximity radius around "On Demand"
    var P_LIFETIME = 65;           // frames (~1s)
    var P_SIZE_MIN = 1.4;
    var P_SIZE_MAX = 3.2;
    var P_MAX_POOL = 70;           // max alive particles (GC protection)

    // Luminous ethereal palette matching the editorial accent gradient
    var P_COLORS = [
      [199, 210, 254],  // indigo-200
      [165, 180, 252],  // indigo-300
      [129, 140, 248],  // indigo-400
      [224, 231, 255],  // indigo-100 highlight
      [139, 92, 246]    // violet-500 subtle accent
    ];

    // ── Canvas Setup ──
    var ctx = null;
    var canvasW = 0;
    var canvasH = 0;

    function sizeCanvas() {
      if (!canvas) return;
      var rect = container.getBoundingClientRect();
      canvasW = rect.width + 80;
      canvasH = rect.height + 80;
      canvas.width = canvasW * window.devicePixelRatio;
      canvas.height = canvasH * window.devicePixelRatio;
      canvas.style.width = canvasW + 'px';
      canvas.style.height = canvasH + 'px';
      if (ctx) {
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      }
    }

    if (canvas) {
      ctx = canvas.getContext('2d');
      sizeCanvas();
      window.addEventListener('resize', sizeCanvas, { passive: true });
    }

    // ── Particle Factory: Spawns from "On Demand" Coordinates ──
    function spawnParticleFromOnDemand(spawnX, spawnY) {
      if (particles.length >= P_MAX_POOL) return;

      var color = P_COLORS[Math.floor(Math.random() * P_COLORS.length)];
      var angleToCursor = Math.atan2(cursorCanvasY - spawnY, cursorCanvasX - spawnX);
      // Gentle initial spread directed toward the cursor's magnetic field
      var spread = (Math.random() - 0.5) * 0.9;
      var initialSpeed = 0.4 + Math.random() * 0.8;

      particles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angleToCursor + spread) * initialSpeed,
        vy: Math.sin(angleToCursor + spread) * initialSpeed,
        size: P_SIZE_MIN + Math.random() * (P_SIZE_MAX - P_SIZE_MIN),
        life: P_LIFETIME,
        maxLife: P_LIFETIME,
        r: color[0],
        g: color[1],
        b: color[2]
      });
    }

    // ── Render & Physics Loop ──
    function render() {
      // 1. Magnetic pull on headline container (Preserved)
      magnetCurrX += (magnetTargetX - magnetCurrX) * MAGNET_LERP;
      magnetCurrY += (magnetTargetY - magnetCurrY) * MAGNET_LERP;

      var hasDisplacement = Math.abs(magnetCurrX) > 0.02 || Math.abs(magnetCurrY) > 0.02;

      if (hasDisplacement) {
        container.style.transform = 'translate3d(' + magnetCurrX.toFixed(2) + 'px, ' + magnetCurrY.toFixed(2) + 'px, 0)';
      } else if (!isHovering) {
        container.style.transform = '';
      }

      // 2. Magnetic Attraction Particles (Text-to-Cursor Gravity Well)
      if (ctx && (particles.length > 0 || isCursorInAttractorZone)) {
        ctx.clearRect(0, 0, canvasW, canvasH);

        var alive = [];
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];

          // Vector pointing from particle to cursor position in canvas
          var dx = cursorCanvasX - p.x;
          var dy = cursorCanvasY - p.y;
          var dist = Math.hypot(dx, dy);

          if (dist > 0.001) {
            // Magnetic acceleration toward cursor center
            var pullStrength = 0.16 + (1 - Math.min(dist, 260) / 260) * 0.36;
            p.vx += (dx / dist) * pullStrength;
            p.vy += (dy / dist) * pullStrength;
          }

          // Gentle drag for silky celestial curvature
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;
          p.life--;

          // Terminal decay: As particles reach cursor center, shrink and fade out
          if (dist < 28) {
            p.size *= 0.86;
            p.life -= 1.5;
          }
          if (dist < 10) {
            p.size *= 0.72;
            p.life -= 3;
          }

          // Clean up dead or absorbed particles
          if (p.life <= 0 || p.size < 0.25 || dist < 3.5) {
            continue;
          }

          // Ease-out alpha decay with terminal absorption fade
          var normLife = Math.max(0, p.life / p.maxLife);
          var alpha = normLife * normLife;
          if (dist < 22) {
            alpha *= Math.max(0, dist / 22);
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, p.size * alpha), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + (alpha * 0.75).toFixed(3) + ')';
          ctx.fill();

          // Subtle glowing aura for larger particles
          if (p.size > 2.0 && alpha > 0.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.2 * alpha, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + (alpha * 0.15).toFixed(3) + ')';
            ctx.fill();
          }

          alive.push(p);
        }

        particles = alive; // Active garbage collection
      }

      // Continue loop while active or particles remain
      if (isHovering || hasDisplacement || particles.length > 0 || isCursorInAttractorZone) {
        rafId = requestAnimationFrame(render);
      } else {
        container.style.transform = '';
        if (canvas) canvas.classList.remove('active');
        if (ctx) ctx.clearRect(0, 0, canvasW, canvasH);
        rafId = null;
      }
    }

    function startLoop() {
      if (!rafId) {
        if (canvas) canvas.classList.add('active');
        rafId = requestAnimationFrame(render);
      }
    }

    // ── Event Listeners (Scoped to hero section) ──
    var scope = heroSection || document.body;

    scope.addEventListener('pointerenter', function () {
      isHovering = true;
      startLoop();
    }, { passive: true });

    scope.addEventListener('pointermove', function (e) {
      isHovering = true;
      var cRect = container.getBoundingClientRect();

      // Magnetic pull calculation for container
      var cx = cRect.left + cRect.width / 2;
      var cy = cRect.top + cRect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;

      var rawX = dx * MAGNET_STRENGTH;
      var rawY = dy * MAGNET_STRENGTH;
      magnetTargetX = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, rawX));
      magnetTargetY = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, rawY));

      // Cursor position relative to canvas (40px inset padding)
      cursorCanvasX = (e.clientX - cRect.left) + 40;
      cursorCanvasY = (e.clientY - cRect.top) + 40;

      // Check proximity to "On Demand" text
      var targetEl = onDemandEl || heroTitle;
      var odRect = targetEl.getBoundingClientRect();
      var odCenterX = odRect.left + odRect.width / 2;
      var odCenterY = odRect.top + odRect.height / 2;
      var distToOD = Math.hypot(e.clientX - odCenterX, e.clientY - odCenterY);

      if (distToOD <= ATTRACTION_RADIUS && ctx) {
        isCursorInAttractorZone = true;

        // "On Demand" bounding box relative to canvas
        var odLeft = (odRect.left - cRect.left) + 40;
        var odTop = (odRect.top - cRect.top) + 40;
        var odW = Math.max(20, odRect.width);
        var odH = Math.max(10, odRect.height);

        // Emission rate scales with proximity to "On Demand"
        var proximityFactor = 1 - (distToOD / ATTRACTION_RADIUS);
        emitAccum += 0.32 + proximityFactor * 0.48;

        while (emitAccum >= 1 && particles.length < P_MAX_POOL) {
          // Spawn particle along the bounding coordinates of "On Demand"
          var spawnX = odLeft + Math.random() * odW;
          var spawnY = odTop + Math.random() * odH;
          spawnParticleFromOnDemand(spawnX, spawnY);
          emitAccum -= 1;
        }
      } else {
        isCursorInAttractorZone = false;
      }

      startLoop();
    }, { passive: true });

    scope.addEventListener('pointerleave', function () {
      isHovering = false;
      isCursorInAttractorZone = false;
      magnetTargetX = 0;
      magnetTargetY = 0;
      emitAccum = 0;
      startLoop();
    }, { passive: true });
  }

  // =========================================
  // 4. SCROLL-SCRUBBED STACKED CARDS
  // =========================================
  function initStackedCards() {
    if (prefersReducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var section = document.querySelector('.section-how-it-works');
    var stepRows = document.querySelectorAll('.step-row');

    if (!section || stepRows.length === 0) return;

    var numTransitions = stepRows.length - 1;
    var scrollDistance = (numTransitions * 120) + 'vh'; 

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom 80%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    stepRows.forEach(function (row, i) {
      if (i === 0) {
        gsap.set(row, { y: 0, opacity: 1, scale: 1 });
        return;
      }

      var startTime = (i - 1) * 1.0;

      // Bring up current card
      tl.fromTo(row,
        {
          y: 120, // collapsed below
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'none'
        },
        startTime
      );

      // Slide and scale down all previous cards to build stack depth
      for (var j = 0; j < i; j++) {
        var currentDepth = (i - j - 1);
        var nextDepth = (i - j);
        
        var currentY = currentDepth * -20;
        var nextY = nextDepth * -20;
        var currentScale = 1 - (currentDepth * 0.04);
        var nextScale = 1 - (nextDepth * 0.04);
        var currentOpacity = currentDepth === 0 ? 1 : 0.5;
        var nextOpacity = 0.5;

        tl.fromTo(stepRows[j],
          {
            y: currentY,
            opacity: currentOpacity,
            scale: currentScale
          },
          {
            y: nextY,
            opacity: nextOpacity,
            scale: nextScale,
            duration: 1.0,
            ease: 'none'
          },
          startTime
        );
      }
    });
  }

  // =========================================
  // 5. PAGE TRANSITION WIPES
  // =========================================
  function initPageTransitions() {
    if (prefersReducedMotion) return;

    var overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) return;

    // Find CTAs that navigate to other pages
    var clientLinks = document.querySelectorAll('a[href*="client.html"]');
    var providerLinks = document.querySelectorAll('a[href*="provider.html"]');

    function doTransition(e, direction) {
      e.preventDefault();
      var href = e.currentTarget.href;
      overlay.className = 'page-transition-overlay';
      overlay.style.opacity = '1';

      // Force reflow
      void overlay.offsetWidth;

      overlay.classList.add(direction === 'ltr' ? 'active-ltr' : 'active-rtl');

      setTimeout(function () {
        window.location.href = href;
      }, 350);
    }

    clientLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        doTransition(e, 'ltr');
      });
    });

    providerLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        doTransition(e, 'rtl');
      });
    });

    // Fix for Back/Forward cache (bfcache) blank screen issue
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        // Reset the transition overlay so the page becomes visible again
        overlay.className = 'page-transition-overlay';
        overlay.style.opacity = '0';
        
        // Refresh GSAP ScrollTrigger calculations to ensure elements aren't stuck in a faded state
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });
  }

  // =========================================
  // 6. CONNECTION/NETWORK BACKGROUND
  // =========================================
  function initNetworkAnimation() {
    if (prefersReducedMotion) return;

    var canvas = document.querySelector('.hero-network-canvas');
    if (!canvas) return;

    // Create a real canvas element
    var cvs = document.createElement('canvas');
    cvs.style.width = '100%';
    cvs.style.height = '100%';
    cvs.style.position = 'absolute';
    cvs.style.inset = '0';
    canvas.appendChild(cvs);

    var ctx = cvs.getContext('2d');
    var nodes = [];
    var numNodes = 8;
    var connectionDist = 200;

    function resize() {
      cvs.width = canvas.offsetWidth;
      cvs.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Create nodes
    for (var i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * cvs.width,
        y: Math.random() * cvs.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 2 + Math.random() * 2
      });
    }

    function drawNetwork() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // Update node positions
      nodes.forEach(function (node) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at edges
        if (node.x < 0 || node.x > cvs.width) node.vx *= -1;
        if (node.y < 0 || node.y > cvs.height) node.vy *= -1;

        node.x = Math.max(0, Math.min(cvs.width, node.x));
        node.y = Math.max(0, Math.min(cvs.height, node.y));
      });

      // Draw connections
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            var alpha = (1 - dist / connectionDist) * 0.15;
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(function (node) {
        ctx.fillStyle = 'rgba(129, 140, 248, 0.3)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cursor proximity effect
      if (isFinePointer) {
        var canvasRect = cvs.getBoundingClientRect();
        var localMX = mouseX - canvasRect.left;
        var localMY = mouseY - canvasRect.top;

        nodes.forEach(function (node) {
          var dx = node.x - localMX;
          var dy = node.y - localMY;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            var alpha = (1 - dist / 150) * 0.3;
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(localMX, localMY);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        });
      }

      requestAnimationFrame(drawNetwork);
    }

    requestAnimationFrame(drawNetwork);
  }

  // =========================================
  // 7. CARD TILT / CURSOR-LIGHT EFFECT
  // =========================================
  function initCardTilt() {
    if (prefersReducedMotion || !isFinePointer) return;

    var cards = document.querySelectorAll('.provider-card, .service-cat, .world-card, .cat-card');

    cards.forEach(function (card) {
      // Add cursor light overlay
      var light = document.createElement('div');
      light.className = 'card-light';
      light.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity 0.35s;background:radial-gradient(400px circle at var(--mx) var(--my), rgba(99,102,241,0.1), transparent 60%);z-index:1;';
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(light);

      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var xPct = x / rect.width;
        var yPct = y / rect.height;

        // Subtle perspective tilt
        var tiltX = (yPct - 0.5) * -6;
        var tiltY = (xPct - 0.5) * 6;

        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-4px)';

        // Move light
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        light.style.opacity = '1';
      }, { passive: true });

      card.addEventListener('pointerleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
        light.style.opacity = '0';
        setTimeout(function () {
          card.style.transition = '';
        }, 500);
      }, { passive: true });
    });
  }

  // =========================================
  // INIT ALL
  // =========================================
  function init() {
    initMagnetic();
    initLiquidHover();
    initMagneticTypography();
    initStackedCards();
    initPageTransitions();
    initNetworkAnimation();
    initCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// INTERACTIVE DOT GRID BACKGROUND PHYSICS
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('hero-interactive-bg');
    if (!bgContainer) return;

    let isHovering = false;
    let targetX = 50, targetY = 42;
    let currentX = 50, currentY = 42;

    // Track mouse position over the Hero section
    bgContainer.parentElement.addEventListener('mousemove', (e) => {
        const rect = bgContainer.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Clamp values to keep light on screen
        targetX = Math.max(0, Math.min(100, targetX));
        targetY = Math.max(0, Math.min(100, targetY));
    });

    bgContainer.parentElement.addEventListener('mouseenter', () => isHovering = true);
    bgContainer.parentElement.addEventListener('mouseleave', () => isHovering = false);

    // Animation Loop (Replicates Framer Motion idle drift & spring)
    function animateBg(time) {
        if (!isHovering) {
            // Keep the light statically anchored at the top nav area when idle
            targetX = 50;
            targetY = 0;
        }
        
        // Linear Interpolation (Lerp) for smooth spring effect
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;
        
        // Update CSS Variables natively
        bgContainer.style.setProperty('--x', `${currentX}%`);
        bgContainer.style.setProperty('--y', `${currentY}%`);
        
        requestAnimationFrame(animateBg);
    }
    
    requestAnimationFrame(animateBg);
});

