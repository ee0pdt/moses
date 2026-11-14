import { el, $ } from '../../engine/dom';
import { rng } from '../../engine/math';
import { ridge, blob } from '../../art/shapes';

/** World units. Set A (the house) is centred on RA, set B (the Nile) on RB. Ground lines: house 600, riverbank 632. */
export const RA = 0, RB = 5000, BANK = 632, WATER = 618;
/** The lamp in its niche: the flame sits at (LAMP_X, LAMP_Y). Soldiers in the street stand at STREET (below the window sill). */
export const LAMP_DY = 56, LAMP_X = -240, LAMP_Y = 457 + LAMP_DY, STREET = 514;
/** Front reed clumps along the bank: Miriam's two hiding places, and where the basket comes to rest. */
export const HIDE1 = RB - 40, HIDE2 = RB + 200, REST = RB + 440;

export interface Layer { g: SVGGElement; d: number; ref: number }
export interface Clump { g: SVGGElement; x: number; y: number; ph: number; amp: number }

/** Papyrus: tapered stalks, a few with a fan-shaped umbel, rooted at (x,y). */
function reeds(parent: Element, x: number, y: number, n: number, h: number, seed: number, cls: string, list: Clump[], amp = 1.6) {
  const r = rng(seed), g = el('g', { class: cls }, parent);
  for (let i = 0; i < n; i++) {
    const bx = x + (r() - .5) * n * 9, hh = h * (.55 + r() * .5), lean = (r() - .5) * hh * .35, tx = bx + lean, ty = y - hh;
    const w = 2.2 + r() * 1.6;
    el('path', { d: `M${(bx - w).toFixed(1)},${y} Q${(bx + lean * .3).toFixed(1)},${(y - hh * .5).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(bx + lean * .3 + w * .6).toFixed(1)},${(y - hh * .5).toFixed(1)} ${(bx + w).toFixed(1)},${y}Z` }, g);
    if (r() < .62) {
      const a = Math.atan2(lean, hh) * 57.3, s = 9 + r() * 9;
      el('path', { d: `M0,0 L${-s},${-s * 1.1} Q0,${-s * 1.7} ${s},${-s * 1.1}Z`, transform: `translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${a.toFixed(1)})` }, g);
    } else {
      // a bent leaf blade
      const s = r() < .5 ? -1 : 1;
      el('path', { d: `M${bx},${y} Q${bx + s * hh * .25},${y - hh * .6} ${bx + s * hh * .45},${y - hh * .45} Q${bx + s * hh * .2},${y - hh * .55} ${bx + 3},${y}Z` }, g);
    }
  }
  list.push({ g, x, y, ph: r() * 6, amp });
  return g;
}

function palm(parent: Element, x: number, y: number, h: number, lean: number, cls: string) {
  const g = el('g', { class: cls }, parent), tx = x + lean, ty = y - h;
  el('path', { d: `M${x - 3},${y} Q${x + lean * .2},${y - h * .5} ${tx - 1.5},${ty} L${tx + 1.5},${ty} Q${x + lean * .2 + 4},${y - h * .5} ${x + 3},${y}Z` }, g);
  [[-1, .2], [-1, .7], [1, .3], [1, .8], [0, 1]].forEach(([s, k]) => {
    const L = h * (.34 + k * .12), ex = tx + s * L, ey = ty + L * .35 - (s === 0 ? L * .5 : 0);
    el('path', { d: `M${tx},${ty - 2} Q${(tx + ex) / 2},${ty - L * .42} ${ex},${ey} Q${(tx + ex) / 2},${ty - L * .02} ${tx},${ty + 4}Z` }, g);
  });
}

export function buildWorld(world: SVGSVGElement) {
  const setA = $<SVGGElement>('#setA', world), setB = $<SVGGElement>('#setB', world);
  const layers: Layer[] = [], clumps: Clump[] = [];
  const layer = (set: SVGGElement, d: number, ref: number) => { const g = el('g', {}, set); layers.push({ g, d, ref }); return g; };
  const card = (g: Element, d: string, cls: string) => el('path', { d, class: cls }, g);

  /* ---------- Set A — a mud-brick house in Goshen, at night ---------- */
  const aWall = layer(setA, .92, RA);
  card(aWall, 'M-2200,-1600 L2200,-1600 L2200,606 L-2200,606Z', 'c-mid');
  card(aWall, 'M-2200,-1600 L2200,-1600 L2200,262 L-2200,262Z', 'c-fore2');
  for (let x = -2100; x < 2200; x += 92) el('rect', { x, y: 250, width: 26, height: 26, rx: 13, class: 'c-fore1' }, aWall);
  el('rect', { x: -2200, y: 262, width: 4400, height: 70, class: 'c-fore1', opacity: .35 }, aWall);
  // the window: night sky, stars, the moon, and whatever passes in the street
  const winSky = el('rect', { x: 150, y: 380, width: 140, height: 90, class: 'c-far' }, aWall);
  const winG = el('g', { 'clip-path': 'url(#clWin)' }, aWall);
  { const r = rng(21); for (let i = 0; i < 9; i++) el('circle', { cx: 152 + r() * 136, cy: 382 + r() * 50, r: .7 + r(), fill: '#dfe6ff', opacity: .4 + r() * .5 }, winG); }
  const moon = el('g', { opacity: 0 }, winG);
  el('circle', { r: 11, fill: '#f6efcf' }, moon);
  const moonShade = el('circle', { r: 11, class: 'c-far' }, moon);
  const winDawn = el('rect', { x: 150, y: 380, width: 140, height: 90, fill: '#f4cfa0', opacity: 0 }, winG);
  const torchGlow = el('circle', { cx: 0, cy: 430, r: 90, fill: 'url(#gTorch)', opacity: 0 }, winG);
  // the patrol: rigged soldiers are added by the scene; they walk the street below the sill
  const patrol = el('g', {}, winG);
  el('path', { d: 'M136,366 L304,366 L304,484 L136,484Z M150,380 L150,470 L290,470 L290,380Z', 'fill-rule': 'evenodd', class: 'c-fore1' }, aWall);
  el('rect', { x: 128, y: 470, width: 184, height: 12, class: 'c-fore2' }, aWall);
  // doorway and curtain
  card(aWall, 'M-600,606 L-600,430 Q-545,385 -490,430 L-490,606Z', 'c-fore2');
  card(aWall, 'M-596,432 Q-560,404 -540,412 L-548,520 Q-560,560 -590,606 L-596,606Z', 'c-fore1');
  // the lamp in its niche, low enough for a girl on tiptoe to reach
  const lampG = el('g', { transform: `translate(0,${LAMP_DY})` }, aWall);
  card(lampG, 'M-302,474 L-302,432 Q-262,396 -222,432 L-222,474Z', 'c-fore1');
  el('rect', { x: -312, y: 472, width: 100, height: 9, class: 'c-fore2' }, lampG);
  const lampGlow = el('circle', { cx: -262, cy: 452, r: 460, fill: 'url(#gLamp)' }, lampG);
  card(lampG, 'M-286,472 C-284,462 -258,458 -246,462 L-236,457 L-238,465 C-240,470 -250,472 -286,472Z', 'c-fig');
  const lampFl = el('use', { href: '#flame', fill: '#ffd27a' }, lampG);
  const smoke = el('path', { d: 'M-238,452 C-232,436 -246,424 -238,408 C-232,396 -244,386 -238,372', stroke: '#b8b0c8', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, lampG);
  const lampHit = el('circle', { cx: -260, cy: 455, r: 80, class: 'hit' }, lampG);
  const lampRing = el('circle', { cx: -260, cy: 455, r: 44, class: 'ring' }, lampG);

  const aMain = layer(setA, 1, RA);
  card(aMain, 'M-2200,600 L2200,600 L2200,3000 L-2200,3000Z', 'c-ground');
  const lampPool = el('ellipse', { cx: -200, cy: 614, rx: 300, ry: 20, fill: '#f8b060', opacity: .2 }, aMain);
  const beam = el('polygon', { points: '150,470 290,470 330,640 90,640', fill: '#f2a04a', opacity: 0 }, aMain);
  const patch = el('polygon', { points: '80,612 300,612 350,650 40,650', fill: '#f2a04a', opacity: 0 }, aMain);
  card(aMain, 'M-230,604 L70,604 L110,628 L-270,628Z', 'c-fore1');
  card(aMain, 'M-420,604 C-440,560 -436,526 -414,512 L-414,500 L-398,500 L-398,512 C-376,526 -372,560 -392,604Z', 'c-fore1');
  card(aMain, 'M-370,604 C-372,588 -340,584 -336,592 C-334,598 -340,604 -370,604Z', 'c-fore1');
  const aFigs = el('g', {}, aMain);
  const aFore = layer(setA, 1.3, RA);
  card(aFore, 'M560,-1600 L640,-1600 L640,3000 L560,3000Z', 'c-fore2');
  card(aFore, 'M-2200,700 L-520,690 L-460,664 L-380,668 L-340,700 L2200,705 L2200,3000 L-2200,3000Z', 'c-fore2');

  /* ---------- Set B — the Nile ---------- */
  const bCity = layer(setB, .12, RB);
  card(bCity, `M${RB - 1600},508 L${RB - 1600},480 L${RB - 1560},480 L${RB - 1560},468 L${RB - 1530},468 L${RB - 1530},486 L${RB - 1450},486 L${RB - 1450},472 L${RB - 1420},472 L${RB - 1420},490 L${RB - 1300},490 L${RB - 1300},508Z`, 'c-far');
  card(bCity, `M${RB + 900},508 L${RB + 1000},470 L${RB + 1100},508Z M${RB + 1080},508 L${RB + 1140},486 L${RB + 1200},508Z`, 'c-far');
  const sun = el('circle', { cx: RB + 620, cy: 330, r: 260, fill: 'url(#gSun)', opacity: 0 }, bCity);
  const bFar = layer(setB, .3, RB);
  card(bFar, ridge(RB - 2600, RB + 2600, 508, 3, 300, 31, 100), 'c-mount');
  { const r = rng(5); for (let i = 0; i < 14; i++) { const x = RB - 2200 + i * 320 + r() * 160; palm(bFar, x, 510, 40 + r() * 34, (r() - .5) * 22, 'c-mount'); } }
  const bWater = layer(setB, .55, RB);
  el('rect', { x: RB - 4000, y: 507, width: 8000, height: 2600, class: 'c-water' }, bWater);
  const glints = el('g', { class: 's-glint', 'stroke-linecap': 'round' }, bWater);
  { const r = rng(77); for (let i = 0; i < 70; i++) { const y = 512 + Math.pow(r(), 1.6) * 110, L = 6 + r() * 30 * (y - 500) / 100;
      const l = el('line', { x1: RB - 2400 + r() * 4800, y1: y, x2: 0, y2: y, 'stroke-width': .8 + (y - 505) / 70, class: 'tw' }, glints);
      l.setAttribute('x2', String(+l.getAttribute('x1')! + L)); (l as SVGElement).style.animationDelay = (-r() * 4).toFixed(2) + 's'; } }
  const sunWash = blob(bWater, RB + 400, 560, 900, 60, '#fff6d8', [[1, .06], [.6, .08]], 3); sunWash.setAttribute('opacity', '0');
  const bBack = layer(setB, .85, RB);
  { const r = rng(8); for (let x = RB - 2000; x < RB + 2400; x += 140 + r() * 220) reeds(bBack, x, 598, 8, 80, x, 'c-mid', clumps, 1); }

  const bMain = layer(setB, 1, RB);
  // lotus pads on the water
  { const r = rng(14); for (let i = 0; i < 16; i++) { const x = RB - 900 + r() * 2000, y = 606 + r() * 14;
      el('ellipse', { cx: x, cy: y, rx: 9 + r() * 6, ry: 2.2, class: 'c-mid' }, bMain);
      if (r() < .35) el('path', { d: `M${x - 4},${y - 1} L${x - 5},${y - 7} L${x - 1},${y - 4} L${x},${y - 9} L${x + 1},${y - 4} L${x + 5},${y - 7} L${x + 4},${y - 1}Z`, class: 'c-glint' }, bMain); } }
  // the basket on the water
  const basketW = el('g', { display: 'none' }, bMain);
  const ripple = el('ellipse', { cx: 0, cy: 6, rx: 10, ry: 2.5, class: 's-glint', 'stroke-width': 1.4, opacity: 0 }, basketW);
  const basketBody = el('g', {}, basketW);
  el('path', { d: 'M-18,-6 L18,-6 C17,4 10,8 0,8 C-10,8 -17,4 -18,-6Z M-17,-7 C-10,-14 10,-14 17,-7Z', class: 'c-fig' }, basketBody);
  el('path', { d: 'M-14,-9 C-8,-12 8,-12 14,-9', class: 's-glint', 'stroke-width': 1, opacity: .7 }, basketBody);
  const lip = el('rect', { x: -24, y: 3, width: 48, height: 9, class: 'c-water' }, basketW);
  const basketHit = el('rect', { x: -70, y: -60, width: 140, height: 90, class: 'hit' }, basketW);
  const basketRing = el('circle', { cx: 0, cy: -2, r: 34, class: 'ring' }, basketW);
  const bank = card(bMain, ridge(RB - 2600, RB + 2600, BANK, 3, 200, 9, 60), 'c-ground');
  const bFigs = el('g', {}, bMain);
  const bFront = el('g', {}, bMain);
  reeds(bFront, HIDE1, 642, 13, 120, 101, 'c-fore1', clumps);
  reeds(bFront, HIDE2, 642, 12, 112, 102, 'c-fore1', clumps);
  reeds(bFront, REST - 6, 638, 9, 92, 103, 'c-fore1', clumps);
  reeds(bFront, RB - 640, 644, 10, 130, 104, 'c-fore1', clumps);
  reeds(bFront, RB + 980, 644, 12, 124, 105, 'c-fore1', clumps);
  const bFore = layer(setB, 1.25, RB);
  card(bFore, ridge(RB - 3000, RB + 3000, 716, 8, 300, 51), 'c-fore2');
  { const r = rng(61); for (let x = RB - 2600; x < RB + 2800; x += 380 + r() * 400) reeds(bFore, x, 716, 9, 190, x + 7, 'c-fore2', clumps, 2.2); }

  return {
    layers, clumps, setA, setB,
    // A
    aFigs, winSky, moon, moonShade, winDawn, torchGlow, patrol, lampGlow, lampFl, smoke, lampHit, lampRing, lampPool, beam, patch,
    // B
    bFigs, bank, glints, sun, sunWash, basketW, basketBody, ripple, lip, basketHit, basketRing,
  };
}
export type World = ReturnType<typeof buildWorld>;

export function buildInserts(scene: HTMLElement) {
  const q = <T extends Element = SVGElement>(s: string) => $<T>(s, scene);
  // the basket's warp ribs and the rows woven across them
  const ribs = q('#wRibs');
  for (let k = -4; k <= 4; k++) el('path', { d: `M${k * 46},-20 Q${k * 42},60 ${k * 26},130` }, ribs);
  const rowsG = q('#wRows'), rows: SVGGElement[] = [];
  for (let i = 0; i < 5; i++) {
    const y = 98 - i * 30, g = el('g', {}, rowsG);
    el('rect', { x: -215, y, width: 430, height: 31, fill: i % 2 ? '#9b7240' : '#87602f' }, g);
    for (let x = -212; x < 215; x += 15) el('path', { d: i % 2 ? `M${x},${y + 3} L${x + 9},${y + 28}` : `M${x + 9},${y + 3} L${x},${y + 28}`, stroke: '#5f411f', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
    el('rect', { x: -215, y: y + 27, width: 430, height: 4, fill: '#4a3218', opacity: .6 }, g);
    rows.push(g);
  }
  return {
    weave: q<SVGSVGElement>('#weave'), open: q<SVGSVGElement>('#open'),
    rows, wBaby: q('#wBaby'), wLid: q('#wLid'), wPitchR: q('#wPitchR'), wRimW: q('#wRimW'), wRimP: q('#wRimP'),
    wHandR: q('#wHandR'), wHandL: q('#wHandL'), wStrand: q('#wStrand'), wGlow: q('#wGlow'), wRing: q('#wRing'), wHit: q('#wHit'),
    oLid: q('#oLid'), oMouth: q('#oMouth'), oTears: q('#oTears'), oFist: q('#oFist'), oEyes: q('#oEyes'), oHand: q('#oHand'),
    hush: q<SVGSVGElement>('#hush'), hPatch: q('#hPatch'), hMa: q('#hMa'), hHead: q('#hHead'), hIris: q('#hIris'), hLid: q('#hLid'), hLips: q('#hLips'),
    hBaby: q('#hBaby'), hBabyMouth: q('#hBabyMouth'), hBabyBrow: q('#hBabyBrow'), hHand: q('#hHand'),
    hWarm: [...scene.querySelectorAll<SVGElement>('#hush .hw')],
    oLidRing: q('#oLidRing'), oLidHit: q('#oLidHit'), oBabyRing: q('#oBabyRing'), oBabyHit: q('#oBabyHit'),
  };
}
export type Inserts = ReturnType<typeof buildInserts>;
