import './chapter.css';
import { tween } from '../../engine/tween';
import type { Chapter } from '../types';
import { createScene, type Scene } from './scene';
import { story } from './story';

/** Chapter: "The Basket" — Exodus 1:22 – 2:10. */
let X: Scene | null = null;
const x = () => { if (!X) throw new Error('basket not mounted'); return X; };

export const basket: Chapter = {
  id: 'basket',
  title: 'The Basket',
  ref: 'Exodus 1 – 2',
  cover: `
    <defs><linearGradient id="cvDawn" x2="0" y2="1"><stop offset="0" stop-color="#2e3a5c"/><stop offset=".55" stop-color="#c58f8e"/><stop offset="1" stop-color="#f4cfa0"/></linearGradient>
    <radialGradient id="cvSun"><stop offset="0" stop-color="#fffbe8"/><stop offset=".3" stop-color="#fbe3a8" stop-opacity=".6"/><stop offset="1" stop-color="#f6d08a" stop-opacity="0"/></radialGradient></defs>
    <rect width="160" height="120" fill="url(#cvDawn)"/>
    <circle cx="112" cy="62" r="44" fill="url(#cvSun)"/>
    <path d="M0,66 C40,64 120,67 160,65 L160,70 L0,70Z" fill="#75627a"/>
    <rect y="68" width="160" height="52" fill="#6c8597"/>
    <g stroke="#f6d3ae" stroke-width="1.2" stroke-linecap="round" opacity=".8"><path d="M96,76 h18 M104,82 h26 M88,90 h14 M120,94 h22 M70,80 h8"/></g>
    <g fill="#29233a"><path d="M14,104 Q18,70 22,46 Q20,72 20,104Z M22,46 l-8,-9 q8,-4 14,1Z M28,104 Q30,80 34,60 Q32,82 32,104Z M34,60 l-7,-8 q7,-3 12,1Z M38,104 Q36,86 30,74 Q38,84 42,104Z"/>
    <path d="M126,104 Q128,82 133,66 Q131,84 131,104Z M133,66 l-7,-8 q7,-3 12,1Z M140,104 Q141,88 146,76 Q143,90 144,104Z"/></g>
    <g transform="translate(80,92)"><path d="M-13,-4 L13,-4 C12,3 7,6 0,6 C-7,6 -12,3 -13,-4Z M-12,-5 C-7,-10 7,-10 12,-5Z" fill="#15111c"/><path d="M-10,-7 C-5,-9 5,-9 10,-7" stroke="#f6d3ae" stroke-width=".8" fill="none"/></g>
    <path d="M0,106 C50,102 110,108 160,104 L160,120 L0,120Z" fill="#1a1626"/>`,
  mount(ctx) { X = createScene(ctx); X.reset(); },
  unmount() { if (X) X.ctx.scene.innerHTML = ''; X = null; },
  reset() { x().reset(); },
  render(dt, T) { X?.render(dt, T); },
  play() { return story(x()); },
  fadeOut() { return tween(x().S, { black: 1 }, 1500); },
  inspect: () => X,
};
