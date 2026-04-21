// ===== 3D FOOD CAROUSEL =====
(function() {
  const carousel = document.getElementById('foodCarousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.food-slide'));
  const dots = Array.from(document.querySelectorAll('.cdot'));
  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  const posMap = {
    '-2': 'left2',
    '-1': 'left1',
    '0':  'center',
    '1':  'right1',
    '2':  'right2',
  };

  function render() {
    slides.forEach((slide, i) => {
      let offset = i - current;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;
      const pos = posMap[String(offset)];
      slide.dataset.pos = pos || (offset > 0 ? 'hidden-right' : 'hidden-left');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { current = (current + 1) % total; render(); }
  function prev() { current = (current - 1 + total) % total; render(); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 2800);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const pos = slide.dataset.pos;
      if (pos === 'right1' || pos === 'right2') { next(); stopAuto(); startAuto(); }
      if (pos === 'left1' || pos === 'left2')  { prev(); stopAuto(); startAuto(); }
    });
  });

  dots.forEach((d, i) => {
    d.addEventListener('click', () => { current = i; render(); stopAuto(); startAuto(); });
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); stopAuto(); startAuto(); }
  });

  render();
  startAuto();
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar && window.scrollY > 60) navbar.classList.add('scrolled');
  else if (navbar) navbar.classList.remove('scrolled');
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Menu tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// Gallery filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentImgs = [];
let currentIdx = 0;

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visibleItems = [...galleryItems].filter(it => !it.classList.contains('hidden'));
    currentImgs = visibleItems.map(it => it.querySelector('img').src);
    currentIdx = visibleItems.indexOf(item);
    if (lightbox && lightboxImg) {
      lightboxImg.src = currentImgs[currentIdx];
      lightbox.classList.add('active');
    }
  });
});

const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
  currentIdx = (currentIdx - 1 + currentImgs.length) % currentImgs.length;
  lightboxImg.src = currentImgs[currentIdx];
});
if (lightboxNext) lightboxNext.addEventListener('click', () => {
  currentIdx = (currentIdx + 1) % currentImgs.length;
  lightboxImg.src = currentImgs[currentIdx];
});
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });

// 3D Mouse Tilt Effect
function initTilt() {
  // Apply tilt to cards only, not large section images
  const tiltElements = document.querySelectorAll('.food-img-wrap, .menu-card-img, .gallery-item, .menu-item-img');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (centerY - y) / 10;
      const rotateY = (x - centerX) / 10;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// Parallax Scroll Effect
function initParallax() {
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.page-hero').forEach(bg => {
      const scrolled = window.pageYOffset;
      const offset = bg.offsetTop;
      
      // Only apply parallax when the element is near the viewport
      if (scrolled + window.innerHeight > offset && scrolled < offset + bg.offsetHeight) {
        const speed = 0.4;
        const yPos = -((scrolled - offset) * speed);
        bg.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
      }
    });
  });
}

function initSpotlight() {
  const eliteBanner = document.querySelector('.elite-banner');
  const eliteOverlay = document.querySelector('.elite-overlay');
  
  if (eliteBanner && eliteOverlay) {
    eliteBanner.addEventListener('mousemove', (e) => {
      const rect = eliteBanner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update BOTH for maximum compatibility
      eliteBanner.style.setProperty('--x', `${x}px`);
      eliteBanner.style.setProperty('--y', `${y}px`);
      eliteOverlay.style.setProperty('--x', `${x}px`);
      eliteOverlay.style.setProperty('--y', `${y}px`);
    });
    
    // Reset spotlight when mouse leaves
    eliteBanner.addEventListener('mouseleave', () => {
      eliteBanner.style.setProperty('--x', `-1000px`);
      eliteBanner.style.setProperty('--y', `-1000px`);
      eliteOverlay.style.setProperty('--x', `-1000px`);
      eliteOverlay.style.setProperty('--y', `-1000px`);
    });
  }
}

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      if (entry.target.classList.contains('reveal-up')) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    }
  });
}, { 
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Apply universal float to some images, and reveal to all images
document.querySelectorAll('img:not(.logo-img)').forEach(img => {
  if (!img.closest('.about-image') && !img.closest('.approach-image') && !img.closest('.events-image')) {
    img.classList.add('floating-anim');
  }
  
  // also add reveal effect to the image parent if it doesn't have it
  if(img.parentElement && !img.parentElement.classList.contains('food-slide')) {
    img.parentElement.classList.add('reveal-up');
  }
});

// Add scroll text color effect to section titles
document.querySelectorAll('.section-title').forEach(title => {
  title.classList.add('text-reveal-color');
});

document.querySelectorAll('.menu-card, .value-card, .menu-item, .gallery-item, .img-animate, .section-header, .feature-item, .reveal-up, .reveal-left, .reveal-right, .menu-item-card, .timeline-item, .menu-item-img, .text-reveal-color, .reveal-stagger').forEach(el => {
  if (!el.classList.contains('reveal')) {
    revealObserver.observe(el);
  }
});

// Initialize all premium effects
window.addEventListener('DOMContentLoaded', () => {
  // Cinematic Splash Logic
  const splash = document.getElementById('splash-screen');
  const isSplashShown = sessionStorage.getItem('splashShown');

  if (splash) {
    if (!isSplashShown) {
      // First time in this session - show the animation
      setTimeout(() => {
        splash.style.opacity = '0';
        document.body.classList.remove('loading');
        sessionStorage.setItem('splashShown', 'true');
        setTimeout(() => splash.remove(), 800);
      }, 2800);
    } else {
      // Already shown in this session (refresh or navigation) - skip the intro completely
      splash.style.display = 'none';
      splash.remove();
      document.body.classList.remove('loading');
    }
  }

  initTilt();
  initParallax();
  initSpotlight();

  // Staggered reveal for menu list
  document.querySelectorAll('.menu-list').forEach(list => {
    const items = list.querySelectorAll('.menu-item-card');
    items.forEach((item, idx) => {
      item.style.transitionDelay = `${idx * 0.1}s`;
    });
  });

  // Initial reveal trigger for elements already in view
  setTimeout(() => {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .menu-item-card, .timeline-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('reveal');
      }
    });
  }, 200);
});
