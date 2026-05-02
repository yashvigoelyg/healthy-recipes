// ═══════ NAVBAR SCROLL EFFECT ═══════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════ MOBILE TOGGLE ═══════
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ═══════ ACTIVE NAV LINK ON SCROLL ═══════
const sections = document.querySelectorAll('section[id]');
const navItems = navLinks.querySelectorAll('a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = navLinks.querySelector(`a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ═══════ SCROLL ANIMATIONS ═══════
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

animatedElements.forEach(el => observer.observe(el));

// ═══════ CONTACT FORM ═══════
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Reset message
  formMsg.className = 'form-msg';
  formMsg.textContent = '';

  // Validate
  if (!name || !email || !message) {
    formMsg.className = 'form-msg form-msg--error';
    formMsg.textContent = 'Please complete all fields before submitting.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMsg.className = 'form-msg form-msg--error';
    formMsg.textContent = 'Please enter a valid email address.';
    return;
  }

  // Success
  formMsg.className = 'form-msg form-msg--success';
  formMsg.textContent = `Thank you, ${name}! Your message has been received successfully. We will respond shortly.`;
  contactForm.reset();

  setTimeout(() => {
    formMsg.className = 'form-msg';
    formMsg.textContent = '';
  }, 6000);
});

// ═══════ SMOOTH SCROLL FOR ALL ANCHOR LINKS ═══════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
