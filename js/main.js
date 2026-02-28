// ═══ PSICHE HOLOS — MAIN.JS ═══

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
function toggleNav() {
  var nav = document.getElementById('nav');
  nav.classList.toggle('nav-open');
  document.querySelector('.hamburger').classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('nav-open') ? 'hidden' : '';
}
function closeNav() {
  document.getElementById('nav').classList.remove('nav-open');
  document.querySelector('.hamburger').classList.remove('active');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function observeReveals() {
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
observeReveals();

// ── FAQ ──
function toggleFaq(btn) {
  const a = btn.nextElementSibling;
  const open = btn.classList.toggle('open');
  a.classList.toggle('open', open);
}

// ── COOKIES ──
setTimeout(() => {
  if (!localStorage.getItem('cookies_accepted')) {
    document.getElementById('cookieBanner').classList.add('show');
  }
}, 2000);
function acceptCookies() {
  localStorage.setItem('cookies_accepted', 'true');
  document.getElementById('cookieBanner').classList.remove('show');
}

// ── FORM ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(form);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', body: data
    }).then(r => r.json()).then(d => {
      if (d.success) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    }).catch(() => {
      alert('Errore nell\'invio. Prova con WhatsApp o email.');
    });
  });
}

// ═══ CMS LOADER ═══
async function loadCMS() {
  try {
    const res = await fetch('data/content.json');
    if (!res.ok) return;
    const d = await res.json();

    // Hero
    if (d.hero) {
      setText('cms-hero-badge', d.hero.badge);
      setHTML('cms-hero-titolo', d.hero.titolo.replace('Holos', '<em>Holos</em>'));
      setText('cms-hero-sottotitolo', d.hero.sottotitolo);
      setText('cms-hero-indirizzo', d.hero.indirizzo);
    }

    // Chi Siamo
    if (d.chi_siamo) {
      setHTML('cms-chi-titolo', d.chi_siamo.titolo);
      setText('cms-chi-testo', d.chi_siamo.testo);
      if (d.chi_siamo.valori && d.chi_siamo.valori.length) {
        const valori = document.getElementById('cms-chi-valori');
        if (valori) {
          valori.innerHTML = d.chi_siamo.valori.map((v, i) =>
            `<div class="chi-value reveal reveal-delay-${i+1}"><div class="chi-value-icon">${v.icona}</div><div><h4>${v.titolo}</h4><p>${v.testo}</p></div></div>`
          ).join('');
        }
      }
    }

    // Citazione
    if (d.citazione) setHTML('cms-citazione', d.citazione.replace(/\n/g, '<br>'));

    // Servizi
    if (d.servizi && d.servizi.length) {
      const grid = document.getElementById('cms-servizi');
      if (grid) {
        grid.innerHTML = d.servizi.map((s, i) =>
          `<div class="servizio-card reveal${i%3?' reveal-delay-'+(i%3):''}"><span class="servizio-icon">${s.icona}</span><h3>${s.titolo}</h3><p>${s.testo}</p></div>`
        ).join('');
      }
    }

    // Fasce
    if (d.fasce && d.fasce.length) {
      const row = document.getElementById('cms-fasce');
      if (row) {
        row.innerHTML = d.fasce.map(f =>
          `<div class="fascia"><span class="fascia-emoji">${f.emoji}</span><h4>${f.titolo}</h4><p>${f.testo}</p></div>`
        ).join('');
      }
    }

    // Team
    if (d.team && d.team.length) {
      const grid = document.getElementById('cms-team');
      if (grid) {
        grid.innerHTML = d.team.map((t, i) => {
          const initials = t.nome.split(' ').filter(w => w.length > 3).map(w => w[0]).join('').slice(0,2).toUpperCase();
          const photoHTML = t.foto ?
            `<div class="team-avatar has-photo"><img src="images/${t.foto}" class="team-photo" alt="${t.nome}"><span class="team-avatar-initial">${initials}</span></div>` :
            `<div class="team-avatar"><span class="team-avatar-initial">${initials}</span></div>`;
          const igName = t.instagram.replace('@','');
          const siteLink = t.sito_web ? `<a href="${t.sito_web}" target="_blank" class="team-action team-action-site">🌐 Sito Web</a>` : '';
          return `<div class="team-card reveal${i?' reveal-delay-'+i:''}">
            ${photoHTML}
            <div class="team-info">
              <h3>${t.nome}</h3>
              <span class="team-role">${t.ruolo}</span>
              <p>${t.bio}</p>
              <div class="team-actions">
                <a href="tel:${t.telefono}" class="team-action team-action-phone" onclick="trackPhone('${t.nome}')">📞 Chiama</a>
                <a href="https://wa.me/39${t.telefono}?text=${encodeURIComponent(t.whatsapp_msg)}" target="_blank" class="team-action team-action-wa" onclick="trackWhatsApp('${t.nome}')">💬 WhatsApp</a>
                <a href="https://www.instagram.com/${igName}/" target="_blank" class="team-action team-action-ig">📷 Instagram</a>
                ${siteLink}
              </div>
            </div>
          </div>`;
        }).join('');
      }
    }

    // Metodologie
    if (d.metodologie && d.metodologie.length) {
      const grid = document.getElementById('cms-metodo');
      if (grid) {
        grid.innerHTML = d.metodologie.map((m, i) =>
          `<div class="metodo-item reveal${i?' reveal-delay-'+i:''}"><h4>${m.icona} ${m.titolo}</h4><p>${m.testo}</p></div>`
        ).join('');
      }
    }

    // FAQ
    if (d.faq && d.faq.length) {
      const list = document.getElementById('cms-faq');
      if (list) {
        list.innerHTML = d.faq.map(f =>
          `<div class="faq-item reveal"><button class="faq-q" onclick="toggleFaq(this)">${f.domanda}</button><div class="faq-a">${f.risposta}</div></div>`
        ).join('');
      }
    }

    // Contatti - update WhatsApp links
    if (d.contatti) {
      const waFloat = document.querySelector('.wa-float');
      if (waFloat && d.contatti.whatsapp_msg) {
        waFloat.href = `https://wa.me/39${d.contatti.telefono_principale}?text=${encodeURIComponent(d.contatti.whatsapp_msg)}`;
      }
    }

    // Re-observe new elements
    observeReveals();

  } catch(e) {
    // JSON not available, HTML fallback is fine
    console.log('CMS: using HTML fallback');
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el && html) el.innerHTML = html;
}

// Load CMS content
loadCMS();
