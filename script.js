/* ============================================================
   THE HAVEN PLACE — JAVASCRIPT
   Handles: navbar scroll, hamburger menu, scroll reveal,
            form handling, and smooth interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const form      = document.getElementById('booking-form');

  /* ---------- 1. Navbar: Transparent → Dark on Scroll ---------- */
  const SCROLL_THRESHOLD = 80;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.remove('navbar--transparent');
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.add('navbar--transparent');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // Run once on load

  /* ---------- 2. Hamburger Menu ---------- */
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside tap
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ---------- 3. Scroll-Triggered Reveal (Intersection Observer) ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15,
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- 4. Stagger Reveal for Service Cards ---------- */
  const serviceCards = document.querySelectorAll('.service-card.reveal');

  serviceCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.1) + 's';
  });

  /* ---------- 5. Form Handling ---------- */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('form-submit');
      const originalText = submitBtn.textContent;

      // Simple visual feedback
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate submission (replace with actual API call)
      setTimeout(function () {
        submitBtn.textContent = 'Enquiry Sent ✓';
        submitBtn.style.background = '#2E7D32';
        submitBtn.style.borderColor = '#2E7D32';

        setTimeout(function () {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 2500);
      }, 1200);
    });
  }

  /* ---------- 6. Smooth Scroll Offset for Fixed Navbar ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ---------- 7. Active Nav Link Highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.pageYOffset;
    const navHeight = navbar.offsetHeight;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector('a[href="#' + id + '"]');

      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          link.style.color = '#B8860B';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- 8. Parallax-like Hero Fade on Scroll ---------- */
  const heroContent = document.querySelector('.hero__content');
  const heroScroll = document.querySelector('.hero__scroll');

  function heroParallax() {
    const scrollY = window.pageYOffset;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      const opacity = 1 - progress * 1.5;
      const translateY = scrollY * 0.3;

      if (heroContent) {
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = 'translateY(' + translateY + 'px)';
      }

      if (heroScroll) {
        heroScroll.style.opacity = Math.max(0, 1 - progress * 3);
      }
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ---------- 9. Initialize Lucide Icons ---------- */
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ---------- 10. Lightbox Modal ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxClose) {
    // Open lightbox on gallery item click
    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.style.cursor = 'pointer'; // Show pointer cursor on hover
      
      item.addEventListener('click', function () {
        const img = this.querySelector('img');
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.classList.add('lightbox-open'); // Locks scroll globally
        }
      });
    });

    // Close lightbox functions
    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on clicking overlay background
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ---------- 11. Image Download Prevention ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    // Disable right click context menu on image
    img.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    // Disable image dragging
    img.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });
  });

})();
