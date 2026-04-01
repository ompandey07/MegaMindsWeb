gsap.registerPlugin(ScrollTrigger);

// Initialize Locomotive Scroll
const scroller = new LocomotiveScroll({
    el: document.querySelector('#scroll-container'),
    smooth: true,
    multiplier: 1.0,
    lerp: 0.05,
    tablet: { smooth: true },
    smartphone: { smooth: true }
});

scroller.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy('#scroll-container', {
    scrollTop(value) {
        return arguments.length ? scroller.scrollTo(value, 0, 0) : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector('#scroll-container').style.transform ? "transform" : "fixed"
});

// --- DYNAMIC CLOCK ---
function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
    };
    const timeString = now.toLocaleDateString('en-US', options);
    const clockEl = document.getElementById('currentClock');
    if (clockEl) clockEl.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- SNAPPY HERO INTRO ---
const heroTl = gsap.timeline();

window.addEventListener('load', () => {
    // 1. Splash Split
    heroTl.from('.hero-bg-left', { xPercent: -100, duration: 1.0, ease: 'power4.inOut' })
    .from('.hero-bg-right', { xPercent: 100, duration: 1.0, ease: 'power4.inOut' }, "-=1.0")
    
    // 2. Rhythmic Title Characters
    .to('.hero-char-b', {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power4.out'
    }, "-=0.6")

    // 3. Vertical Text & Subtext Reveal
    .to('.hero-vertical-title', { opacity: 1, duration: 0.8, ease: 'power2.out' }, "-=0.6")
    .fromTo('.hero-subtext', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }, 
        "-=0.6"
    );

    // Initial Refresh
    setTimeout(() => {
        ScrollTrigger.refresh();
        scroller.update();
    }, 1000);
});

// --- STABLE REVEAL LOGIC ---
const revealElements = document.querySelectorAll('.gsap-slide-up, .card-item, .story-chapter, .story-title, .contact-info-item');
revealElements.forEach(el => {
    gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                scroller: '#scroll-container',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Footer Border Sync
gsap.to('#footerBorder', {
    scaleX: 1,
    scrollTrigger: {
        trigger: '#footerSection',
        scroller: '#scroll-container',
        start: 'top 95%',
        end: 'bottom 100%',
        scrub: 1
    }
});

// --- OPTIMIZED NAVIGATION DOTS ---
const dots = document.querySelectorAll('.chapter-dot');
const sectionIds = ['#hero', '#vision', '#services', '#mss-erp', '#why-us', '#showcase', '#contact'];

// Use explicit scroll listener with debouncing or throttled logic
scroller.on('scroll', (obj) => {
    // Sync ScrollTrigger
    ScrollTrigger.update();
    
    // Dot Tracking (Throttled feel)
    const scrollY = obj.scroll.y;
    sectionIds.forEach((id, i) => {
        const el = document.querySelector(id);
        if(!el) return;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if(scrollY >= top - window.innerHeight/2 && scrollY < top + height - window.innerHeight/2) {
            dots.forEach(d => d.classList.remove('active'));
            dots[i].classList.add('active');
        }
    });

    // Fade brand
    gsap.to('.dev-badge', {
        opacity: scrollY > 100 ? 0.3 : 1,
        duration: 0.3,
        overwrite: 'auto'
    });
});

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        scroller.scrollTo(sectionIds[i]);
    });
});

// Robust Lifecycle
ScrollTrigger.addEventListener('refresh', () => scroller.update());
window.addEventListener('resize', () => {
    scroller.update();
    ScrollTrigger.refresh();
});

// Final refresh after all logic bound
ScrollTrigger.refresh();
