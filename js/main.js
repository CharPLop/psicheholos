// === NAVIGATION ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
}

// === SCROLL REVEAL ===
try {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
} catch (e) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Safety net: force show after 2s
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 2000);

// === FAQ ACCORDION ===
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.toggle('open');
  answer.classList.toggle('open', isOpen);
}

// === COOKIE BANNER ===
setTimeout(() => {
  try {
    if (!localStorage.getItem('cookies_accepted')) {
      document.getElementById('cookieBanner').classList.add('show');
    }
  } catch (e) {}
}, 2000);

function acceptCookies() {
  try { localStorage.setItem('cookies_accepted', 'true'); } catch (e) {}
  document.getElementById('cookieBanner').classList.remove('show');
}

// === CONTACT FORM (Web3Forms) ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        try { gtag('event', 'form_success', { event_category: 'contatto' }); } catch (e) {}
      }
    })
    .catch(() => {
      alert("Errore nell'invio. Riprova o contattaci su WhatsApp.");
    });
  });
}
