import { el, pick, cap, wordImage } from '../core/utils.js';

const N = 10, DIRS = [[0, 1], [1, 0], [1, 1]];

export default {
  id: 'wordsearch', icon: '🔤', title: 'Sopa de letras',
  mount(root, app) {
    let words, grid, start, found;

    function place() {
      words = pick(app.vocab.filter(w => w.en.length <= N), 6);
      grid = Array.from({ length: N }, () => Array(N).fill(''));
      for (const w of words) {
        for (let t = 0; t < 300; t++) {
          const [dr, dc] = DIRS[Math.floor(Math.random() * 3)];
          const r = Math.floor(Math.random() * N), c = Math.floor(Math.random() * N);
          const er = r + dr * (w.en.length - 1), ec = c + dc * (w.en.length - 1);
          if (er >= N || ec >= N) continue;
          if ([...w.en].every((ch, i) => !grid[r + dr * i][c + dc * i] || grid[r + dr * i][c + dc * i] === ch)) {
            [...w.en].forEach((ch, i) => (grid[r + dr * i][c + dc * i] = ch)); break;
          }
        }
      }
      const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      grid = grid.map(row => row.map(ch => ch || abc[Math.floor(Math.random() * 26)]));
    }

    function line(a, b) {
      const dr = b[0] - a[0], dc = b[1] - a[1];
      if (dr && dc && Math.abs(dr) !== Math.abs(dc)) return null;
      const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
      return Array.from({ length: len }, (_, i) => [a[0] + Math.sign(dr) * i, a[1] + Math.sign(dc) * i]);
    }

    function draw() {
      root.replaceChildren();
      const board = el('div', { class: 'grid', style: `grid-template-columns:repeat(${N},1fr)` });
      const cells = {};
      grid.forEach((row, r) => row.forEach((ch, c) => {
        const b = el('button', { class: 'cell', 'aria-label': ch }, ch);
        cells[`${r},${c}`] = b;
        b.onclick = () => {
          if (!start) { start = [r, c]; b.classList.add('start'); return; }
          const cs = line(start, [r, c]);
          cells[`${start}`].classList.remove('start');
          const s = start; start = null;
          if (!cs) return app.sfx('no');
          const str = cs.map(([y, x]) => grid[y][x]).join('');
          const w = words.find(w => !found.has(w.en) && (w.en === str || w.en === [...str].reverse().join('')));
          if (!w) return app.sfx('no');
          found.add(w.en); cs.forEach(k => cells[k].classList.add('found'));
          app.sfx('ok'); app.say(w.en); app.addStars(1);
          app.toast(`${cap(w.en)} = ${w.es}`);
          list.querySelector(`[data-w="${w.en}"]`).classList.add('done');
          if (found.size === words.length) { app.sfx('win'); app.addStars(3); app.toast('¡Las encontraste todas! 🎉'); }
        };
        board.append(b);
      }));

      const list = el('div', { class: 'side' }, el('h3', {}, 'Palabras para buscar'),
        ...words.map(w => {
          const d = el('div', { class: 'word', 'data-w': w.en, onclick: () => app.say(w.en) },
            el('span', {}, cap(w.en)), el('span', { class: 'es' }, w.es));
          return d;
        }),
        el('button', { class: 'btn', onclick: init, style: 'width:100%;margin-top:8px' }, 'Nueva sopa'));

      root.append(el('div', { class: 'panel' },
        el('h2', {}, 'Sopa de letras'),
        el('p', { class: 'sub' }, 'Toca la primera letra y luego la última de cada palabra en inglés. Puede estar en horizontal, vertical o diagonal.'),
        el('div', { class: 'layout' }, board, list)));
    }

    function init() { found = new Set(); start = null; place(); draw(); }
    init();
  },
};
