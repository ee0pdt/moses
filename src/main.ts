import './styles/base.css';
import './styles/palette.css';
import './styles/menu.css';
import { $ } from './engine/dom';
import { startLoop } from './engine/loop';
import { tweens } from './engine/tween';
import { AudioEngine, SILENCE } from './engine/audio';
import { createInput } from './engine/input';
import type { Chapter, ChapterCtx } from './chapters/types';
import { CHAPTERS } from './chapters';
import { bindFullscreenButton, enterFullscreen } from './engine/fullscreen';

/*
 * The shell: start screen → chapter menu → a chapter → (replay | menu).
 * A chapter can be opened directly with its id as the hash: /#basket
 */

const stage = $('#stage'), again = $('#again'), start = $('#start'), mute = $('#mute');
const menu = $('#menu'), menuBtn = $('#menuBtn'), cards = $('#menu .cards');
const audio = new AudioEngine();
const ctx: ChapterCtx = { stage, scene: $('#scene'), black: $('#black'), flash: $('#flash'), audio, input: createInput(stage) };

let current: Chapter | null = null;
let run = 0; // increments per play, so a superseded play() can't show the replay button

startLoop((dt, T) => {
  tweens.update(dt * 1000);
  if (current) current.render(dt, T);
  else audio.frame(dt, T, SILENCE);
});

function stop() {
  tweens.clear();
  current?.unmount();
  current = null;
  again.classList.remove('show');
  ctx.black.style.opacity = '1';
  ctx.flash.style.opacity = '0';
}

async function play(ch: Chapter) {
  const id = ++run;
  again.classList.remove('show');
  menuBtn.classList.add('show');
  await ch.play();
  if (id === run) again.classList.add('show');
}

function open(ch: Chapter) {
  stop();
  menu.classList.remove('show');
  history.replaceState(null, '', '#' + ch.id);
  current = ch;
  ch.mount(ctx);
  play(ch);
}

function showMenu() {
  stop();
  menuBtn.classList.remove('show');
  history.replaceState(null, '', location.pathname + location.search);
  menu.classList.add('show');
}

// menu tiles
CHAPTERS.forEach((ch, i) => {
  const li = document.createElement('li');
  li.style.setProperty('--i', String(i));
  li.innerHTML = `<button class="card" aria-label="${ch.title}">
      <svg viewBox="0 0 160 120" aria-hidden="true">${ch.cover}</svg>
      <span class="t">${ch.title}</span><span class="r">${ch.ref}</span>
    </button>`;
  li.querySelector('button')!.addEventListener('click', () => open(ch));
  cards.appendChild(li);
});

start.addEventListener('pointerdown', () => {
  audio.init();
  if (!new URLSearchParams(location.search).has('auto')) enterFullscreen();
  start.style.opacity = '0';
  start.style.pointerEvents = 'none';
  setTimeout(() => start.remove(), 1700);
  const deep = CHAPTERS.find(c => c.id === location.hash.slice(1));
  deep ? open(deep) : showMenu();
}, { once: true });

again.addEventListener('click', async () => {
  if (!current) return;
  const ch = current;
  again.classList.remove('show');
  await ch.fadeOut();
  tweens.clear();
  ch.reset();
  play(ch);
});

menuBtn.addEventListener('click', showMenu);
bindFullscreenButton($('#fs'));

mute.addEventListener('click', () => {
  audio.setMuted(!audio.muted);
  mute.classList.toggle('off', audio.muted);
});

Object.assign(window, { __moses: { get X() { return current?.inspect?.(); }, tweens, chapters: CHAPTERS.map(c => c.id) } });
