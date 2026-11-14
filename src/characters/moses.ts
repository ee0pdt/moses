import { el, f1 } from '../engine/dom';
import { io, type Ease } from '../engine/math';
import { tween, cut } from '../engine/tween';

/**
 * Moses: one procedural rig. Hip, torso and head are driven by a pose; arms
 * and legs are two-bone IK chains; the robe is a Catmull-Rom skin over the
 * joints. The figure is drawn twice (<use>): an ink silhouette and, behind it,
 * a warm offset copy that reads as rim light from the fire.
 */

const ST = { hx: -1, hy: -46, t: 0, h: 0, fFx: 9, fFy: 0, fBx: -7, fBy: 0, aFx: 26.5, aFy: -64, aBx: -3, aBy: -60, ab: 0, sa: 0, sg: 64 };
export type Pose = typeof ST;
const KN: Pose = { ...ST, hx: -9, hy: -23, t: 6, fFx: -8, fFy: -3, fBx: -14, fBy: -3, aFx: 13, aFy: -34 };

export const POSES = {
  stand: ST,
  free: { ...ST, aFx: 7, aFy: -52 },
  wary: { ...ST, t: -4, aFx: 17, aFy: -62 },
  fear: { ...ST, hx: -4, t: -9, h: -4, aFx: 22, aFy: -80 },
  kneel: KN,
  flinch: { ...KN, t: -8, h: -6, aFx: 11, aFy: -54 },
  reach: { ...KN, hx: -10, t: 62, h: -30, aFx: 48, aFy: -6 },
  awe: { ...ST, hx: -4, t: -10, h: -5 },
  prostrate: { ...KN, hx: -12, hy: -16, t: 84, h: 10, aFx: 60, aFy: -5 },
  hide: { ...KN, t: 20, h: 14, aFx: 25, aFy: -48, sg: 48, aBx: 23, aBy: -69, ab: 1 },
} satisfies Record<string, Pose>;
export type PoseName = keyof typeof POSES;

/** Where he is and how he moves; the pose (P) is separate. */
export interface Motion { x: number; y: number; f: number; lean: number; hop: number; rim: number; walk: boolean; ph: number; px: number; sgn: number }

const DEF = `
  <path data-r="legs" fill="none" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse data-r="footB" rx="8" ry="3.5"/><ellipse data-r="footF" rx="8" ry="3.5"/>
  <path data-r="armB" fill="none" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path data-r="robe"/>
  <g data-r="head"><circle r="10.5"/><path d="M-11,-3 C-10,-15 7,-16 10,-5 C4,-8 -3,-7 -7,0 C-9,4 -12,6 -14,9 C-15,3 -14,-1 -11,-3Z"/><path data-r="tail" d="M-11,-3 C-9,-3 -6,-1 -7,0 C-11,8 -17,13 -21,23 C-22,11 -16,2 -11,-3Z"/><path d="M4,6 C11,6 13,13 8,22 C4,18 2,12 4,6Z"/></g>
  <g data-r="staff"><path d="M2.5,64 L-1.5,-44 C-1.5,-56 10.5,-55 9.5,-45" stroke-width="3.6" fill="none" stroke-linecap="round"/></g>
  <path data-r="armF" fill="none" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>`;

const RT = (a: number, x: number, y: number): [number, number] => {
  a *= Math.PI / 180; const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
};

/** Two-bone IK: returns [elbowX, elbowY, endX, endY]. */
function ik(ax: number, ay: number, bx: number, by: number, l1: number, l2: number, sg: number) {
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || .01;
  const mx = l1 + l2 - .01;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; bx = ax + dx; by = ay + dy; }
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  return [ax + dx / d * a - dy / d * h * sg, ay + dy / d * a + dx / d * h * sg, bx, by];
}

let uid = 0;

export function createMoses(defs: SVGDefsElement) {
  const id = `moses-def-${++uid}`;
  const def = el('g', { id }, defs);
  def.innerHTML = DEF;
  const R = (k: string) => def.querySelector(`[data-r="${k}"]`) as SVGElement;
  const legs = R('legs'), footB = R('footB'), footF = R('footF'), armB = R('armB'), robe = R('robe'),
    head = R('head'), tail = R('tail'), staff = R('staff'), armF = R('armF');

  const root = el('g', { class: 'moses' });
  const rimU = el('use', { href: '#' + id, class: 'rim' }, root);
  const inkU = el('use', { href: '#' + id, class: 'ink' }, root);
  const staffRing = el('circle', { cx: 28, cy: -70, r: 42, class: 'ring' }, root);
  const hit = el('rect', { x: -42, y: -130, width: 100, height: 140, class: 'hit' }, root);

  const P: Pose = { ...ST };

  function rig(m: Motion, staffOn: boolean) {
    const p = P, wk = m.walk ? 1 : 0, w = wk * Math.sin(m.ph), c = wk * Math.cos(m.ph);
    const th = p.t + m.lean + w * 1.5, hx = p.hx + m.lean * .25, hy = p.hy;
    const fF = [p.fFx + w * 8, p.fFy - Math.max(0, c) * 3], fB = [p.fBx - w * 8, p.fBy - Math.max(0, -c) * 3];
    const u = RT(th, 0, -46), N = [hx + u[0], hy + u[1]], sh = RT(th, 0, 7), S = [N[0] + sh[0], N[1] + sh[1]];
    const kF = ik(hx, hy, fF[0], fF[1], 23, 23, -1), kB = ik(hx, hy, fB[0], fB[1], 23, 23, -1);
    legs.setAttribute('d', `M${f1(hx)},${f1(hy)}L${f1(kB[0])},${f1(kB[1])}L${f1(fB[0])},${f1(fB[1] - 4)}M${f1(hx)},${f1(hy)}L${f1(kF[0])},${f1(kF[1])}L${f1(fF[0])},${f1(fF[1] - 4)}`);
    footF.setAttribute('cx', f1(fF[0])); footF.setAttribute('cy', f1(fF[1] - 1));
    footB.setAttribute('cx', f1(fB[0])); footB.setAttribute('cy', f1(fB[1] - 1));
    // robe
    const xs = [fF[0], fB[0]]; if (kF[1] > -16) xs.push(kF[0] - 7); if (kB[1] > -16) xs.push(kB[0] - 7);
    const a = RT(th, -12, 3), b = RT(th, 12, 3), e = RT(th / 2, -21, 0), g = RT(th / 2, 20, 0);
    const Sb = [N[0] + a[0], N[1] + a[1]], Sf = [N[0] + b[0], N[1] + b[1]], Hb = [hx + e[0], hy + e[1]], Hf = [hx + g[0], hy + g[1]];
    const HB = [Math.min(Math.min(...xs) - 14, Hb[0] + 2), -2], HF = [Math.max(...xs) + 10, -2];
    const cr = (A: number[], B: number[], C: number[]) =>
      `C${f1(A[0] + (B[0] - A[0]) / 6)},${f1(A[1] + (B[1] - A[1]) / 6)} ${f1(B[0] - (C[0] - A[0]) / 6)},${f1(B[1] - (C[1] - A[1]) / 6)} ${f1(B[0])},${f1(B[1])}` +
      `C${f1(B[0] + (C[0] - A[0]) / 6)},${f1(B[1] + (C[1] - A[1]) / 6)} ${f1(C[0] - (C[0] - B[0]) / 6)},${f1(C[1] - (C[1] - B[1]) / 6)} ${f1(C[0])},${f1(C[1])}`;
    const k1 = RT(th, 7, -7), k2 = RT(th, -7, -7);
    robe.setAttribute('d', `M${f1(Sb[0])},${f1(Sb[1])}${cr(Sb, Hb, HB)}L${f1(HF[0])},${f1(HF[1])}${cr(HF, Hf, Sf)}C${f1(Sf[0] + k1[0] - 7 * Math.cos(th * .01745))},${f1(Sf[1] + k1[1])} ${f1(Sb[0] + k2[0] + 7 * Math.cos(th * .01745))},${f1(Sb[1] + k2[1])} ${f1(Sb[0])},${f1(Sb[1])}Z`);
    const hc = RT(th + p.h, 3, -11);
    head.setAttribute('transform', `translate(${f1(N[0] + hc[0])},${f1(N[1] + hc[1])}) rotate(${f1(th + p.h)})`);
    tail.setAttribute('transform', `rotate(${f1(-(th + p.h) * .65)} -9 -1)`);
    const aF = ik(S[0], S[1], p.aFx + w * 3, p.aFy, 18, 18, 1), aB = ik(S[0], S[1], p.aBx, p.aBy, 18, 18, 1);
    armF.setAttribute('d', `M${f1(S[0])},${f1(S[1])}L${f1(aF[0])},${f1(aF[1])}L${f1(aF[2])},${f1(aF[3])}`);
    armB.setAttribute('d', p.ab > .5 ? `M${f1(S[0])},${f1(S[1])}L${f1(aB[0])},${f1(aB[1])}L${f1(aB[2])},${f1(aB[3])}` : '');
    staff.setAttribute('display', staffOn ? 'inline' : 'none');
    staff.setAttribute('transform', `translate(${f1(aF[2])},${f1(aF[3])}) rotate(${f1(p.sa + w * 3)}) translate(0,${f1(p.sg - 64)})`);
  }

  const api = {
    root, staffRing, hit, P,
    staffOn: true,
    toPose(name: PoseName, ms = 0, ease: Ease = io): Promise<void> {
      if (ms) return tween(P, POSES[name], ms, ease);
      cut(P, POSES[name]); return Promise.resolve();
    },
    /** Position, walk cycle, rim light and rig. `fl` is fire flicker; `onStep` fires on each footfall. */
    draw(m: Motion, fl: number, onStep?: () => void) {
      let bob = 0;
      if (m.walk) {
        m.ph += Math.abs(m.x - m.px) * .11;
        const s = Math.sin(m.ph); bob = Math.abs(s) * 2.5;
        const sg = s >= 0 ? 1 : -1;
        if (sg !== m.sgn) { m.sgn = sg; onStep?.(); }
      }
      m.px = m.x;
      root.setAttribute('transform', `translate(${m.x.toFixed(2)},${(m.y - bob - m.hop).toFixed(2)})`);
      inkU.setAttribute('transform', `scale(${m.f},1)`);
      rimU.setAttribute('transform', `translate(2.6,-.6) scale(${m.f},1)`);
      rimU.setAttribute('opacity', (m.rim * (.75 + .25 * fl)).toFixed(3));
      rig(m, api.staffOn);
    },
  };
  return api;
}

export type Moses = ReturnType<typeof createMoses>;
