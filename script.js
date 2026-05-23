/* =========================================
   THE GRAND AURUM — MAIN SCRIPT
   ========================================= */

'use strict';

// ─── PRELOADER ───────────────────────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
  }, 1800);
});

// ─── NAVBAR ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Back to top button
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 600);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when link clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ─── DARK / LIGHT MODE TOGGLE ────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Restore saved theme
const savedTheme = localStorage.getItem('grandAurumTheme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('grandAurumTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ─── HERO SLIDER ─────────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dots .dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startSlider() {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
}
function resetSlider() {
  clearInterval(slideInterval);
  startSlider();
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
});

startSlider();

// ─── QUICK BOOK DATE DEFAULTS ─────────────────────────────────
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 3);

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

const checkin = document.getElementById('qbCheckin');
const checkout = document.getElementById('qbCheckout');
if (checkin) {
  checkin.value = formatDate(tomorrow);
  checkin.min = formatDate(today);
  checkin.addEventListener('change', () => {
    const checkInDate = new Date(checkin.value);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = formatDate(nextDay);
    if (new Date(checkout.value) <= checkInDate) {
      checkout.value = formatDate(nextDay);
    }
  });
}
if (checkout) {
  checkout.value = formatDate(nextWeek);
  checkout.min = formatDate(tomorrow);
}

// ─── SCROLL REVEAL ANIMATIONS ────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards in grids
      const parent = entry.target.closest('.rooms-grid, .amenities-grid, .gallery-grid, .stats-grid');
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll('.reveal, .amenity-card'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .amenity-card').forEach(el => {
  revealObserver.observe(el);
});

// ─── ANIMATED COUNTERS ───────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target.querySelector('.stat-number');
      if (counter && !counter.dataset.animated) {
        counter.dataset.animated = 'true';
        animateCounter(counter);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-animate]').forEach(el => counterObserver.observe(el));

// ─── TESTIMONIAL SLIDER ──────────────────────────────────────
const track = document.getElementById('testimonialTrack');
const tDots = document.querySelectorAll('.t-dot');
let tCurrent = 0;
let tAutoPlay;
const tCards = document.querySelectorAll('.testimonial-card');

function goToTestimonial(index) {
  tCurrent = (index + tCards.length) % tCards.length;
  track.style.transform = `translateX(-${tCurrent * 100}%)`;
  tDots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
}

document.getElementById('tPrev').addEventListener('click', () => {
  goToTestimonial(tCurrent - 1);
  resetTAuto();
});
document.getElementById('tNext').addEventListener('click', () => {
  goToTestimonial(tCurrent + 1);
  resetTAuto();
});
tDots.forEach((d, i) => d.addEventListener('click', () => { goToTestimonial(i); resetTAuto(); }));

// Touch swipe support for testimonials
let tTouchStart = 0;
track.addEventListener('touchstart', e => tTouchStart = e.touches[0].clientX, { passive: true });
track.addEventListener('touchend', e => {
  const diff = tTouchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToTestimonial(diff > 0 ? tCurrent + 1 : tCurrent - 1);
});

function startTAuto() {
  tAutoPlay = setInterval(() => goToTestimonial(tCurrent + 1), 5000);
}
function resetTAuto() { clearInterval(tAutoPlay); startTAuto(); }
startTAuto();

// ─── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('open'));

    // Open clicked (unless already open)
    if (!isOpen) item.classList.add('open');
  });
});

// ─── BOOKING FORM ────────────────────────────────────────────
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Simple validation feedback
  const btn = this.querySelector('[type="submit"]');
  btn.textContent = 'Processing...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = 'Confirm Reservation';
    btn.style.opacity = '1';
    document.getElementById('successModal').classList.add('visible');
    this.reset();
  }, 1500);
});

function closeModal() {
  document.getElementById('successModal').classList.remove('visible');
}

// Close modal on backdrop click
document.getElementById('successModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── BACK TO TOP ─────────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── SMOOTH SCROLL POLYFILL FOR NAV ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── PARALLAX EFFECT ON HERO ─────────────────────────────────
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / 600);
  }
}, { passive: true });

// ─── GALLERY LIGHTBOX (SIMPLE) ────────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const bg = item.style.backgroundImage;
    const url = bg.slice(5, -2); // Extract URL from url('')

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.95);
      display:flex;align-items:center;justify-content:center;
      z-index:9500;cursor:pointer;padding:2rem;
      animation:fadeIn 0.3s ease;
    `;

    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
      max-width:90vw;max-height:90vh;
      object-fit:contain;border-radius:8px;
      box-shadow:0 30px 80px rgba(0,0,0,0.8);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position:absolute;top:2rem;right:2rem;
      color:#fff;font-size:2rem;background:none;
      border:none;cursor:pointer;opacity:0.7;
      font-family:sans-serif;line-height:1;
    `;

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeLightbox() {
      overlay.style.opacity = '0';
      overlay.style.transition = '0.3s';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 300);
    }

    overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); }, { once: true });
  });
});

// Add fadeIn keyframe
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from{opacity:0} to{opacity:1} }`;
document.head.appendChild(style);

// ─── NEWSLETTER FORM ─────────────────────────────────────────
const nlForm = document.querySelector('.newsletter-form');
if (nlForm) {
  nlForm.querySelector('button').addEventListener('click', () => {
    const input = nlForm.querySelector('input');
    if (input.value && input.value.includes('@')) {
      input.value = '';
      input.placeholder = '✓ You\'re subscribed!';
      setTimeout(() => input.placeholder = 'your@email.com', 3000);
    } else {
      input.placeholder = 'Please enter a valid email';
      input.style.borderColor = '#ff6b6b';
      setTimeout(() => {
        input.placeholder = 'your@email.com';
        input.style.borderColor = '';
      }, 2000);
    }
  });
}

// ─── QUICK BOOK CHECK AVAILABILITY ──────────────────────────
document.querySelector('.btn-qb').addEventListener('click', () => {
  const btn = document.querySelector('.btn-qb');
  btn.textContent = 'Checking...';
  setTimeout(() => {
    btn.textContent = 'Check Availability';
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
  }, 1000);
});

// ─── PERFORMANCE: Lazy load images via IntersectionObserver ───
if ('IntersectionObserver' in window) {
  const lazyBgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.bg) {
          el.style.backgroundImage = `url('${el.dataset.bg}')`;
          lazyBgObserver.unobserve(el);
        }
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('[data-bg]').forEach(el => lazyBgObserver.observe(el));
}

// ─── CONSOLE BRANDING ────────────────────────────────────────
console.log('%c✦ The Grand Aurum ✦', 'font-size:24px;color:#c9a84c;font-family:Georgia,serif;font-style:italic');
console.log('%cLuxury Hotel Website — Built with precision.', 'font-size:12px;color:#888');
