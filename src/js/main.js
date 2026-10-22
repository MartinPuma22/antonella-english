import { CONFIG } from './config.js';
import { VOCAB } from './data/vocabulary.js';
import { GAMES } from './games/index.js';
import { $, el } from './core/utils.js';
import { sfx, say, toggleMusic } from './core/audio.js';

let stars = Number(localStorage.getItem('stars') || 0);
let toastTimer;

const app = {
  vocab: VOCAB, config: CONFIG, sfx, say,
  addStars(n) { stars += n; localStorage.setItem('stars', stars); $('#starCount').textContent = stars; },
  toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
  },
};

$('#studentName').textContent = CONFIG.student;
$('#starCount').textContent = stars;

// Navegación entre juegos (sin cambiar de página)
const tabs = $('#tabs'), stage = $('#stage');
function open(id) {
  const g = GAMES.find(x => x.id === id) || GAMES[0];
  [...tabs.children].forEach(t => t.setAttribute('aria-selected', t.dataset.id === g.id));
  stage.replaceChildren(); g.mount(stage, app);
  history.replaceState(null, '', `#${g.id}`);
}
GAMES.forEach(g => tabs.append(el('button', { class: 'tab', 'data-id': g.id, role: 'tab', onclick: () => { sfx(); open(g.id); } }, `${g.icon} ${g.title}`)));

// Botones de cabecera
$('#btnTranslate').onclick = e => {
  const on = document.body.classList.toggle('show-es');
  e.currentTarget.setAttribute('aria-pressed', on);
  e.currentTarget.textContent = on ? '🇪🇸 Ocultar traducciones' : '🇪🇸 Ver traducciones';
};
$('#btnMusic').onclick = e => e.currentTarget.setAttribute('aria-pressed', toggleMusic());

open(location.hash.slice(1));
