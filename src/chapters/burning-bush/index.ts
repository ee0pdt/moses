import './chapter.css';
import { tween } from '../../engine/tween';
import type { Chapter } from '../types';
import { createScene, type Scene } from './scene';
import { story } from './story';

/** Chapter: "The Burning Bush" — Exodus 3–4. */
let X: Scene | null = null;
const x = () => { if (!X) throw new Error('burning-bush not mounted'); return X; };

export const burningBush: Chapter = {
  id: 'burning-bush',
  title: 'The Burning Bush',
  ref: 'Exodus 3 – 4',
  cover: `
    <defs><radialGradient id="cvBush"><stop offset="0" stop-color="#fff3c4"/><stop offset=".3" stop-color="#f8b83a" stop-opacity=".8"/><stop offset=".7" stop-color="#c8321e" stop-opacity=".25"/><stop offset="1" stop-color="#c8321e" stop-opacity="0"/></radialGradient>
    <linearGradient id="cvNight" x2="0" y2="1"><stop offset="0" stop-color="#060a1e"/><stop offset="1" stop-color="#264264"/></linearGradient></defs>
    <rect width="160" height="120" fill="url(#cvNight)"/>
    <path d="M0,96 L40,88 L70,60 L96,30 L130,0 L160,0 L160,120 L0,120Z" fill="#1c2748"/>
    <circle cx="104" cy="84" r="30" fill="url(#cvBush)"/>
    <path d="M0,98 C40,96 120,98 160,96 L160,120 L0,120Z" fill="#11162c"/>
    <path d="M104,98 L104,84 M104,90 L94,80 M104,88 L114,79 M104,84 L100,72 M104,84 L109,73" stroke="#150c0e" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M60,98 L60,82 C60,76 66,74 66,80" stroke="#04050d" stroke-width="1.6" fill="none"/><path d="M50,98 L51,82 C51,74 57,72 59,77 L58,98Z" fill="#04050d"/><circle cx="55" cy="72" r="4" fill="#04050d"/>`,
  mount(ctx) { X = createScene(ctx); X.reset(); },
  unmount() { if (X) X.ctx.scene.innerHTML = ''; X = null; },
  reset() { x().reset(); },
  render(dt, T) { X?.render(dt, T); },
  play() { return story(x()); },
  fadeOut() { return tween(x().S, { black: 1 }, 1500); },
  inspect: () => X,
};
