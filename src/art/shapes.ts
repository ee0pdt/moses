import { el } from '../engine/dom';
import { rng } from '../engine/math';

/** A ridge line of summed sines, closed down to y=3000 — the "paper cut" ground card. */
export function ridge(x0: number, x1: number, base: number, amp: number, wl: number, seed: number, step = 150) {
  const r = rng(seed), p = [r() * 6, r() * 6, r() * 6];
  let d = `M${x0},3000`;
  for (let x = x0; x <= x1; x += step) {
    const y = base - amp * (Math.sin(x / wl + p[0]) * .6 + Math.sin(x / (wl * .37) + p[1]) * .3 + Math.sin(x / (wl * .13) + p[2]) * .1);
    d += `L${x},${y.toFixed(1)}`;
  }
  return d + `L${x1},3000Z`;
}

/** Polygon path with points relative to a set's reference x. */
export const poly = (ref: number, pts: number[][]) => 'M' + pts.map(p => (ref + p[0]) + ',' + p[1]).join('L') + 'Z';

/** Scattered grass tufts. */
export function tufts(g: Element, x0: number, x1: number, y: number, n: number, seed: number, cls: string) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0), h = 10 + r() * 14, yy = y + r() * 6;
    el('path', { d: `M${x - 7},${yy} L${x - 9},${yy - h * .7} L${x - 3},${yy - 2} L${x},${yy - h} L${x + 3},${yy - 2} L${x + 10},${yy - h * .6} L${x + 7},${yy}Z`, class: cls }, g);
  }
}

/** Faceted glow: stacked jittered polygons instead of a blurred gradient (cheap and on-style). */
export function blob(g: Element, cx: number, cy: number, rx: number, ry: number, fill: string, steps: number[][], seed: number) {
  const r = rng(seed), grp = el('g', {}, g);
  for (const [sc, op] of steps) {
    const pts: string[] = [], n = 11;
    for (let i = 0; i < n; i++) {
      const a = i / n * 6.283 + r() * .25, rr = sc * (.86 + r() * .28);
      pts.push((cx + Math.cos(a) * rx * rr).toFixed(1) + ',' + (cy + Math.sin(a) * ry * rr).toFixed(1));
    }
    el('polygon', { points: pts.join(' '), fill, opacity: op }, grp);
  }
  return grp;
}

/** The flame glyph, used as <use href="#flame">. */
export const FLAME_D = 'M0,8 L-9,4 L-11,-7 L-5,-21 L-2,-13 L1,-30 L8,-15 L11,-3 L8,5Z';
