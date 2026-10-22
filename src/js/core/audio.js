import { CONFIG } from '../config.js';

let ac;
const ctx = () => (ac ||= new (window.AudioContext || window.webkitAudioContext)());

function tone(freq, start, dur, vol = .12, type = 'sine') {
  const c = ctx(), o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + .03);
  g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + .05);
}

// Efectos de sonido
export function sfx(kind) {
  try {
    if (kind === 'ok') { tone(660, 0, .18); tone(880, .12, .25); }
    else if (kind === 'no') { tone(220, 0, .25, .1, 'triangle'); }
    else if (kind === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .12, .35));
    else tone(520, 0, .08, .06);
  } catch {}
}

// Pronunciación en inglés
export function say(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.toLowerCase());
  u.lang = 'en-US'; u.rate = .85; u.pitch = 1.15;
  speechSynthesis.speak(u);
}

// Música de fondo: usa el mp3 si existe; si no, una melodía suave generada
const file = new Audio(CONFIG.paths.music);
file.loop = true; file.volume = .35;
let on = false, timer = null, usingSynth = false;
const scale = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];
let step = 0;

function startSynth() {
  if (usingSynth) return;
  usingSynth = true;
  timer = setInterval(() => {
    const f = scale[step++ % scale.length];
    tone(f, 0, 1.2, .05); if (step % 4 === 1) tone(f / 2, 0, 2, .04);
  }, 650);
}
function stopSynth() { clearInterval(timer); usingSynth = false; }

export function toggleMusic() {
  on = !on;
  if (on) file.play().catch(startSynth);
  else { file.pause(); stopSynth(); }
  return on;
}
file.addEventListener('error', () => { if (on) startSynth(); });
