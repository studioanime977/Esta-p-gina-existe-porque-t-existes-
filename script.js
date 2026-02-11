/* ═══════════════════════════════════════════════════════ */
/*  Página Romántica – Script Principal                   */
/* ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelope();
    initEasterEgg();
});

/* ─── Envelope Cover ─────────────────────────────────── */
function initEnvelope() {
    const overlay = document.getElementById('envelope-overlay');
    const envelope = document.getElementById('envelope');
    const btn = document.getElementById('envelope-btn');
    const pageContent = document.getElementById('page-content');

    if (!overlay || !btn) return;

    // Lock scroll while envelope is showing
    document.body.classList.add('envelope-locked');

    btn.addEventListener('click', () => {
        // 1. Open the envelope (flap + letter animation via CSS)
        envelope.classList.add('open');
        overlay.classList.add('opening');

        // 2. After envelope animation plays, fade out overlay
        setTimeout(() => {
            overlay.classList.add('hidden');
            document.body.classList.remove('envelope-locked');

            // 3. Show page content
            if (pageContent) {
                pageContent.classList.add('visible');
            }

            // 4. Start page animations after content is visible
            setTimeout(() => {
                initScrollReveal();
                initPetalsCanvas();
            }, 400);

            // 5. Remove overlay from DOM after transition
            setTimeout(() => {
                overlay.remove();
            }, 1000);
        }, 1800);
    });
}

/* ─── Scroll Reveal ──────────────────────────────────── */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ─── Falling Petals (Canvas) ────────────────────────── */
function initPetalsCanvas() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let petals = [];
    let animationId;

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Petal {
        constructor() {
            this.reset();
            // Start at random y for initial spread
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 5;
            this.speed = Math.random() * 0.8 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.drift = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.15;
            // Soft pink hues
            const hue = 340 + Math.random() * 30;
            const sat = 60 + Math.random() * 30;
            const light = 75 + Math.random() * 15;
            this.color = `hsla(${hue}, ${sat}%, ${light}%, ${this.opacity})`;
        }

        update() {
            this.y += this.speed;
            this.x += this.drift + Math.sin(this.y * 0.01) * 0.3;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Petal shape
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                this.size * 0.3, -this.size * 0.8,
                this.size, -this.size * 0.6,
                this.size * 0.5, this.size * 0.3
            );
            ctx.bezierCurveTo(
                this.size * 0.2, this.size * 0.6,
                -this.size * 0.2, this.size * 0.3,
                0, 0
            );
            ctx.fill();
            ctx.restore();
        }
    }

    // Create petals
    const petalCount = window.innerWidth < 600 ? 15 : 30;
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    // Only animate while hero is visible
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0 });

    heroObserver.observe(heroSection);
}

/* ─── Easter Egg: Stitch Reveal ──────────────────────── */
function initEasterEgg() {
    const btn = document.getElementById('secret-btn');
    const trigger = document.getElementById('secret-trigger');
    const reveal = document.getElementById('secret-reveal');

    if (!btn || !trigger || !reveal) return;

    btn.addEventListener('click', () => {
        // Fade out trigger
        trigger.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        trigger.style.opacity = '0';
        trigger.style.transform = 'scale(0.9)';

        setTimeout(() => {
            trigger.style.display = 'none';
            reveal.classList.add('active');
        }, 400);
    });
}
