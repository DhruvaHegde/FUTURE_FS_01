/* ================================================================
   DHRUVA HEGDE – PORTFOLIO WEBSITE
   script.js | All Interactivity
   ================================================================ */

'use strict';

/* -- THEME TOGGLE -- */
(function initThemeToggle() {
  const storageKey = 'dhruva-theme';
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');
  if (!body || !toggle) return;

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const savedTheme = localStorage.getItem(storageKey);
  const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }

  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  });
})();

/* ── TYPEWRITER EFFECT ── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'C Programmer',
    'Java Enthusiast',
    'Problem Solver',
    'VTU Engineer 2027',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER_WORD = 1800;
  const PAUSE_BEFORE_TYPE = 300;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE_TYPE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_WORD);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    }
  }

  setTimeout(tick, PAUSE_BEFORE_TYPE);
})();

/* ── NAVBAR: SCROLL & ACTIVE LINK ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Sticky style
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link highlight
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ── BACK TO TOP ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── MOBILE HAMBURGER MENU ── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── SCROLL REVEAL ANIMATION ── */
(function initScrollReveal() {
  const revealTargets = [
    '.skill-card',
    '.achievement-card',
    '.certificate-card',
    '.project-card',
    '.about-image-wrap',
    '.about-text',
    '.contact-info',
    '.contact-form',
    '.section-header',
  ];

  const elements = document.querySelectorAll(revealTargets.join(', '));

  elements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ── STAGGERED CARD ANIMATION ── */
(function initStagger() {
  const grids = [
    { selector: '.skills-grid .skill-card', delay: 80 },
    { selector: '.achievements-grid .achievement-card', delay: 100 },
    { selector: '.projects-grid .project-card', delay: 90 },
  ];

  grids.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((card, i) => {
      card.style.transitionDelay = `${i * delay}ms`;
    });
  });

  document.querySelectorAll('.certificates-grid .certificate-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 110}ms`;
  });
})();

/* ── CONTACT FORM VALIDATION & SUBMIT ── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email-input');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const msgError = document.getElementById('message-error');

  function setError(input, errorEl, msg) {
    errorEl.textContent = msg;
    if (msg) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function validate() {
    let valid = true;

    if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameError, 'Please enter your name (min 2 characters).');
      valid = false;
    } else {
      setError(nameInput, nameError, '');
    }

    if (!validateEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (messageInput.value.trim().length < 10) {
      setError(messageInput, msgError, 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setError(messageInput, msgError, '');
    }

    return valid;
  }

  // Live validation on blur
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate sending (replace with actual backend/EmailJS call)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    await new Promise((resolve) => setTimeout(resolve, 1400));

    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;

    successMsg.classList.add('show');
    form.reset();
    [nameInput, emailInput, messageInput].forEach((input) => input.classList.remove('error'));
    [nameError, emailError, msgError].forEach((el) => (el.textContent = ''));

    setTimeout(() => successMsg.classList.remove('show'), 5000);
  });
})();

/* ── SMOOTH HOVER TILT ON PROJECT CARDS ── */
(function initCardTilt() {
  document.querySelectorAll('.project-card:not(.add-card)').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── CERTIFICATE HOVER ZOOM / FRONT EFFECT ── */
(function initCertificateHover() {
  document.querySelectorAll('.certificate-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(1200px) translateY(-10px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
    });
  });
})();

/* ── SKILL CARD ICON COLOR CYCLE ── */
(function initSkillColors() {
  const colors = [
    '#6366f1', '#06b6d4', '#f59e0b',
    '#10b981', '#ec4899', '#8b5cf6',
    '#f97316', '#14b8a6',
  ];
  document.querySelectorAll('.skill-icon-wrap').forEach((wrap, i) => {
    const color = colors[i % colors.length];
    wrap.style.background = `${color}18`;
    wrap.style.borderColor = `${color}35`;
    wrap.querySelector('.skill-icon').style.color = color;
  });
})();

/* ── CURSOR GLOW EFFECT (subtle) ── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: top 0.15s ease, left 0.15s ease;
    top: -200px; left: -200px;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
})();

/* ── HERO ENTRANCE ANIMATION ── */
(function initHeroEntrance() {
  const elements = [
    { el: document.querySelector('.hero-badge'), delay: 100 },
    { el: document.querySelector('.hero-title'), delay: 250 },
    { el: document.querySelector('.hero-subtitle'), delay: 400 },
    { el: document.querySelector('.hero-desc'), delay: 550 },
    { el: document.querySelector('.hero-cta'), delay: 700 },
    { el: document.querySelector('.hero-socials'), delay: 850 },
    { el: document.querySelector('.hero-avatar'), delay: 200 },
  ];

  elements.forEach(({ el, delay }) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  });
})();

console.log('%c DH Portfolio ', 'background:#6366f1;color:#fff;font-size:14px;padding:4px 8px;border-radius:4px;font-weight:bold;', '| Built by Dhruva Hegde');
