'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Menú hamburguesa
const burger = $('#burger'), menu = $('#menu');
const toggleMenu = open => {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.closest('a')) toggleMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// Cambio de color de acento
const root = document.documentElement;
const setAccent = a => {
  root.dataset.accent = a;
  try { localStorage.setItem('accent', a); } catch (_) {}
};
try { setAccent(localStorage.getItem('accent') || 'magenta'); } catch (_) {}
$$('.swatches button').forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));

// Texto que se escribe solo
const phrases = ['programador aprendiz', 'fan del rock', 'gamer', 'matemático curioso', 'amante del inglés'];
let p = 0, c = 0, del = false;
const typed = $('#typed');
(function type() {
  const word = phrases[p];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 45 : 90);
})();

// Barras de habilidades (casillas, sin porcentajes)
const MAX = 5;
const LEVELS = ['Básico', 'Elemental', 'Intermedio', 'Intermedio alto', 'Avanzado'];
$$('.skill').forEach(s => {
  const meter = $('.meter', s);
  const level = +s.dataset.level;
  $('.rank', s).textContent = LEVELS[level - 1];
  meter.setAttribute('role', 'img');
  meter.setAttribute('aria-label', `Nivel ${level} de ${MAX}`);
  for (let i = 0; i < MAX; i++) meter.appendChild(document.createElement('i'));
});
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const s = en.target;
  $$('.meter i', s).slice(0, +s.dataset.level).forEach((b, i) => setTimeout(() => b.classList.add('on'), i * 180));
  io.unobserve(s);
}), { threshold: .6 });
$$('.skill').forEach(s => io.observe(s));

// Cards de proyectos
$$('.project').forEach(card => {
  const flip = () => card.setAttribute('aria-expanded', card.getAttribute('aria-expanded') !== 'true');
  card.addEventListener('click', flip);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
});

// Formulario con validación en tiempo real
const rules = {
  name: v => v.trim().length >= 3 || 'Escribe al menos 3 caracteres.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Escribe un correo válido, como nombre@correo.com.',
  msg: v => v.trim().length >= 10 || 'Cuéntame un poco más (mínimo 10 caracteres).'
};
const form = $('#form'), status = $('#status');
const check = id => {
  const input = $('#' + id), field = input.closest('.field');
  const res = rules[id](input.value);
  const ok = res === true;
  field.classList.toggle('valid', ok);
  field.classList.toggle('invalid', !ok);
  input.setAttribute('aria-invalid', !ok);
  $('#e-' + id).textContent = ok ? '' : res;
  return ok;
};
Object.keys(rules).forEach(id => $('#' + id).addEventListener('input', () => {
  check(id);
  if (id === 'msg') $('#count').textContent = `${$('#msg').value.length} / 500`;
}));
form.addEventListener('submit', e => {
  e.preventDefault();
  const valid = Object.keys(rules).map(check).every(Boolean);
  if (!valid) { status.style.color = '#ff8a8a'; status.textContent = 'Revisa los campos marcados.'; return; }
  const body = `${$('#msg').value}\n\nDe: ${$('#name').value} (${$('#email').value})`;
  location.href = `mailto:alexanderantunez740@gmail.com?subject=${encodeURIComponent('Mensaje desde tu portafolio')}&body=${encodeURIComponent(body)}`;
  status.style.color = '#3ddc84';
  status.textContent = '¡Mensaje listo! Se abrió tu app de correo para enviarlo.';
  form.reset();
  $$('.field').forEach(f => f.classList.remove('valid'));
  $('#count').textContent = '0 / 500';
});

// Dibujitos decorativos generados con el DOM
const S = (path, vb = 48) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
const icons = [
  S('<path d="M8 10h32v18c0 8-8 12-16 14C16 40 8 36 8 28z"/>'),                                   // púa de guitarra
  S('<rect x="4" y="14" width="40" height="22" rx="10"/><path d="M14 20v10M9 25h10"/><circle cx="32" cy="22" r="2"/><circle cx="37" cy="28" r="2"/>'), // control
  S('<path d="M18 36V10l20-4v26"/><circle cx="12" cy="36" r="6"/><circle cx="32" cy="32" r="6"/>'),  // notas
  S('<path d="M26 4 10 26h12l-4 18 20-24H26z"/>'),                                                 // rayo
  S('<path d="M24 4l6 13 14 2-10 10 3 14-13-7-13 7 3-14L4 19l14-2z"/>'),                          // estrella
  S('<path d="M16 14 6 24l10 10M32 14l10 10-10 10M28 8 20 40"/>'),                                // código
  S('<path d="M8 12h32M18 12c0 14-2 22-8 28M30 12c0 14 2 22 8 28"/>'),                            // pi
  S('<rect x="6" y="6" width="36" height="36" rx="6"/><path d="M16 24h16M24 16v16"/>'),           // más
  S('<path d="M24 42S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 25-18 25z"/>'),              // corazón vida
  S('<path d="M12 42V22a12 12 0 0 1 24 0v20M6 42h36M18 30v6M30 30v6"/>')                          // fantasma
];
const decor = $('#decor'), H = () => document.documentElement.scrollHeight;
const build = () => {
  decor.innerHTML = '';
  const total = Math.max(10, Math.round(H() / 380));
  for (let i = 0; i < total; i++) {
    decor.insertAdjacentHTML('beforeend', icons[i % icons.length]);
    const el = decor.lastElementChild;
    const left = i % 2 ? 2 + (i * 7) % 12 : 84 + (i * 5) % 12;
    el.style.cssText = `top:${(i / total) * 100}%;left:${left}%;width:${34 + (i * 13) % 40}px;animation-delay:${(i % 5) * -1.2}s`;
  }
};
build();
let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 300); });

$('#year').textContent = new Date().getFullYear();
