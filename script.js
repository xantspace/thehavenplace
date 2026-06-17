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

  /* ---------- 10. Lightbox Modal with Zoom & Pan ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const zoomContainer = document.getElementById('lightbox-zoom-container');

  if (lightbox && lightboxImg && lightboxClose && zoomContainer) {
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    // For pinch-to-zoom
    let initialDistance = 0;
    let initialScale = 1;
    let touchCenterX = 0;
    let touchCenterY = 0;
    
    // Double tap/click toggle trigger time
    let lastTapTime = 0;

    // Apply scaling and translations
    function applyTransform() {
      // Limit translation boundaries so the user doesn't drag the image off-screen
      if (scale === 1) {
        translateX = 0;
        translateY = 0;
        zoomContainer.classList.remove('zoom-active');
      } else {
        zoomContainer.classList.add('zoom-active');
        // Calculate max bounds based on scaled size
        const rect = lightboxImg.getBoundingClientRect();
        const parentRect = zoomContainer.getBoundingClientRect();
        
        const maxW = Math.max(0, (rect.width - parentRect.width) / 2);
        const maxH = Math.max(0, (rect.height - parentRect.height) / 2);
        
        // Clamp translations
        translateX = Math.max(-maxW, Math.min(maxW, translateX));
        translateY = Math.max(-maxH, Math.min(maxH, translateY));
      }
      
      lightboxImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
    }

    // Reset Zoom
    function resetZoom() {
      scale = 1;
      translateX = 0;
      translateY = 0;
      lightboxImg.style.transition = 'transform 0.3s ease-out';
      applyTransform();
      setTimeout(function () {
        if (lightboxImg) lightboxImg.style.transition = 'none';
      }, 300);
    }

    // Mouse / Touch Drag events for Panning
    function startDrag(clientX, clientY) {
      if (scale > 1) {
        isDragging = true;
        startX = clientX - translateX;
        startY = clientY - translateY;
        lightboxImg.style.transition = 'none';
      }
    }

    function doDrag(clientX, clientY) {
      if (!isDragging) return;
      translateX = clientX - startX;
      translateY = clientY - startY;
      applyTransform();
    }

    function stopDrag() {
      isDragging = false;
    }

    // Mouse listeners
    zoomContainer.addEventListener('mousedown', function (e) {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', function (e) {
      if (isDragging) {
        doDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', function () {
      stopDrag();
    });

    // Touch events for Pan & Pinch
    zoomContainer.addEventListener('touchstart', function (e) {
      lightboxImg.style.transition = 'none';
      if (e.touches.length === 1) {
        // Single touch -> Pan
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
      } else if (e.touches.length === 2) {
        // Multi-touch -> Pinch
        isDragging = false; 
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        initialScale = scale;
        
        // Calculate center of the two touches
        touchCenterX = (touch1.clientX + touch2.clientX) / 2;
        touchCenterY = (touch1.clientY + touch2.clientY) / 2;
      }
    });

    zoomContainer.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        doDrag(touch.clientX, touch.clientY);
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        if (initialDistance > 0) {
          const factor = currentDistance / initialDistance;
          scale = Math.max(1, Math.min(4, initialScale * factor));
          applyTransform();
        }
      }
    });

    zoomContainer.addEventListener('touchend', function (e) {
      if (e.touches.length === 0) {
        stopDrag();
        initialDistance = 0;
      }
    });

    // Mouse wheel zoom centered on cursor
    zoomContainer.addEventListener('wheel', function (e) {
      e.preventDefault();
      
      const zoomFactor = 1.15;
      const oldScale = scale;
      
      lightboxImg.style.transition = 'none';
      
      if (e.deltaY < 0) {
        scale = Math.min(4, scale * zoomFactor);
      } else {
        scale = Math.max(1, scale / zoomFactor);
      }

      if (scale > 1 && scale !== oldScale) {
        const rect = zoomContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        translateX -= mouseX * (scale / oldScale - 1);
        translateY -= mouseY * (scale / oldScale - 1);
      }
      
      applyTransform();
    }, { passive: false });

    // Double tap / Double click to zoom toggle (2.5x zoom or back to 1x)
    function handleDoubleTap(clientX, clientY) {
      if (scale > 1) {
        resetZoom();
      } else {
        scale = 2.5;
        lightboxImg.style.transition = 'transform 0.3s ease-out';
        
        const rect = zoomContainer.getBoundingClientRect();
        const clickX = clientX - rect.left - rect.width / 2;
        const clickY = clientY - rect.top - rect.height / 2;
        
        translateX = -clickX * (scale - 1);
        translateY = -clickY * (scale - 1);
        
        applyTransform();
        setTimeout(function () {
          if (lightboxImg) lightboxImg.style.transition = 'none';
        }, 300);
      }
    }

    // Double click listener
    zoomContainer.addEventListener('dblclick', function (e) {
      handleDoubleTap(e.clientX, e.clientY);
    });

    // Double tap listener for mobile
    zoomContainer.addEventListener('touchend', function (e) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      
      if (tapLength < 300 && tapLength > 0) {
        const touch = e.changedTouches[0];
        handleDoubleTap(touch.clientX, touch.clientY);
        e.preventDefault(); 
      }
      lastTapTime = currentTime;
    });

    // Open lightbox on gallery item click
    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.style.cursor = 'pointer'; 
      
      item.addEventListener('click', function () {
        const img = this.querySelector('img');
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.classList.add('lightbox-open'); 
          resetZoom(); // Always open at standard 1x scale
        }
      });
    });

    // Close lightbox functions
    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      resetZoom();
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on clicking overlay background (only close if not zoomed in)
    lightbox.addEventListener('click', function (e) {
      if (scale === 1 && (e.target === lightbox || e.target === zoomContainer || e.target === lightbox.querySelector('.lightbox__content'))) {
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
