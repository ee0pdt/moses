import { clamp } from './math';

/**
 * A camera frames a point in world units. `w` is the view width on a
 * landscape screen, `pw` on a portrait phone; aspect ratios in between blend.
 */
export interface Cam { x: number; y: number; w: number; pw: number; shake?: number }

export function fit(svg: SVGSVGElement, c: Cam) {
  const A = innerWidth / innerHeight, t = clamp((A - .7) / .6, 0, 1);
  const w = c.pw + (c.w - c.pw) * t, h = w / A;
  let cx = c.x, cy = c.y - h * .1 * (1 - t);
  if (c.shake) { cx += (Math.random() - .5) * c.shake; cy += (Math.random() - .5) * c.shake; }
  svg.setAttribute('viewBox', `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
}
