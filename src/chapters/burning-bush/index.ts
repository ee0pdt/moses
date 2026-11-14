import './chapter.css';
import { tween } from '../../engine/tween';
import type { Chapter } from '../types';
import { createScene, type Scene } from './scene';
import { story } from './story';

/** Chapter: "The Burning Bush" — Exodus 3–4. The vertical slice. */
let X: Scene;

export const burningBush: Chapter = {
  id: 'burning-bush',
  title: 'The Burning Bush',
  mount(ctx) { X = createScene(ctx); X.reset(); },
  reset() { X.reset(); },
  render(dt, T) { X.render(dt, T); },
  play() { return story(X); },
  fadeOut() { return tween(X.S, { black: 1 }, 1500); },
};

/** Debug handle for the console: __moses.X.S, __moses.X.cam … */
export const debug = () => X;
