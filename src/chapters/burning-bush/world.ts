import { el, $ } from '../../engine/dom';
import { rng } from '../../engine/math';
import { ridge, poly, blob } from '../../art/shapes';
import { createSheep, type Kind } from '../../characters/sheep';

/** World units: set A (the plain) is centred on RA, set B (Horeb) on RB; the bush stands at BX,BY. */
export const RA = 600, RB = 5600, BX = 5800, BY = 600;

/** A parallax card group: `d` is depth (1 = moves with the camera's subject plane). */
export interface Layer { g: SVGGElement; d: number; ref: number }

export function buildWorld(world: SVGSVGElement) {
  const setA = $<SVGGElement>('#setA', world), setB = $<SVGGElement>('#setB', world);
  const layers: Layer[] = [];
  const layer = (set: SVGGElement, d: number, ref: number) => { const g = el('g', {}, set); layers.push({ g, d, ref }); return g; };
  const card = (g: Element, d: string, cls: string) => el('path', { d, class: cls }, g);

  /* Set A — the plain at dusk */
  const aMount = layer(setA, .25, RA);
  card(aMount, poly(RA, [[-1700, 620], [-700, 590], [-200, 450], [60, 330], [230, 150], [400, 300], [800, 500], [1700, 570], [1700, 3000], [-1700, 3000]]), 'c-mount');
  el('path', { d: poly(RA, [[-700, 590], [-200, 450], [60, 330], [230, 150], [200, 330], [60, 470], [-300, 620]]), fill: '#fff', opacity: .06 }, aMount);
  el('path', { d: poly(RA, [[230, 150], [400, 300], [800, 500], [700, 620], [300, 620], [260, 380]]), fill: '#000', opacity: .07 }, aMount);
  const farHalo = blob(aMount, RA + 150, 300, 74, 74, '#f8b83a', [[1, .13], [.5, .22]], 7);
  const farCore = el('use', { href: '#flame', fill: '#fff3c4' }, aMount);
  const farRing = el('circle', { cx: RA + 150, cy: 300, r: 46, class: 'ring' }, aMount);
  const farHit = el('circle', { cx: RA + 150, cy: 300, r: 105, class: 'hit' }, aMount);
  const aMain = layer(setA, 1, RA);
  card(aMain, ridge(RA - 1700, RA + 2400, 601, 4, 260, 5), 'c-ground');
  const flock = ([[188, 602, 1, 'sheep'], [124, 603, .95, 'goat'], [66, 602, .6, 'sheep']] as [number, number, number, Kind][])
    .map(([gap, y, s, k]) => createSheep(aMain, k, gap, y, s));
  card(layer(setA, 1.25, RA), ridge(RA - 2400, RA + 3000, 700, 14, 340, 41), 'c-fore2');

  /* Set B — the mountain of God at night */
  const bCrag = layer(setB, .4, RB);
  card(bCrag, poly(RB, [[-1700, 600], [-520, 560], [60, 330], [330, 110], [900, -520], [1700, -1300], [1700, 3000], [-1700, 3000]]), 'c-mount');
  el('path', { d: poly(RB, [[60, 330], [330, 110], [900, -520], [900, -380], [380, 200], [160, 420], [-520, 600], [-520, 560]]), fill: '#fff', opacity: .05 }, bCrag);
  const facet = el('path', { d: poly(RB, [[150, 600], [260, 380], [520, 200], [700, 600]]), fill: '#d0763a', opacity: 0 }, bCrag);
  const bMain = layer(setB, 1, RB);
  card(bMain, ridge(RB - 1900, RB + 1900, 601, 4, 170, 13), 'c-ground');
  const gLight = blob(bMain, BX, 606, 320, 20, '#f8b83a', [[1, .13], [.5, .2]], 6);
  const pathGlow = el('line', { x1: BX - 36, y1: 604, x2: BX - 1500, y2: 604, stroke: '#f8d27a', 'stroke-width': 18, 'stroke-linecap': 'round', opacity: .2, 'stroke-dasharray': 1470, 'stroke-dashoffset': 1470 }, bMain);
  const pathLine = el('line', { x1: BX - 36, y1: 604, x2: BX - 1500, y2: 604.01, stroke: 'url(#gPath)', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': 1470, 'stroke-dashoffset': 1470 }, bMain);
  const pathHit = el('rect', { x: BX - 1500, y: 560, width: 1440, height: 90, class: 'hit' }, bMain);
  const holyW = blob(bMain, BX - 10, 606, 250, 13, '#fff3c4', [[1, .4], [.6, .55]], 8); holyW.setAttribute('opacity', '0');
  const sandalsW = el('path', { d: 'M5464,601 h15 a1.6,1.6 0 0 1 0,3.2 h-15 a1.6,1.6 0 0 1 0,-3.2Z M5483,600 l14,-2.5 a1.6,1.6 0 0 1 .6,3.1 l-14,2.5 a1.6,1.6 0 0 1 -.6,-3.1Z', class: 'c-fig', display: 'none' }, bMain);
  const halo = el('circle', { cx: BX, cy: BY - 60, r: 300, fill: 'url(#gGlow)' }, bMain);
  const fireBack = el('g', {}, bMain);
  const bush = el('g', { transform: `translate(${BX},${BY})` }, bMain);
  {
    const C = '#150c0e';
    ([['M0,2 L-1,-20 L0,-30', 6], ['M0,-16 L-26,-36 L-36,-52', 4.5], ['M0,-18 L26,-38 L38,-50', 4.5], ['M0,-30 L-8,-58 L-12,-74', 4], ['M0,-30 L12,-58 L18,-72', 4], ['M-20,-32 L-42,-35 L-52,-32', 3.5], ['M22,-34 L44,-37 L54,-33', 3.5]] as [string, number][])
      .forEach(([d, w]) => el('path', { d, stroke: C, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, bush));
    [[-41, -59, -58], [43, -57, -45], [-13, -83, -80], [20, -81, -72], [-61, -31, 12], [63, -32, -10], [-27, -45, -25], [30, -47, 25], [-7, -57, -62], [11, -55, -118], [-45, -41, 32], [47, -43, -32]]
      .forEach(([x, y, a]) => el('ellipse', { cx: x, cy: y, rx: 9.5, ry: 4.4, transform: `rotate(${a} ${x} ${y})`, fill: C }, bush));
  }
  const fireFront = el('g', {}, bMain);
  const fireRing = el('circle', { cx: BX, cy: BY - 60, r: 70, class: 'ring' }, bMain);
  const fireHit = el('circle', { cx: BX, cy: BY - 65, r: 125, class: 'hit' }, bMain);
  const snakeG = el('g', { display: 'none' }, bMain);
  const snake = el('path', { class: 'snake', fill: 'none', 'stroke-width': 5.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, snakeG);
  const tongue = el('path', { fill: 'none', stroke: '#e03a22', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, snakeG);
  const snakeRing = el('circle', { r: 44, class: 'ring' }, snakeG);
  const snakeHit = el('rect', { class: 'hit', width: 210, height: 110 }, snakeG);
  card(layer(setB, 1.2, RB), ridge(RB - 2400, RB + 2400, 712, 10, 380, 17), 'c-fore2');

  /* The fire: soft gradient clouds orbiting the bush, plus rising wisps */
  const FL = ([[0, -64, 78, 'gCloudR', 0], [-24, -50, 58, 'gCloudR', 2], [26, -54, 60, 'gCloudR', 4], [-12, -62, 52, 'gCloudO', 1], [15, -68, 54, 'gCloudO', 3], [0, -90, 46, 'gCloudO', 5], [-7, -54, 40, 'gCloudY', 2.5], [9, -66, 38, 'gCloudY', .7], [0, -58, 28, 'gCloudW', 1.6]] as [number, number, number, string, number][])
    .map(([x, y, r, g, ph], i) => ({ e: el('circle', { r, fill: `url(#${g})` }, fireBack), x, y, r, ph, sp: .45 + i * .1 }));
  FL.push({ e: el('circle', { r: 34, fill: 'url(#gCloudW)', opacity: .4 }, fireFront), x: 0, y: -52, r: 34, ph: 3, sp: .8 });
  const WS = [0, 1, 2, 3].map(i => ({ e: el('circle', { r: 20, fill: 'url(#gCloudO)' }, fireBack), age: i * 1.1, life: 4.4, x: 0, ph: i * 2 }));

  return {
    layers, setA, setB, aMain, bMain, flock,
    farHalo, farCore, farRing, farHit,
    facet, gLight, pathGlow, pathLine, pathHit, holyW, sandalsW, halo, fireRing, fireHit,
    snakeG, snake, tongue, snakeRing, snakeHit, FL, WS,
  };
}
export type World = ReturnType<typeof buildWorld>;

/** Stars: plain divs, a few twinkling. */
export function buildStars(host: HTMLElement) {
  const r = rng(9);
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('i'), z = 1 + r() * 1.8;
    s.style.cssText = `left:${r() * 100}%;top:${r() * 64}%;width:${z}px;height:${z}px;opacity:${.3 + r() * .7}`;
    if (i % 7 === 0) { s.className = 'tw'; s.style.animationDelay = (-r() * 3) + 's'; }
    host.appendChild(s);
  }
}

/** Inserts: refs to the hand-authored close-ups, plus their generated bits. */
export function buildInserts(scene: HTMLElement) {
  const q = <T extends Element = SVGElement>(s: string) => $<T>(s, scene);
  const foot = (id: string) => { const f = q(id); return { leg: $<SVGGElement>('.leg', f), sandal: $<SVGGElement>('.sandal', f), hit: $<SVGRectElement>('.hit', f), ring: $<SVGCircleElement>('.ring', f) }; };
  const VF = ([[-300, 330, 15, '#7a1410'], [300, 340, 16, '#7a1410'], [-170, 360, 11, '#c8321e'], [190, 370, 12, '#c8321e'], [0, 420, 13, '#8f1a12'], [-420, 300, 18, '#4a0d10'], [430, 300, 18, '#4a0d10']] as [number, number, number, string][])
    .map(([x, y, s, fill], i) => ({ e: el('use', { href: '#flame', fill, opacity: .85 }, q('#vFlames')), x, y, s, i }));
  const VH = [-90, -40, 10].map((x, i) => {
    const g = el('g', {}, q('#vHaul'));
    el('path', { d: 'M0,-26 L16,-46', 'stroke-width': 13 }, g);
    el('path', { d: 'M0,-26 L-12,0 M0,-26 L10,0', 'stroke-width': 7 }, g);
    el('circle', { cx: 24, cy: -52, r: 7.5, stroke: 'none' }, g);
    return { g, x, i, fall: 0 };
  });
  return {
    feet: q<SVGSVGElement>('#feet'), vision: q<SVGSVGElement>('#vision'), hand: q<SVGSVGElement>('#hand'), face: q<SVGSVGElement>('#face'),
    fGlow: q('#fGlow'), holy: q('#holy'), holyLine: q('#holyLine'),
    footNear: foot('#footNear'), footFar: foot('#footFar'),
    hLight: q('#hLight'), hArm: q('#hArm'), hPalm: q('#hPalm'), hFing: q('#hFing'), hRing: q('#hRing'), hHit: q('#hHit'),
    fcLight: q('#fcLight'), fcEye: q('#fcEye'), vWhip: q('#vWhip'),
    VF, VH,
  };
}
export type Inserts = ReturnType<typeof buildInserts>;
