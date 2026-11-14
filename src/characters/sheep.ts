import { el } from '../engine/dom';

/** Sheep and goats: a body card, four swinging legs, a head that dips to graze. */
export type Kind = 'sheep' | 'goat';

export interface Sheep {
  el: SVGGElement; legs: SVGLineElement[]; legX: number[]; head: SVGGElement; hy: number; px: number; py: number;
  gap: number; x: number; y: number; s: number; f: number; ph: number; hd: number; gz: boolean; gt: number; lx: number; moving: boolean;
}

export function createSheep(parent: Element, kind: Kind, gap: number, y: number, s: number): Sheep {
  const g = el('g', {}, parent), goat = kind === 'goat', hy = goat ? -14 : -12, px = goat ? 13 : 15, py = -23;
  const legX = [-15, -9, 9, 14];
  const legs = legX.map(x => el('line', { x1: x, y1: hy, x2: x, y2: 0, class: 's-fig', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g));
  const head = el('g', {}, g);
  if (goat) {
    el('path', { d: 'M-20,-19 C-21,-27 -14,-30 -6,-29 L10,-29 C17,-29 20,-25 19,-19 C18,-14 13,-13 6,-13 L-12,-13 C-17,-13 -19,-15 -20,-19Z M-19,-27 L-26,-34 L-20,-23Z', class: 'c-fig' }, g);
    el('path', { d: 'M11,-28 C15,-35 18,-41 23,-44 L33,-39 C34,-36 31,-34 27,-34 C24,-29 21,-23 15,-19Z', class: 'c-fig' }, head);
    el('path', { d: 'M29,-35 L28,-27 L25,-34Z', class: 'c-fig' }, head);
    el('path', { d: 'M23,-44 C21,-52 15,-55 11,-51', class: 's-fig', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, head);
  } else {
    el('path', { d: 'M-22,-17 C-24,-27 -16,-32 -6,-31 L10,-31 C18,-31 22,-26 21,-19 C20,-13 14,-11 6,-11 L-12,-11 C-18,-11 -21,-13 -22,-17Z M-21,-26 C-29,-25 -30,-12 -25,-7 C-21,-10 -20,-17 -21,-26Z', class: 'c-fig' }, g);
    el('path', { d: 'M13,-28 C17,-34 21,-39 26,-40 C31,-41 36,-36 35,-32 C34,-29 30,-28 27,-29 C24,-25 21,-21 16,-18Z', class: 'c-fig' }, head);
    el('path', { d: 'M24,-39 C20,-37 18,-30 20,-25 C24,-28 26,-34 24,-39Z', class: 'c-fig' }, head);
  }
  g.appendChild(head);
  el('rect', { x: -36, y: -60, width: 76, height: 68, class: 'hit live' }, g);
  return { el: g, legs, legX, head, hy, px, py, gap, x: 0, y, s, f: 1, ph: Math.random() * 6, hd: 0, gz: false, gt: 1 + Math.random() * 2, lx: 0, moving: false };
}

export interface Herd { follow: boolean; x: number; dir: number }

/** Follow the shepherd (if `follow`), walk-cycle the legs, graze when idle. */
export function updateSheep(s: Sheep, dt: number, T: number, herd: Herd) {
  if (herd.follow) {
    const d = herd.x - herd.dir * s.gap - s.x;
    if (d * herd.dir > (s.moving ? 2 : 14)) { s.f = herd.dir; s.moving = true; s.x += herd.dir * Math.min(Math.abs(d) * 3, 66) * dt; }
    else s.moving = false;
  }
  if (s.moving) { s.ph += Math.abs(s.x - s.lx) * .28; s.gz = false; s.gt = 1.2 + Math.random() * 2.5; }
  else {
    s.ph += (Math.round(s.ph / Math.PI) * Math.PI - s.ph) * Math.min(1, dt * 8);
    s.gt -= dt;
    if (s.gt < 0) { s.gz = !s.gz; s.gt = s.gz ? 4 + Math.random() * 6 : 1.2 + Math.random() * 2.5; }
  }
  s.lx = s.x;
  const sw = Math.sin(s.ph) * 19;
  s.legs.forEach((l, i) => l.setAttribute('transform', `rotate(${((i % 2 ? -sw : sw) * (i < 2 ? 1 : -1)).toFixed(1)} ${s.legX[i]} ${s.hy})`));
  s.hd += ((s.gz ? 1 : 0) - s.hd) * Math.min(1, dt * 3.5);
  s.head.setAttribute('transform', `rotate(${(s.hd * (80 + Math.sin(T * 7 + s.gap) * 3)).toFixed(1)} ${s.px} ${s.py})`);
  s.el.setAttribute('transform', `translate(${s.x.toFixed(1)},${s.y}) scale(${s.s * s.f},${s.s})`);
}
