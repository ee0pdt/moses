import { $, at, show, shown } from '../../engine/dom';
import { clamp, lin, smooth } from '../../engine/math';
import { tween } from '../../engine/tween';
import { fit, type Cam } from '../../engine/camera';
import { createMoses, type Motion } from '../../characters/moses';
import { updateSheep } from '../../characters/sheep';
import type { ChapterCtx } from '../types';
import { SKY, WORLD, INSERTS } from './markup';
import { buildWorld, buildStars, buildInserts, RA, BX, BY } from './world';
import { makeSfx } from './sfx';

/** Everything that animates is a number on this object, so the story can tween it. */
function freshState() {
  return {
    fire: 1, flick: 1, fireAud: 0, wind: .2, holyW: 0, black: 1, flash: 0, path: 0, holy: 0, whip: 18, facet: 0,
    m: { x: 572, y: 601, f: 1, lean: 0, hop: 0, rim: 0, walk: false, ph: 0, px: 572, sgn: 1 } as Motion,
    sd: [{ lift: 0, slide: 0 }, { lift: 0, slide: 0 }],
    h: { p: 0, shake: 0, curl: 0, eye: .5 },
    sn: { on: false, x: 0, y: 599, a: -92, amp: 0, len: 104, alive: 0 },
    follow: false, dir: 1, set: 'A' as 'A' | 'B',
  };
}
export type State = ReturnType<typeof freshState>;

export function createScene(ctx: ChapterCtx) {
  ctx.scene.innerHTML = SKY + WORLD + INSERTS;
  buildStars($('.stars', ctx.scene));
  const world = $<SVGSVGElement>('#world', ctx.scene);
  const W = buildWorld(world);
  const I = buildInserts(ctx.scene);
  const moses = createMoses($<SVGDefsElement>('defs', world));
  const sfx = makeSfx(ctx.audio);
  const { audio, stage } = ctx;

  const X = {
    ctx, W, I, moses, sfx, audio,
    S: freshState(),
    cam: { x: RA, y: 430, w: 1300, pw: 640, shake: 0 } as Cam,
    hcam: { x: 20, y: 10, w: 780, pw: 480 } as Cam,
    ccam: { x: 40, y: -30, w: 820, pw: 500 } as Cam,
    fcam: { x: 0, y: -10, w: 700, pw: 450 } as Cam,
    vcam: { x: 0, y: 20, w: 640, pw: 420 } as Cam,
    wk: 0,

    /** Switch world set; the flock and Moses move into its subject layer. */
    setSet(n: 'A' | 'B') {
      at(W.setA, 'display', n === 'A' ? 'inline' : 'none');
      at(W.setB, 'display', n === 'B' ? 'inline' : 'none');
      const mg = n === 'A' ? W.aMain : W.bMain;
      W.flock.forEach(s => mg.appendChild(s.el));
      mg.appendChild(moses.root);
      X.S.set = n;
    },

    /** The hand's skin: 0 = flesh, 1 = leprous white. */
    skin(w: number) {
      const a = (I.hArm as SVGElement).style;
      a.setProperty('--hb', w ? '#cfd6dc' : '#8e5a3a');
      a.setProperty('--hl', w ? '#ffffff' : '#c98a55');
      a.setProperty('--hs', w ? '#8f9aa6' : '#5e3a28');
    },

    /** Walk Moses to x at `speed` units/s. A newer walk cancels the end of an older one. */
    async walk(x: number, speed = 56) {
      const m = X.S.m, id = ++X.wk;
      m.f = X.S.dir = x >= m.x ? 1 : -1; m.walk = true;
      await tween(m, { x }, Math.abs(x - m.x) / speed * 1000, lin);
      if (id !== X.wk) return;
      m.walk = false;
    },

    reset() {
      X.S = freshState();
      X.cam = { x: RA, y: 430, w: 1300, pw: 640, shake: 0 };
      stage.dataset.t = 'dusk';
      X.setSet('A'); moses.toPose('stand'); moses.propOn = true;
      W.flock.forEach(s => Object.assign(s, { x: 572 - s.gap, lx: 572 - s.gap, f: 1, moving: false, gz: false, hd: 0 }));
      [I.feet, I.vision, I.hand, I.face].forEach(e => show(e, false));
      X.skin(0);
      at(W.snakeG, 'display', 'none'); W.snake.style.stroke = ''; at(W.sandalsW, 'display', 'none');
      I.VH.forEach(h => h.fall = 0);
      ctx.scene.querySelectorAll('.ring.on').forEach(r => r.classList.remove('on'));
    },

    render(dt: number, T: number) {
      const S = X.S, cam = X.cam;
      S.flick += (.72 + Math.random() * .56 - S.flick) * smooth(.16, dt);
      const fl = S.flick;
      fit(world, cam);
      for (const L of W.layers) L.g.setAttribute('transform', `translate(${((cam.x - L.ref) * (1 - L.d)).toFixed(2)},0)`);
      ctx.black.style.opacity = String(S.black);
      ctx.flash.style.opacity = String(S.flash);

      moses.draw(S.m, fl, sfx.step);
      W.flock.forEach(s => updateSheep(s, dt, T, { follow: S.follow, x: S.m.x, dir: S.dir }));

      if (S.set === 'A') {
        at(W.farHalo, 'opacity', (.55 + .35 * fl).toFixed(3));
        at(W.farCore, 'transform', `translate(${RA + 150},302) scale(${(.5 + .2 * fl).toFixed(3)})`);
      } else {
        const lv = S.fire;
        for (const p of W.FL) {
          const a = Math.sin(T * p.sp + p.ph), b = Math.cos(T * p.sp * 1.3 + p.ph * 2), k = .72 + .28 * lv;
          at(p.e, 'cx', (BX + p.x * k + a * 7).toFixed(1));
          at(p.e, 'cy', (BY + (p.y + 20) * k - 20 + b * 5).toFixed(1));
          at(p.e, 'r', (p.r * k * (1 + .07 * Math.sin(T * p.sp * 2.1 + p.ph))).toFixed(1));
        }
        for (const p of W.WS) {
          p.age += dt;
          if (p.age > p.life) { p.age = 0; p.x = (Math.random() * 2 - 1) * 26; p.ph = Math.random() * 6; }
          const u = p.age / p.life;
          at(p.e, 'cx', (BX + p.x + Math.sin(p.ph + u * 3) * 12).toFixed(1));
          at(p.e, 'cy', (BY - 70 - u * 95 * lv).toFixed(1));
          at(p.e, 'r', (50 - 22 * u).toFixed(1));
          at(p.e, 'opacity', (Math.sin(u * Math.PI) * .38 * (1 - u * .5)).toFixed(2));
        }
        at(W.holyW, 'opacity', (S.holyW * (.8 + .2 * Math.sin(T * 1.6))).toFixed(3));
        at(W.halo, 'opacity', clamp(.5 * lv * (.8 + .25 * fl), 0, 1).toFixed(3));
        at(W.halo, 'r', 260 + 60 * lv);
        at(W.gLight, 'opacity', clamp(.55 * lv * fl, 0, 1).toFixed(3));
        at(W.facet, 'opacity', clamp(.13 * lv * fl, 0, .2).toFixed(3));
        const off = 1470 * (1 - S.path);
        at(W.pathLine, 'stroke-dashoffset', off); at(W.pathGlow, 'stroke-dashoffset', off);
        at(W.pathGlow, 'opacity', (.16 + .08 * Math.sin(T * 2)).toFixed(3));
        // the staff become a serpent: a travelling sine along a line
        const n = S.sn;
        if (n.on) {
          const a = n.a * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
          let d = '', hx = 0, hy = 0;
          const bx = n.x + Math.sin(T * 1.3) * 6 * n.alive;
          for (let s = 0; s <= n.len; s += 5) {
            const o = n.amp * Math.sin(s * .15 - T * 8) * Math.min(1, s / 26 + .25), px = bx + ca * s - sa * o, py = n.y + sa * s + ca * o;
            d += (s ? 'L' : 'M') + px.toFixed(1) + ',' + py.toFixed(1); hx = px; hy = py;
          }
          at(W.snake, 'd', d);
          const tg = n.alive > .5 && Math.sin(T * 9) > .2;
          at(W.tongue, 'd', tg ? `M${hx + 3},${hy} l8,-1 l4,-3 m-4,3 l4,2` : '');
          at(W.snakeRing, 'cx', bx + 50); at(W.snakeRing, 'cy', n.y - 4);
          at(W.snakeHit, 'x', bx - 50); at(W.snakeHit, 'y', n.y - 70);
        }
      }

      if (shown(I.feet)) {
        fit(I.feet, X.fcam);
        at(I.fGlow, 'opacity', (.6 + .3 * fl).toFixed(3));
        at(I.holy, 'opacity', S.holy); at(I.holyLine, 'opacity', S.holy * .9);
        ([[I.footNear, -64, 42, -11], [I.footFar, -132, 5, -5]] as const).forEach(([f, dx, dy, rot], i) => {
          const s = S.sd[i];
          at(f.leg, 'transform', `translate(0,${(-s.lift * 30).toFixed(1)}) rotate(${(-s.lift * 7).toFixed(1)})`);
          at(f.sandal, 'transform', `translate(${(s.slide * dx).toFixed(1)},${(s.slide * dy - Math.sin(s.slide * Math.PI) * 10).toFixed(1)}) rotate(${(s.slide * rot).toFixed(1)})`);
        });
      }
      if (shown(I.hand)) {
        fit(I.hand, X.hcam);
        const h = S.h, j = h.shake * (Math.random() - .5) * 5;
        at(I.hLight, 'opacity', (.5 + .3 * fl).toFixed(2));
        at(I.hArm, 'transform', `translate(${(110 - 310 * h.p + j).toFixed(1)},${(40 - 105 * h.p + j).toFixed(1)}) rotate(${(-18 + 3 * Math.sin(T * .9) * (1 - h.p) - 6 * h.p).toFixed(2)})`);
        at(I.hPalm, 'transform', `rotate(${(-8 * Math.sin(h.p * Math.PI) + 2 * Math.sin(T * 1.3)).toFixed(2)} 60 0)`);
        at(I.hFing, 'transform', `rotate(${(10 * Math.sin(h.p * Math.PI) + h.curl + 1.5 * Math.sin(T * 1.7)).toFixed(2)} -20 0)`);
        at(I.hRing, 'cx', (60 - 200 * h.p).toFixed(0)); at(I.hRing, 'cy', (30 - 70 * h.p).toFixed(0));
      }
      if (shown(I.face)) {
        fit(I.face, X.ccam);
        at(I.fcLight, 'opacity', (.5 + .3 * fl).toFixed(2));
        at(I.fcEye, 'transform', `translate(0,${(-58 * (1 - S.h.eye)).toFixed(1)}) scale(1,${S.h.eye.toFixed(2)})`);
      }
      if (shown(I.vision)) {
        fit(I.vision, X.vcam);
        I.VF.forEach(f => at(f.e, 'transform', `translate(${f.x + Math.sin(T * 1.7 + f.i) * 10},${f.y}) scale(${f.s * (1 + .06 * Math.sin(T * 3 + f.i * 2))},${f.s * (1 + .12 * Math.sin(T * 2.3 + f.i))})`));
        I.VH.forEach(h => at(h.g, 'transform', `translate(${h.x + Math.sin(T * 2.2 + h.i) * 3},110) rotate(${(Math.sin(T * 2.2 + h.i) * 4 + h.fall * 26).toFixed(1)})`));
        at(I.vWhip, 'transform', `rotate(${S.whip.toFixed(1)} 0 -60)`);
      }

      audio.frame(dt, T, { wind: S.wind, roar: S.fireAud * S.fire * .3 * (.8 + .3 * S.flick), crackleRate: 14 * S.fireAud * S.fire, crackleGain: S.fireAud });
    },
  };

  // touching an animal makes it bleat and look up
  W.flock.forEach((s, i) => s.el.addEventListener('pointerdown', e => { e.stopPropagation(); sfx.bleat(i === 2); s.gz = false; s.gt = 2.5; }));

  return X;
}
export type Scene = ReturnType<typeof createScene>;
