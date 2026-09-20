document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('premium-cursor');
    if (!cursor) return;

    let hasMoved = false;

    // Smooth Follow Physics
    window.addEventListener('mousemove', (e) => {
        if (!hasMoved) {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
            hasMoved = true;
        }
        
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    // Click Physics (Shrinks slightly on click)
    window.addEventListener('mousedown', () => gsap.to(cursor, { scale: 0.8, duration: 0.1, overwrite: "auto" }));
    window.addEventListener('mouseup', () => gsap.to(cursor, { scale: 1, duration: 0.1, overwrite: "auto" }));
});
