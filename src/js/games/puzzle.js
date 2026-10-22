import { el } from '../core/utils.js';
import { CONFIG } from '../config.js';

export default {
  id: 'puzzle', icon: '🧩', title: 'Rompecabezas',
  mount(root, app) {
    let idx = 0, tiles, moves, board, counter;
    const pos = i => ({ left: `${(i % 3) * 33.333}%`, top: `${Math.floor(i / 3) * 33.333}%` });
    const cur = () => CONFIG.puzzles[idx];
    const url = () => `url(${CONFIG.paths.puzzles}/${cur().file})`;

    function neighbors(e) {
      const r = Math.floor(e / 3), c = e % 3, out = [];
      if (r > 0) out.push(e - 3); if (r < 2) out.push(e + 3);
      if (c > 0) out.push(e - 1); if (c < 2) out.push(e + 1);
      return out;
    }

    function shuffle() {
      tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8]; moves = 0;          // tiles[slot] = pieza
      let e = 8, prev = -1;
      for (let i = 0; i < 120; i++) {
        const opts = neighbors(e).filter(n => n !== prev);
        const n = opts[Math.floor(Math.random() * opts.length)];
        [tiles[e], tiles[n]] = [tiles[n], tiles[e]]; prev = e; e = n;
      }
      draw();
    }

    function draw() {
      board.classList.remove('solved'); board.replaceChildren();
      tiles.forEach((piece, slot) => {
        const t = el('div', { class: 'tile' + (piece === 8 ? ' empty' : ''), role: 'button' });
        Object.assign(t.style, pos(slot), {
          backgroundImage: url(), backgroundPosition: `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%` });
        t.onclick = () => move(slot);
        board.append(t);
      });
      counter.textContent = moves;
    }

    function move(slot) {
      const e = tiles.indexOf(8);
      if (!neighbors(e).includes(slot)) return app.sfx('no');
      [tiles[e], tiles[slot]] = [tiles[slot], tiles[e]]; moves++; app.sfx();
      draw();
      if (tiles.every((p, i) => p === i)) {
        board.classList.add('solved'); board.querySelector('.empty').style.visibility = 'visible';
        app.sfx('win'); app.addStars(5); app.say(cur().en);
        app.toast(`¡Lo lograste! ${cur().en} = ${cur().es} 🎉`);
      }
    }

    function build() {
      root.replaceChildren();
      board = el('div', { class: 'board' });
      counter = el('b', {}, '0');
      const thumb = el('div', { class: 'thumb' }); thumb.style.backgroundImage = url();
      root.append(el('div', { class: 'panel' },
        el('h2', {}, 'Rompecabezas'),
        el('p', { class: 'sub' }, 'Toca las piezas junto al espacio vacío para moverlas y armar la imagen completa.'),
        el('div', { class: 'layout' }, board,
          el('div', { class: 'side center' }, thumb,
            el('h3', {}, cur().en), el('p', { class: 'es', style: 'margin:0 0 10px' }, cur().es),
            el('p', {}, 'Movimientos: ', counter),
            el('div', { class: 'row', style: 'justify-content:center' },
              el('button', { class: 'btn', onclick: shuffle }, 'Mezclar'),
              el('button', { class: 'btn ghost', onclick: () => { idx = (idx + 1) % CONFIG.puzzles.length; build(); shuffle(); } }, 'Otra imagen'),
              el('button', { class: 'btn ghost', onclick: () => app.say(cur().en) }, '🔊'))))));
    }
    build(); shuffle();
  },
};
