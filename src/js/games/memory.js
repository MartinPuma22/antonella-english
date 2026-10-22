import { el, pick, shuffle, cap, wordImage } from '../core/utils.js';

export default {
  id: 'memory', icon: '🃏', title: 'Memoria',
  mount(root, app) {
    let open = [], done, moves, deck;

    function start() {
      const words = pick(app.vocab, 6);
      deck = shuffle(words.flatMap(w => [{ w, kind: 'img' }, { w, kind: 'txt' }]));
      open = []; done = 0; moves = 0; draw();
    }

    function draw() {
      root.replaceChildren();
      const counter = el('b', {}, '0');
      const cards = el('div', { class: 'cards' });
      deck.forEach(d => {
        const front = el('div', { class: 'face front' }, d.kind === 'img' ? wordImage(d.w) : cap(d.w.en));
        const card = el('button', { class: 'mcard', 'aria-label': 'Carta' },
          el('div', { class: 'in' }, el('div', { class: 'face back' }, '🌸'), front));
        card.onclick = () => {
          if (open.length === 2 || card.classList.contains('flip') || card.classList.contains('match')) return;
          card.classList.add('flip'); open.push({ d, card }); app.sfx();
          if (d.kind === 'txt') app.say(d.w.en);
          if (open.length < 2) return;
          counter.textContent = ++moves;
          const [a, b] = open;
          if (a.d.w === b.d.w && a.d.kind !== b.d.kind) {
            setTimeout(() => {
              [a, b].forEach(x => x.card.classList.replace('flip', 'match'));
              open = []; app.sfx('ok'); app.addStars(1); app.toast(`${cap(a.d.w.en)} = ${a.d.w.es}`);
              if (++done === 6) { app.sfx('win'); app.addStars(3); app.toast('¡Memoria de campeona! 🎉'); }
            }, 500);
          } else setTimeout(() => { [a, b].forEach(x => x.card.classList.remove('flip')); open = []; app.sfx('no'); }, 900);
        };
        cards.append(card);
      });
      root.append(el('div', { class: 'panel' },
        el('h2', {}, 'Memoria'),
        el('p', { class: 'sub' }, 'Une cada dibujo con su palabra en inglés. Intentos: ', counter),
        cards,
        el('div', { class: 'row', style: 'justify-content:center;margin-top:16px' },
          el('button', { class: 'btn', onclick: start }, 'Jugar de nuevo'))));
    }
    start();
  },
};
