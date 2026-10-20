// Confectionery Halo-Halo | script.js
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// 1) Mobile navigation menu
const menuBtn = $('.menu-btn'), menu = $('#menu');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }
  });
}

// 2) Dark / light mode
const root = document.documentElement, themeBtn = $('#theme-btn');
try { const saved = localStorage.getItem('theme'); if (saved) root.dataset.theme = saved; } catch (e) {}
function isDark() {
  return root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}
function paintThemeBtn() { if (themeBtn) themeBtn.textContent = isDark() ? '☀️' : '🌙'; }
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintThemeBtn();
  });
  paintThemeBtn();
}

// 3) Image slideshow
const slides = $$('.slide');
if (slides.length) {
  let cur = 0;
  const dotBox = $('.dots');
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    d.addEventListener('click', () => show(i));
    dotBox.appendChild(d);
    return d;
  });
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === cur));
    dots.forEach((d, n) => d.classList.toggle('on', n === cur));
  }
  $('.prev').addEventListener('click', () => show(cur - 1));
  $('.next').addEventListener('click', () => show(cur + 1));
  show(0);
}

// 4) Product popup
const dlg = $('#popup');
if (dlg) {
  $$('[data-popup]').forEach((btn) => btn.addEventListener('click', () => {
    const card = btn.closest('.pcard');
    $('#pop-img').src = card.querySelector('img').src;
    $('#pop-img').alt = card.querySelector('img').alt;
    $('#pop-name').textContent = card.querySelector('h3').textContent;
    $('#pop-desc').textContent = card.querySelector('p').textContent;
    $('#pop-price').textContent = card.querySelector('.price').textContent;
    dlg.showModal();
  }));
  $('#pop-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
}

// 5) "View more" button (gallery)
const moreBtn = $('#more-btn');
if (moreBtn) {
  moreBtn.addEventListener('click', () => {
    const items = $$('.more');
    const show = items[0].classList.contains('hidden');
    items.forEach((i) => i.classList.toggle('hidden', !show));
    moreBtn.textContent = show ? 'Show less' : 'View more';
  });
}

// 6) FAQ accordion
$$('.faq-q').forEach((q) => q.addEventListener('click', () => {
  const open = q.getAttribute('aria-expanded') === 'true';
  q.setAttribute('aria-expanded', !open);
  q.nextElementSibling.hidden = open;
}));

// 7) Contact form validation
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email, msg = form.elements.message;
    let ok = true;
    function check(field, good, text) {
      field.classList.toggle('invalid', !good);
      field.nextElementSibling.textContent = good ? '' : text;
      if (!good) ok = false;
    }
    check(name, name.value.trim().length >= 2, 'Please enter your name.');
    check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Please enter a valid email.');
    check(msg, msg.value.trim().length >= 10, 'Your message needs at least 10 characters.');
    $('#form-msg').textContent = ok ? 'Looks good, ' + name.value.trim() + '! (This is a demo form. It does not send emails yet.)' : '';
    if (ok) form.reset();
  });
}
