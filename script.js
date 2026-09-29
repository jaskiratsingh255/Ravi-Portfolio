/**
 * JASKIRAT SINGH — PORTFOLIO INTERACTIONS
 * Minimalist, fluid scroll triggers, accessible navigation, and micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Elements Selection ---
  const header = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const desktopLinks = document.querySelectorAll('.nav-links .nav-link:not(.nav-btn-cta)');
  const sections = document.querySelectorAll('section[id]');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailTextEl = document.getElementById('emailText');
  const revealElements = document.querySelectorAll('.reveal-scroll');
  const ambientOrbs = document.querySelectorAll('.ambient-orb');

  // --- 2. Scroll-Triggered Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. Navbar Scroll Elevation State ---
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Header shadow/blur state
    if (currentScrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy for active nav links
    let currentSectionId = '';
    const scrollPos = currentScrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- 4. Mobile Menu Navigation Drawer ---
  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    mobileDrawer.classList.add('open');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --- 5. Interactive Email Copy to Clipboard ---
  if (copyEmailBtn && emailTextEl) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyBtnText.textContent = 'Copied! ✓';
        copyEmailBtn.style.borderColor = '#10B981';
        copyEmailBtn.style.color = '#059669';

        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2400);
      } catch (err) {
        // Fallback for non-secure context or permissions
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyBtnText.textContent = 'Copied! ✓';
        setTimeout(() => {
          copyBtnText.textContent = 'Copy';
        }, 2400);
      }
    });
  }

  // --- 6. Subtle Parallax for Ambient Pastel Orbs (Desktop) ---
  if (window.matchMedia('(min-width: 1024px)').matches && ambientOrbs.length > 0) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 35;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 35;
    }, { passive: true });

    const animateAmbientGlow = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      ambientOrbs[0].style.transform = `translate(${currentX * 0.8}px, ${currentY * 0.8}px)`;
      ambientOrbs[1].style.transform = `translate(${-currentX * 0.9}px, ${-currentY * 0.9}px)`;
      ambientOrbs[2].style.transform = `translate(${currentX * 0.6}px, ${currentY * 0.6}px)`;

      requestAnimationFrame(animateAmbientGlow);
    };

    animateAmbientGlow();
  }

  // --- 7. Smooth Scroll Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight + 16;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
