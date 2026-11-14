import './styles/base.css';
import './styles/palette.css';
import { $ } from './engine/dom';
import { startLoop } from './engine/loop';
import { tweens } from './engine/tween';
import { AudioEngine } from './engine/audio';
import { createInput } from './engine/input';
import type { Chapter, ChapterCtx } from './chapters/types';
import { burningBush, debug } from './chapters/burning-bush';

const stage = $('#stage'), again = $('#again'), start = $('#start'), mute = $('#mute');
const audio = new AudioEngine();
const ctx: ChapterCtx = { stage, scene: $('#scene'), black: $('#black'), flash: $('#flash'), audio, input: createInput(stage) };

// The film is a sequence of chapters; for now there is one.
const chapter: Chapter = burningBush;
chapter.mount(ctx);

startLoop((dt, T) => {
  tweens.update(dt * 1000);
  chapter.render(dt, T);
});

async function play() {
  await chapter.play();
  again.classList.add('show');
}

start.addEventListener('pointerdown', () => {
  audio.init();
  start.style.opacity = '0';
  start.style.pointerEvents = 'none';
  setTimeout(() => start.remove(), 1700);
  play();
}, { once: true });

again.addEventListener('click', async () => {
  again.classList.remove('show');
  await chapter.fadeOut();
  tweens.clear();
  chapter.reset();
  play();
});

mute.addEventListener('click', () => {
  audio.setMuted(!audio.muted);
  mute.classList.toggle('off', audio.muted);
});

Object.assign(window, { __moses: { get X() { return debug(); }, tweens } });
