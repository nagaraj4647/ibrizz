// ===== 3D FOOD CAROUSEL =====
(function() {
  const carousel = document.getElementById('foodCarousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.food-slide'));
  const dots = Array.from(document.querySelectorAll('.cdot'));
  const total = slides.length;
  let current = 0;
  let autoTimer = null;

  // positions relative to center index offset
  // offset: -2, -1, 0, +1, +2, rest hidden
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
      // wrap around
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

  // Click on side slides to navigate
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const pos = slide.dataset.pos;
      if (pos === 'right1' || pos === 'right2') { next(); stopAuto(); startAuto(); }
      if (pos === 'left1' || pos === 'left2')  { prev(); stopAuto(); startAuto(); }
    });
  });

  // Dots
  dots.forEach((d, i) => {
    d.addEventListener('click', () => { current = i; render(); stopAuto(); startAuto(); });
  });

  // Touch/swipe
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
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
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
  const tiltElements = document.querySelectorAll('.about-image, .approach-image, .food-img-wrap, .menu-card-img, .gallery-item, .events-image');
  
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
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.page-hero, .elite-banner').forEach(bg => {
      const speed = 0.4;
      bg.style.backgroundPositionY = -(scrolled * speed) + 'px';
    });
  });
}

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
    }
  });
}, { 
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.menu-card, .value-card, .menu-item, .gallery-item, .img-animate, .section-header, .feature-item').forEach(el => {
  if (!el.classList.contains('img-animate')) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
  }
  revealObserver.observe(el);
});

// Initialize all premium effects
window.addEventListener('DOMContentLoaded', () => {
  initTilt();
  initParallax();
  
  // Initial reveal trigger
  setTimeout(() => {
    document.querySelectorAll('.menu-card, .value-card, .menu-item, .gallery-item, .img-animate, .section-header').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('reveal');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }, 100);
});
