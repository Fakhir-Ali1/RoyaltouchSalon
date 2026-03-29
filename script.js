/* ════════════════════════════════════════
   ROYAL TOUCH HAIR SALON — script.js
   ════════════════════════════════════════ */

'use strict';

// ─── HEADER SCROLL ───────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── FADE-IN INTERSECTION OBSERVER ──────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within grids
      const delay = entry.target.closest('.services-grid, .pricing-grid, .gallery-grid')
        ? [...entry.target.parentElement.children].indexOf(entry.target) * 100
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// ─── SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a:not(.nav-cta)');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));

// ─── CONTACT FORM SUBMISSION ─────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        formSuccess.style.display = 'flex';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      alert('Something went wrong. Please try WhatsApp or email us directly.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ─── GALLERY ITEMS HOVER EFFECT ──────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.zIndex = '2';
  });
  item.addEventListener('mouseleave', () => {
    item.style.zIndex = '';
  });
});

// ─── FLOATING WHATSAPP PULSE ─────────────────────────────────
const floatingWA = document.querySelector('.whatsapp-float');
if (floatingWA) {
  // Subtle pulse animation injected via JS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waPulse {
      0% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.4); }
      70% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 12px rgba(37,211,102,0); }
      100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0); }
    }
    .whatsapp-float { animation: waPulse 2.4s ease-in-out infinite; }
    .whatsapp-float:hover { animation: none; }
  `;
  document.head.appendChild(style);
}

// ─── HERO PARALLAX (subtle) ──────────────────────────────────
const heroOrb1 = document.querySelector('.hero-orb-1');
const heroOrb2 = document.querySelector('.hero-orb-2');

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  if (heroOrb1) heroOrb1.style.transform = `translate(${x}px, ${y}px)`;
  if (heroOrb2) heroOrb2.style.transform = `translate(${-x}px, ${-y}px)`;
}, { passive: true });

// ─── PRICING CARD HOVER GLOW ──────────────────────────────────
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,169,110,0.07), var(--dark-3) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ─── SET MIN DATE FOR DATETIME INPUT ─────────────────────────
const datetimeInput = document.getElementById('datetime');
if (datetimeInput) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  datetimeInput.min = now.toISOString().slice(0, 16);
}
