import { $, at, show, shown } from '../../engine/dom';
import { clamp, smooth } from '../../engine/math';
import { fit, type Cam } from '../../engine/camera';
import { createFigure, motion } from '../../characters/figure';
import { HEADS, PROPS } from '../../characters/moses';
import type { ChapterCtx } from '../types';
import { SKY, WORLD, INSERTS } from './markup';
import { buildWorld, buildInserts, RA, RB, BANK, STREET } from './world';
import { makeSfx } from './sfx';

const SUN = '#f6c46a';

/** Everything that animates is a number on this object, so the story can tween it. */
function freshState() {
  return {
    black: 1, flash: 0, flick: 1, set: 'A' as 'A' | 'B',
    // the house
    lamp: 1, smoke: 0, torch: 0, patrol: -480, march: 0, mph: 0, moon: 0, months: 0, dawnWin: 0,
    rock: 1, hush: 0, rph: 0, peer: 0,
    // the close-up of the mother's face: look (0 at the baby, 1 to the window), eyeLid (0 open, 1 shut), bow, shh, fuss (the baby)
    look: 0, eyeLid: 0, bow: 0, shh: 0, fuss: 0, warmL: -1,
    // the weaving insert
    weave: 2, weaving: 0, pitch: 0, babyIn: 0, lid: 0, handOut: 0, cradle: 0,
    // the river
    breeze: 1, sun: 0, bOn: false, bx: RB - 130, by: BANK - 18, bob: 0, btilt: 0, bWet: 0, rip: 0,
    // the opening insert
    open: 0, cry: 0, reach: 0, grip: 0,
    // the cast
    mo: motion(-70, 604, 1, .55),        // Jochebed, his mother
    mi: motion(34, 606, -1, .5),          // Miriam, his sister, on the mat facing her mother
    // the patrol (x is set from `patrol` each frame)
    so: [motion(0, STREET, 1), motion(0, STREET, 1), motion(0, STREET, 1)],
    pr: motion(RB + 1500, BANK, -1, 0),   // Pharaoh's daughter
    m1: motion(RB + 1590, BANK, -1, 0),   // her maidens
    m2: motion(RB + 1670, BANK, -1, 0),
  };
}
export type State = ReturnType<typeof freshState>;

export function createScene(ctx: ChapterCtx) {
  ctx.scene.innerHTML = SKY + WORLD + INSERTS;
  const world = $<SVGSVGElement>('#world', ctx.scene);
  const defs = $<SVGDefsElement>('defs', world);
  const W = buildWorld(world);
  const I = buildInserts(ctx.scene);
  const sfx = makeSfx(ctx.audio);
  const { audio, stage } = ctx;

  const cast = {
    mother: createFigure(defs, { head: HEADS.mother, prop: PROPS.bundle, scale: .94, ring: [8, -64, 50], belly: 5 }),
    miriam: createFigure(defs, { head: HEADS.girl, scale: .7, ring: [4, -66, 58] }),
    princess: createFigure(defs, { head: HEADS.princess, scale: .97, rim: SUN }),
    maid1: createFigure(defs, { head: HEADS.maid, scale: .92, rim: SUN }),
    maid2: createFigure(defs, { head: HEADS.maid, prop: PROPS.fan, scale: .92, rim: SUN }),
  };
  /** The patrol: spear, torch, spear. Offsets along the street from \`patrol\`. */
  const TORCH = '#f6a040';
  const soldiers = [PROPS.spear, PROPS.torch, PROPS.spear].map(prop => createFigure(defs, { head: HEADS.soldier, prop, scale: .82, rim: TORCH }));
  const SO_DX = [0, 56, 112];
  soldiers.forEach(f => W.patrol.appendChild(f.root));
  const torchFl = soldiers[1].part('flame')!;

  const X = {
    ctx, W, I, sfx, audio, cast, soldiers,
    S: freshState(),
    cam: { x: RA, y: 480, w: 780, pw: 600 } as Cam,
    wcam: { x: 0, y: 20, w: 760, pw: 470 } as Cam,
    ocam: { x: 20, y: -10, w: 740, pw: 470 } as Cam,
    hcam: { x: 30, y: -72, w: 650, pw: 440 } as Cam,

    setSet(n: 'A' | 'B') {
      at(W.setA, 'display', n === 'A' ? 'inline' : 'none');
      at(W.setB, 'display', n === 'B' ? 'inline' : 'none');
      if (n === 'A') [cast.miriam, cast.mother].forEach(f => W.aFigs.appendChild(f.root));
      else [cast.mother, cast.miriam, cast.maid2, cast.maid1, cast.princess].forEach(f => W.bFigs.appendChild(f.root));
      X.S.set = n;
    },

    /** Set the palette (time of day); `secs` is the cross-fade length. */
    palette(t: string, secs = 5) {
      stage.style.setProperty('--pal', secs + 's');
      stage.dataset.t = t;
    },

    reset() {
      X.S = freshState();
      X.cam = { x: RA, y: 480, w: 780, pw: 600 };
      X.palette('lamp', 0);
      X.setSet('A');
      Object.values(cast).forEach(f => f.toPose('stand'));
      cast.mother.toPose('sitCradle'); cast.mother.setProp(PROPS.bundle); cast.mother.propOn = true;
      cast.miriam.toPose('kneel');
      soldiers[0].toPose('spear'); soldiers[1].toPose('torch'); soldiers[2].toPose('spear');
      cast.princess.propOn = false; cast.princess.setProp(PROPS.bundle);
      cast.maid1.propOn = false; cast.maid1.setProp(PROPS.basket);
      at(W.basketW, 'display', 'none'); W.bank.before(W.basketW);
      [I.weave, I.open, I.hush].forEach(e => show(e, false));
      ctx.scene.querySelectorAll('.ring.on').forEach(r => r.classList.remove('on'));
    },

    render(dt: number, T: number) {
      const S = X.S, cam = X.cam;
      S.flick += (.72 + Math.random() * .56 - S.flick) * smooth(.16, dt);
      const fl = S.flick;
      let near = 0;
      fit(world, cam);
      for (const L of W.layers) L.g.setAttribute('transform', `translate(${((cam.x - L.ref) * (1 - L.d)).toFixed(2)},0)`);
      ctx.black.style.opacity = String(S.black);
      ctx.flash.style.opacity = String(S.flash);

      // rocking the baby; faster and closer when she is hushing him
      S.rph += dt * (1.7 + 1.5 * S.hush);
      const rk = S.rock + .8 * S.hush;
      if (rk > .001) S.mo.lean = Math.sin(S.rph) * 4 * rk;
      if (S.set === 'A') {
        at(W.lampGlow, 'opacity', (S.lamp * (.8 + .2 * fl)).toFixed(3));
        at(W.lampPool, 'opacity', (.22 * S.lamp * fl).toFixed(3));
        at(W.lampFl, 'transform', `translate(-240,457) scale(${(.42 * S.lamp * (.85 + .15 * fl)).toFixed(3)})`);
        at(W.smoke, 'opacity', (S.smoke * .6).toFixed(3));
        at(W.smoke, 'transform', `translate(0,${(-(1 - S.smoke) * 26).toFixed(1)})`);
        // the patrol in the street, and its torchlight thrown into the room
        const px = S.patrol, walking = S.march > .2;
        for (let i = 0; i < 3; i++) {
          const m = S.so[i]; m.x = 170 + px + SO_DX[i]; m.walk = walking; m.rim = S.torch * (i === 1 ? .9 : .6);
          soldiers[i].draw(m, fl);
        }
        at(torchFl, 'transform', `translate(0,-28) scale(${(.5 + .16 * fl).toFixed(3)})`);
        const th = soldiers[1].hand, tx = th.x;
        at(W.torchGlow, 'cx', tx.toFixed(1)); at(W.torchGlow, 'cy', (th.y - 26).toFixed(1));
        at(W.torchGlow, 'opacity', (S.torch * (.75 + .25 * fl)).toFixed(3));
        near = S.torch * Math.max(0, 1 - Math.abs(tx - 210) / 250) * (1 + .5 * S.peer);
        at(W.beam, 'opacity', (.09 * near * fl).toFixed(3));
        at(W.patch, 'opacity', (.32 * near * fl).toFixed(3));
        at(W.beam, 'transform', `translate(${(-(tx - 200) * .55).toFixed(1)},0)`);
        at(W.patch, 'transform', `translate(${(-(tx - 200) * .7).toFixed(1)},0)`);
        if (S.march > .01) { S.mph += dt * 2.3; if (S.mph >= 1) { S.mph -= 1; sfx.march(S.march); } }
        // three months: the moon crosses the window, waxing and waning
        const fr = S.months % 1;
        at(W.moon, 'opacity', S.moon.toFixed(3));
        at(W.moon, 'transform', `translate(${(160 + fr * 120).toFixed(1)},${(410 - Math.sin(fr * Math.PI) * 14).toFixed(1)})`);
        at(W.moonShade, 'cx', ((fr - .5) * -40).toFixed(1));
        at(W.winDawn, 'opacity', S.dawnWin.toFixed(3));
        S.mo.rim = S.mi.rim = .55 * S.lamp + .6 * near;
        cast.miriam.draw(S.mi, fl, () => sfx.step(.03));
        cast.mother.draw(S.mo, fl, () => sfx.step(.05));
      } else {
        for (const c of W.clumps) at(c.g, 'transform', `rotate(${(Math.sin(T * .7 + c.ph) * c.amp * S.breeze + Math.sin(T * 1.9 + c.ph * 2) * .3).toFixed(2)} ${c.x} ${c.y})`);
        at(W.glints, 'transform', `translate(${(Math.sin(T * .12) * 24).toFixed(1)},0)`);
        at(W.sun, 'opacity', S.sun.toFixed(3)); at(W.sunWash, 'opacity', S.sun.toFixed(3));
        if (S.bOn) {
          const b = S.bob, ty = S.by + Math.sin(T * 1.9) * 1.5 * b;
          at(W.basketW, 'transform', `translate(${S.bx.toFixed(1)},${ty.toFixed(1)})`);
          at(W.basketBody, 'transform', `rotate(${(Math.sin(T * 1.3) * 3 * b + S.btilt).toFixed(2)})`);
          at(W.lip, 'opacity', S.bWet.toFixed(2));
          at(W.ripple, 'rx', (12 + 80 * S.rip).toFixed(1)); at(W.ripple, 'ry', (2.5 + 7 * S.rip).toFixed(1));
          at(W.ripple, 'opacity', (S.rip > 0 && S.rip < 1 ? (1 - S.rip) * .9 : 0).toFixed(2));
        }
        const st = () => sfx.step(.035);
        cast.mother.draw(S.mo, 1, st);
        cast.miriam.draw(S.mi, 1, st);
        cast.maid2.draw(S.m2, 1, st);
        cast.maid1.draw(S.m1, 1, st);
        cast.princess.draw(S.pr, 1, st);
      }

      if (shown(I.weave)) {
        fit(I.weave, X.wcam);
        I.rows.forEach((g, i) => {
          const p = clamp(S.weave - i, 0, 1);
          at(g, 'display', p > 0 ? 'inline' : 'none');
          at(g, 'transform', `translate(-215,0) scale(${p.toFixed(3)},1) translate(215,0)`);
        });
        at(I.wPitchR, 'width', (430 * S.pitch).toFixed(1));
        at(I.wRimW, 'opacity', clamp(S.weave - 4, 0, 1).toFixed(2));
        at(I.wRimP, 'opacity', S.pitch.toFixed(2));
        // he is lowered in by his mother's hands (hidden until then, so he never hangs in the air on a tall screen)
        const by = -760 * (1 - S.babyIn) - 34 * S.babyIn, c = S.cradle;
        at(I.wBaby, 'display', S.babyIn > 0 || c > 0 ? 'inline' : 'none');
        at(I.wBaby, 'transform', `translate(0,${by.toFixed(1)}) rotate(${(Math.sin(T * 1.4) * 3 * (1 - S.babyIn)).toFixed(2)})`);
        at(I.wLid, 'transform', `translate(0,${(-600 * (1 - S.lid)).toFixed(1)})`);
        at(I.wGlow, 'opacity', (.8 + .2 * fl).toFixed(3));
        // the weaving hand follows the row being woven; then the daubing; then it withdraws
        const row = Math.min(4, Math.floor(S.weave)), fr = S.weave >= 5 ? 1 : S.weave - row;
        const ry = 98 - row * 30 + 14, front = -200 + 400 * fr;
        let hx = front + 70 + Math.sin(T * 7) * 7 * S.weaving, hy = ry - 24 + Math.cos(T * 7) * 6 * S.weaving;
        if (S.pitch > 0) { hx = -200 + 430 * S.pitch + 60; hy = 40 + Math.sin(T * 8) * 34 * (S.pitch < 1 ? 1 : 0); }
        hx += S.handOut * 700; hy += S.handOut * 200;
        at(I.wHandR, 'transform', `translate(${(hx + (168 - hx) * c).toFixed(1)},${(hy + (by + 18 - hy) * c).toFixed(1)})`);
        const lx = -S.handOut * 600, ly = Math.sin(T * 1.2) * 3 + S.handOut * 200;
        at(I.wHandL, 'transform', `translate(${(lx + (100 - lx) * c).toFixed(1)},${(ly + (by - 40 - ly) * c).toFixed(1)})`);
        const sx = hx - 58, sy = hy + 10;
        at(I.wStrand, 'd', S.weave < 5 && S.pitch === 0 ? `M${front.toFixed(1)},${ry} Q${((front + sx) / 2).toFixed(1)},${(ry + 26).toFixed(1)} ${sx.toFixed(1)},${sy.toFixed(1)}` : '');
      }
      if (shown(I.open)) {
        fit(I.open, X.ocam);
        const o = S.open, c = S.cry, w = .7 + .3 * Math.sin(T * 14);
        at(I.oLid, 'transform', `translate(${(-80 * o).toFixed(1)},${(-460 * o).toFixed(1)}) rotate(${(-28 * o).toFixed(2)})`);
        at(I.oMouth, 'ry', (2 + 10 * c * w).toFixed(1)); at(I.oMouth, 'rx', (4 + 4 * c).toFixed(1));
        at(I.oTears, 'opacity', (c * .9).toFixed(2));
        at(I.oEyes, 'stroke-width', (3 + 2.5 * c).toFixed(1));
        const hx = 620 - 462 * S.reach, hy = -330 + 244 * S.reach;
        at(I.oHand, 'transform', `translate(${hx.toFixed(1)},${hy.toFixed(1)})`);
        const ix = 36 + Math.sin(T * 9) * 6 * c, iy = -32 + Math.cos(T * 8) * 4 * c, tx = hx - 54, ty = hy + 38 + 28, g = S.grip;
        at(I.oFist, 'transform', `translate(${(ix + (tx - ix) * g).toFixed(1)},${(iy + (ty - iy) * g).toFixed(1)})`);
      }

      if (shown(I.hush)) {
        fit(I.hush, X.hcam);
        // the torchlight through the window: it slides across the wall and over her face
        const L = clamp(near * (.72 + .2 * fl), 0, .92), q = Math.round(L * 60) / 60;
        if (q !== S.warmL) { S.warmL = q; const v = q.toFixed(3); for (const e of I.hWarm) e.setAttribute('opacity', v); }
        at(I.hPatch, 'opacity', L.toFixed(3));
        at(I.hPatch, 'transform', `translate(${(-(S.patrol + 30) * 1.1).toFixed(1)},0)`);
        const sw = Math.sin(S.rph) * rk;
        at(I.hMa, 'transform', `translate(${(sw * 5).toFixed(2)},0) rotate(${(sw * 1.3).toFixed(2)} 0 420)`);
        at(I.hHead, 'transform', `rotate(${(S.bow * 11 + Math.sin(S.rph + .6) * .8 * rk).toFixed(2)} 40 30)`);
        const blink = S.eyeLid < .5 && T % 4.7 < .13 ? 1 : 0, k = .42 + .58 * Math.max(S.eyeLid, blink);
        at(I.hLid, 'transform', `translate(0,-141) scale(1,${k.toFixed(3)}) translate(0,141)`);
        at(I.hIris, 'transform', `translate(${(-1.5 + 4 * S.look).toFixed(2)},${(2 - 3 * S.look).toFixed(2)})`);
        at(I.hLips, 'transform', `translate(${(S.shh * 2.5).toFixed(2)},0)`);
        at(I.hBabyMouth, 'ry', (1.2 + 5.5 * S.fuss * (.7 + .3 * Math.sin(T * 13))).toFixed(2));
        at(I.hBabyMouth, 'rx', (3.5 + 2 * S.fuss).toFixed(2));
        at(I.hBabyBrow, 'opacity', S.fuss.toFixed(2));
        at(I.hBaby, 'transform', `rotate(${(Math.sin(T * 11) * 1.2 * S.fuss).toFixed(2)} 128 62)`);
        at(I.hHand, 'transform', `translate(0,${(Math.max(0, Math.sin(S.rph * 2)) * -5 * S.hush).toFixed(2)})`);
      }

      const river = S.set === 'B';
      audio.frame(dt, T, { wind: river ? .1 * S.breeze : .04, roar: 0, lapRate: river ? 1.6 : 0 });
    },
  };
  return X;
}
export type Scene = ReturnType<typeof createScene>;
