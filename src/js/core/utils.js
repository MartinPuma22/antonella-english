import { CONFIG } from '../config.js';

export const $ = (s, r = document) => r.querySelector(s);

export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  kids.flat().forEach(c => n.append(c?.nodeType ? c : document.createTextNode(c ?? '')));
  return n;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const pick = (arr, n) => shuffle(arr).slice(0, n);
export const cap = s => s.charAt(0) + s.slice(1).toLowerCase();

// Imagen de una palabra; si el archivo no existe muestra el emoji.
export function wordImage(w) {
  const img = el('img', { class: 'wimg', src: `${CONFIG.paths.words}/${w.img}`, alt: w.en });
  img.onerror = () => img.replaceWith(el('span', { class: 'wemoji' }, w.emoji));
  return img;
}
