/* =============================================
   BARSHA SITOULA — Portfolio Scripts
   ============================================= */

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(0,212,255,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(0,212,255,0.5)';
  });
});


// ---- Canvas Background (Animated Grid + Particles) ----
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1,
  }));
}

function drawGrid() {
  const gap = 80;
  ctx.strokeStyle = 'rgba(0,212,255,0.035)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += gap) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += gap) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
    ctx.fill();
  });
}

function connectParticles() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const alpha = (1 - dist / maxDist) * 0.08;
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function renderCanvas() {
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  connectParticles();
  drawParticles();
  requestAnimationFrame(renderCanvas);
}

window.addEventListener('resize', resize);
resize();
renderCanvas();


// ---- Navbar Scroll ----
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ---- Mobile Menu ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  navToggle.style.transform = menuOpen ? 'rotate(90deg)' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    navToggle.style.transform = '';
  });
});


// ---- Typed Title ----
const titles = [
  'Java Developer',
  'Backend Engineer',
  'Cloud Architect',
  'Kafka Enthusiast',
  'Microservices Expert',
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedTitle');

function typeTitle() {
  const current = titles[titleIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      setTimeout(typeTitle, 400);
      return;
    }
    setTimeout(typeTitle, 60);
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeTitle, 2200);
      return;
    }
    setTimeout(typeTitle, 90);
  }
}
setTimeout(typeTitle, 1200);


// ---- Counter Animation ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// Trigger counters on first intersection with hero stats
const statsSection = document.querySelector('.hero-stats');
let countersFired = false;
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersFired) {
      countersFired = true;
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsSection);
}


// ---- Scroll Reveal: skill cards ----
const skillCards = document.querySelectorAll('.skill-card');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
skillCards.forEach(card => skillObs.observe(card));


// ---- Scroll Reveal: timeline items ----
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = parseInt(entry.target.dataset.index || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 150);
      timelineObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
timelineItems.forEach(item => timelineObs.observe(item));


// ---- Scroll Reveal: generic .obs-fade elements ----
const fadels = document.querySelectorAll('.obs-fade');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
fadels.forEach(el => fadeObs.observe(el));


// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
  });
});