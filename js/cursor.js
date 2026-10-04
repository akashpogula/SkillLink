document.addEventListener('DOMContentLoaded', () => {
    // Determine which cursor is on the page
    const premiumCursor = document.getElementById('premium-cursor');
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!premiumCursor && !dot) return;

    // Remove CSS transitions to allow JS to handle interpolation without compounding lag
    if (dot) dot.style.transition = 'none';
    if (ring) ring.style.transition = 'none';

    let mouseX = 0, mouseY = 0;
    
    // Independent coords for dot and ring
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;
    let hasMoved = false;
    let scale = 1;
    
    // Snappy tracking for main cursor element
    const LERP = 0.85; 
    // Slower trailing effect for outer ring
    const RING_LERP = 0.25;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
            cursorX = mouseX;
            cursorY = mouseY;
            ringX = mouseX;
            ringY = mouseY;
            
            if (premiumCursor) premiumCursor.style.opacity = '1';
            if (dot) dot.style.opacity = '1';
            if (ring) ring.style.opacity = '1';
            
            hasMoved = true;
        }
    }, { passive: true });

    window.addEventListener('mousedown', () => { scale = 0.75; }, { passive: true });
    window.addEventListener('mouseup', () => { scale = 1; }, { passive: true });

    let currentScale = 1;
    function render() {
        if (!hasMoved) {
            requestAnimationFrame(render);
            return;
        }

        // Lerp positions
        cursorX += (mouseX - cursorX) * LERP;
        cursorY += (mouseY - cursorY) * LERP;
        
        ringX += (mouseX - ringX) * RING_LERP;
        ringY += (mouseY - ringY) * RING_LERP;
        
        currentScale += (scale - currentScale) * 0.3;

        // Apply transforms
        if (premiumCursor) {
            premiumCursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0) scale(${currentScale})`;
        }
        
        if (dot) {
            dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${currentScale}) translate(-50%, -50%)`;
        }
        
        if (ring) {
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${currentScale}) translate(-50%, -50%)`;
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
