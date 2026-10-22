import { el, pick, shuffle, cap, wordImage } from '../core/utils.js';

export default {
  id: 'scramble', icon: '✏️', title: 'Ordena la palabra',
  mount(root, app) {
    let list, i, score;

    function start() { list = pick(app.vocab, 5); i = 0; score = 0; round(); }

    function round() {
      if (i >= list.length) return end();
      const w = list[i], answer = [];
      const letters = shuffle([...w.en].map((ch, k) => ({ ch, k })));
      const slots = el('div', { class: 'slots' }), bank = el('div', { class: 'bank' }), msg = el('p', { class: 'msg' }, '\u00a0');

      function render() {
        slots.replaceChildren(...[...w.en].map((_, n) => {
          const a = answer[n];
          const s = el('button', { class: 'slot' }, a ? a.ch : '');
          if (a) s.onclick = () => { answer.splice(n, 1); app.sfx(); render(); };
          return s;
        }));
        bank.replaceChildren(...letters.map(l => {
          const b = el('button', { class: 'let' }, l.ch);
          b.disabled = answer.includes(l);
          b.onclick = () => { answer.push(l); app.sfx(); render(); check(); };
          return b;
        }));
      }
      function check() {
        if (answer.length < w.en.length) return;
        if (answer.map(a => a.ch).join('') === w.en) {
          slots.querySelectorAll('.slot').forEach(s => s.classList.add('ok', 'bounce'));
          msg.textContent = `¡Muy bien! ${cap(w.en)} = ${w.es}`; app.sfx('ok'); app.say(w.en); app.addStars(2); score++;
          setTimeout(() => { i++; round(); }, 1700);
        } else { msg.textContent = 'Casi... toca una letra para quitarla e intenta otra vez'; app.sfx('no'); }
      }
      render();
      root.replaceChildren(el('div', { class: 'panel center' },
        el('h2', {}, 'Ordena la palabra'),
        el('p', { class: 'sub' }, `Palabra ${i + 1} de ${list.length}`),
        el('div', { class: 'big' }, wordImage(w)),
        el('p', {}, 'En español: ', el('b', {}, w.es)),
        slots, bank, msg,
        el('button', { class: 'btn ghost', onclick: () => app.say(w.en) }, '🔊 Escuchar')));
    }

    function end() {
      app.sfx('win'); app.addStars(3);
      root.replaceChildren(el('div', { class: 'panel center' },
        el('h2', {}, '¡Excelente, Antonella! 🌟'),
        el('p', { class: 'sub' }, `Armaste ${score} palabras`),
        el('button', { class: 'btn', onclick: start }, 'Jugar otra vez')));
    }
    start();
  },
};
