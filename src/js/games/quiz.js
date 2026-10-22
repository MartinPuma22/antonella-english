import { el, pick, shuffle, cap, wordImage } from '../core/utils.js';

export default {
  id: 'quiz', icon: '❓', title: '¿Qué es?',
  mount(root, app) {
    const TOTAL = 8; let q, score, order;

    function start() { order = pick(app.vocab, Math.min(TOTAL, app.vocab.length)); q = 0; score = 0; ask(); }

    function ask() {
      if (q >= order.length) return end();
      const w = order[q];
      const opts = shuffle([w, ...pick(app.vocab.filter(x => x !== w), 3)]);
      const msg = el('p', { class: 'msg' }, '\u00a0');
      const btns = opts.map(o => {
        const b = el('button', { class: 'opt' }, cap(o.en));
        b.onclick = () => {
          btns.forEach(x => (x.disabled = true));
          app.say(w.en);
          if (o === w) { b.classList.add('right'); score++; app.sfx('ok'); app.addStars(1); msg.textContent = `¡Correcto! ${cap(w.en)} = ${w.es}`; }
          else { b.classList.add('wrong'); btns[opts.indexOf(w)].classList.add('right'); app.sfx('no'); msg.textContent = `Era ${cap(w.en)} = ${w.es}`; }
          setTimeout(() => { q++; ask(); }, 1600);
        };
        return b;
      });
      root.replaceChildren(el('div', { class: 'panel center' },
        el('h2', {}, '¿Cómo se dice en inglés?'),
        el('p', { class: 'sub' }, `Pregunta ${q + 1} de ${order.length}`),
        el('div', { class: 'big' }, wordImage(w)),
        el('p', { class: 'es' }, w.es),
        el('div', { class: 'opts' }, btns), msg));
    }

    function end() {
      app.sfx('win'); if (score >= order.length - 1) app.addStars(3);
      root.replaceChildren(el('div', { class: 'panel center' },
        el('h2', {}, '¡Terminaste! 🎉'),
        el('p', { class: 'sub' }, `Acertaste ${score} de ${order.length}`),
        el('button', { class: 'btn', onclick: start }, 'Jugar otra vez')));
    }
    start();
  },
};
