/* ============================================================
   NATURALY — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Sticky header ── */
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Mobile menu ── */
    const burger   = document.getElementById('navBurger');
    const navMenu  = document.getElementById('navMenu');

    burger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu on nav link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"], .scroll-link').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = header.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ── Active nav link on scroll ── */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav__link');

    const activateNav = () => {
        const scrollY = window.scrollY + header.offsetHeight + 80;
        let current = '';
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop) current = sec.id;
        });
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}`);
        });
    };
    window.addEventListener('scroll', activateNav, { passive: true });

    /* ── Reveal on scroll (Intersection Observer) ── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── Hero elements reveal on load ── */
    const heroReveals = document.querySelectorAll('.hero .reveal');
    let delay = 0;
    heroReveals.forEach(el => {
        setTimeout(() => el.classList.add('is-visible'), delay);
        delay += 120;
    });

    /* ── Counter animation ── */
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
        const target   = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start    = performance.now();

        const tick = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            el.textContent = Math.floor(easeOut(progress) * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        };

        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter, .mini-stat__n').forEach(el => {
        counterObserver.observe(el);
    });

    /* ── Floating WhatsApp tooltip auto-show ── */
    const floatWA = document.getElementById('floatWA');
    if (floatWA) {
        setTimeout(() => {
            floatWA.classList.add('tooltip-visible');
            setTimeout(() => floatWA.classList.remove('tooltip-visible'), 4000);
        }, 4500);
    }

    /* ── Parallax-like hero background ── */
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `translateY(${y * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ── Product card subtle tilt on mouse move ── */
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left - rect.width  / 2;
            const y      = e.clientY - rect.top  - rect.height / 2;
            const rotX   = (-y / rect.height) * 6;
            const rotY   = ( x / rect.width)  * 6;
            card.style.transform = `translateY(-10px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ── Scroll-triggered section tag reveal ── */
    const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'tagPop .4s var(--ease) forwards';
                tagObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.tag').forEach(tag => {
        tag.style.opacity = '0';
        tagObserver.observe(tag);
    });

    /* ── Inject tagPop keyframe dynamically ── */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tagPop {
            from { opacity: 0; transform: scale(.85) translateY(8px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
    `;
    document.head.appendChild(style);

    /* ── Auto tooltip CSS class ── */
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .float-wa.tooltip-visible .float-wa__tooltip {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(tooltipStyle);

});
