import { at, show } from '../../engine/dom';
import { io, lin, out, inn } from '../../engine/math';
import { tween, wait, cut, every } from '../../engine/tween';
import { POSES } from '../../characters/moses';
import type { Scene } from './scene';
import { RB, BX } from './world';

/**
 * Exodus 3:1 – 4:9, as a script. Each `await` is a beat; `tap` is where the
 * film waits for the viewer.
 */
export async function story(X: Scene) {
  const { S, W, I, moses, sfx, audio: a, ctx } = X;
  const { tap, once } = ctx.input;
  const m = S.m, n = S.sn, P = moses.P, cam = () => X.cam;
  const staff = (on: boolean) => { moses.propOn = on; };
  const serpent = (x: number) => {
    staff(false);
    Object.assign(n, { on: true, x, a: -92, amp: 0, alive: 0 });
    W.snake.style.stroke = 'var(--fig)'; at(W.snakeG, 'display', 'inline');
  };
  const unserpent = () => { n.on = false; at(W.snakeG, 'display', 'none'); staff(true); };

  // 1 · dusk on the plain. A light on the mountain.
  await tween(S, { black: 0 }, 2600);
  tween(cam(), { x: 650 }, 24000, lin);
  await tap([W.farHit, moses.hit], W.farRing, { delay: 5000 });

  // 2 · he turns aside to look
  ctx.stage.dataset.t = 'night'; tween(S, { wind: .26 }, 3000);
  S.follow = true; X.walk(1180); tween(cam(), { x: 930 }, 11000);
  await wait(6200); await tween(S, { black: 1 }, 1900);
  X.setSet('B'); X.wk++; cut(m, { x: 5190 });
  W.flock.forEach(s => s.x = s.lx = 5190 - s.gap - 20);
  m.rim = .15; S.fireAud = .45; S.wind = .12;
  cut(cam(), { x: RB, y: 440, w: 1050, pw: 640 });
  tween(S, { black: 0 }, 2400); tween(m, { rim: .6 }, 6500);
  await X.walk(5555); S.follow = false; W.flock.forEach(s => s.moving = false);
  tween(m, { lean: -6 }, 500, out);
  tween(S, { fireAud: .8 }, 3500); await tween(cam(), { x: 5690, y: 505, w: 700, pw: 470 }, 4200);
  await tap([W.fireHit], W.fireRing, { delay: 4000 });

  // 3 · the fire answers — twice ("Moses, Moses")
  sfx.rumble(); tween(cam(), { shake: 5 }, 200).then(() => tween(cam(), { shake: 0 }, 1600));
  tween(S, { fire: 1.55, fireAud: 1 }, 500, out).then(() => tween(S, { fire: 1.2 }, 2600));
  a.voice([73.4, 146.8], .95, { g: .24, a: .12 }); a.voice([110, 220], 1.5, { g: .24, a: .12, when: .8 });
  a.voice([73.4, 146.8], .95, { g: .24, a: .12, when: 2.7 }); a.voice([110, 220], 1.9, { g: .24, a: .12, when: 3.5 });
  // he backs away; the flock bolts
  W.flock.forEach((f, i) => { f.f = -1; f.moving = true; tween(f, { x: f.x - 120 - i * 14 }, 900 + i * 120, out).then(() => { f.moving = false; f.f = 1; }); });
  m.lean = 0; moses.toPose('awe', 220, out); m.walk = true; await tween(m, { x: 5495 }, 900, out); m.walk = false; await wait(1500);
  // at the second call he falls on his face; the staff drops beside him
  serpent(m.x + 29);
  tween(n, { a: 0 }, 520, inn).then(() => a.tn(520, .12, { type: 'triangle', g: .2, rv: .3 }));
  await moses.toPose('prostrate', 700, inn); a.nz(.25, { type: 'lowpass', f: 150, g: .45 });
  await wait(3400);
  tween(n, { a: -92 }, 1300); await moses.toPose('stand', 1400); unserpent();
  tween(m, { rim: .9 }, 600); await wait(500);

  // 4 · holy ground — the sandals
  show(I.feet, true); a.nz(.5, { type: 'lowpass', f: 200, g: .3 });
  let off = 0;
  await new Promise<void>(res => {
    ([[I.footNear, 0], [I.footFar, 1]] as const).forEach(([f, i]) => once(f.hit, f.ring, 4000 + i * 600, async () => {
      const s = S.sd[i];
      await tween(s, { lift: 1 }, 300, out); a.nz(.35, { f: 900, f2: 2600, q: .8, g: .12 });
      await tween(s, { slide: 1 }, 520);
      await tween(s, { lift: 0 }, 340, inn); a.nz(.12, { type: 'lowpass', f: 180, g: .35 }); a.tn(1318.5, 1.6, { g: .04, rv: .8 });
      tween(S, { holy: (++off) * .45 }, 900);
      if (off === 2) res();
    }));
  });
  sfx.chime(); await tween(S, { holy: 1 }, 1400); await wait(1500);

  // 5 · he hides his face; the cry of his people in the fire
  show(I.feet, false); at(W.sandalsW, 'display', 'inline'); tween(S, { holyW: 1 }, 1800); await wait(1100);
  await X.walk(5640, 30); await wait(400);
  tween(cam(), { x: 5725, y: 520, w: 560, pw: 400 }, 2200); await moses.toPose('hide', 1100);
  await wait(1800);
  a.voice([73.4, 110, 146.8, 174.6], 9.5, { g: .15, a: 2.2, vow: [420, 900] });
  tween(S, { fire: 1.8 }, 3200); await tween(cam(), { x: BX, y: 535, w: 250, pw: 190 }, 3400, inn);
  await tween(S, { flash: 1 }, 350);
  show(I.vision, true); cut(X.vcam, { w: 640, pw: 420 }); tween(X.vcam, { w: 540, pw: 360 }, 8000, lin); S.whip = 18;
  tween(S, { flash: 0 }, 900); await wait(2200);
  const crack = async () => {
    await tween(S, { whip: 34 }, 380, out); await tween(S, { whip: -34 }, 110, inn);
    a.nz(.16, { type: 'highpass', f: 2400, g: .55, rv: .5 });
    tween(S, { flash: .28 }, 40).then(() => tween(S, { flash: 0 }, 300));
    await tween(S, { whip: 18 }, 700);
  };
  await crack(); await wait(900); crack(); await wait(520);
  tween(I.VH[1], { fall: 1 }, 500, out); a.nz(.2, { type: 'lowpass', f: 160, g: .4 });
  await wait(2300); await tween(S, { flash: 1 }, 500);
  show(I.vision, false); cut(cam(), { x: 5640, y: 480, w: 900, pw: 600 }); S.fire = 1.25;
  await tween(S, { flash: 0 }, 1400); await wait(700);

  // 6 · the way back to Egypt ("Come now, I will send thee")
  a.voice([73.4, 110, 146.8, 185, 220], 7, { g: .13, a: 1.6 });
  tween(S, { path: 1 }, 4200, io); await wait(1500);
  await moses.toPose('stand', 1400); await wait(300); m.f = -1; await wait(2000); m.f = 1; await wait(700);
  m.walk = true; await tween(m, { x: 5600 }, 1100); m.walk = false;
  for (let i = 0; i < 2; i++) { await tween(m, { lean: -5 }, 320); await tween(m, { lean: 2 }, 320); }
  tween(m, { lean: 0 }, 300);

  // 7 · the staff ("Cast it on the ground")
  await tap([moses.hit], moses.ring, { delay: 3500 });
  serpent(5629); moses.toPose('free', 350);
  await tween(n, { a: 0 }, 420, inn);
  a.tn(620, .12, { type: 'triangle', g: .25, rv: .3 }); a.tn(410, .14, { type: 'triangle', g: .2, when: .11, rv: .3 });
  await wait(900); W.snake.style.stroke = '#93a352'; a.nz(1.6, { type: 'highpass', f: 5200, g: .16, a: .25 });
  await tween(n, { amp: 7, alive: 1 }, 900); await wait(250);
  // only now does he start — a jump, then a few quick steps backwards, still facing it
  moses.toPose('fear', 160, out); await tween(m, { hop: 13 }, 150, out); await tween(m, { hop: 0 }, 190, inn);
  m.walk = true; await tween(m, { x: 5530 }, 720, out); m.walk = false;
  const stopHiss = every(2600, () => a.nz(.9, { type: 'highpass', f: 5200, g: .09, a: .2 }));
  await tap([W.snakeHit], W.snakeRing, { delay: 3800 }); stopHiss();
  // gingerly: a step, a pause, another; he kneels; a first reach that flinches; then the tail
  const creep = async (x: number) => { m.walk = true; await tween(m, { x }, Math.abs(x - m.x) / 20 * 1000, lin); m.walk = false; };
  moses.toPose('wary', 600); await creep(5552); await wait(550); await creep(5570); await wait(450); await creep(5581); await wait(350);
  await moses.toPose('kneel', 1000); await wait(300);
  await tween(P, { ...POSES.reach, t: 40, aFx: 38, aFy: -22 }, 900);
  a.nz(.5, { type: 'highpass', f: 5200, g: .14, a: .08 }); tween(n, { amp: 10 }, 150).then(() => tween(n, { amp: 7 }, 400));
  await moses.toPose('flinch', 170, out); await wait(850); await moses.toPose('reach', 1500); await wait(200);
  W.snake.style.stroke = 'var(--fig)'; await tween(n, { amp: 0, alive: 0 }, 450); sfx.chime();
  tween(n, { a: -92, x: m.x + 29 }, 1000); await moses.toPose('stand', 1000);
  unserpent();

  // 7b · the hand: into the cloak, out white as snow; in again, and whole
  await wait(900);
  const h = S.h; Object.assign(h, { p: 0, shake: 0, curl: 0, eye: .5 }); X.skin(0); cut(X.hcam, { w: 780, pw: 480 });
  show(I.hand, true); a.nz(.4, { type: 'lowpass', f: 200, g: .25 }); tween(X.hcam, { w: 700, pw: 440 }, 14000, lin);
  const rustle = () => a.nz(.5, { f: 700, f2: 1800, q: .7, g: .1, a: .1 });
  const inOut = async (to: number) => { await tween(h, { p: to ? -.07 : 1.05 }, 260, out); rustle(); await tween(h, { p: to }, 780, io); };
  await tap([I.hHit], I.hRing, { delay: 3500, stray: 1 }); await inOut(1); await wait(500);
  await tap([I.hHit], I.hRing, { delay: 3000, stray: 1 }); X.skin(1); await inOut(0);
  [1975, 2093, 2960, 3136].forEach((f, i) => a.tn(f, 2.2, { g: .03, a: .02, when: i * .05, rv: .9 }));
  a.nz(.5, { type: 'lowpass', f: 120, g: .6, a: .02, rv: .4 });
  tween(h, { shake: 1, curl: -10 }, 200); await wait(1100);
  show(I.face, true); h.eye = .5; a.nz(.28, { f: 1500, f2: 3200, q: .6, g: .12, a: .1 }); await tween(h, { eye: 1.25 }, 220, out); await wait(1100);
  show(I.face, false); await wait(900);
  await tap([I.hHit], I.hRing, { delay: 3000, stray: 1 }); tween(h, { shake: 0, curl: 0 }, 400); await inOut(1); await wait(500);
  await tap([I.hHit], I.hRing, { delay: 3000, stray: 1 }); X.skin(0); await inOut(0); sfx.chime();
  await tween(h, { curl: 14 }, 500); await tween(h, { curl: 0 }, 500); await wait(900);
  show(I.hand, false);

  // 8 · dawn. He goes.
  await wait(900); ctx.stage.dataset.t = 'dawn';
  tween(S, { fire: .85, fireAud: .5, wind: .2 }, 5000); tween(m, { rim: .25 }, 5000);
  tween(cam(), { x: 5500, y: 440, w: 1150, pw: 700 }, 6000); await wait(3200);
  await tap([moses.hit, W.pathHit], moses.ring, { delay: 4000, stray: 3 });
  a.voice([146.8, 220, 293.7, 370], 9, { g: .09, a: 2.5, vow: [700, 1150] });
  tween(cam(), { x: 5480, y: 430, w: 1300, pw: 820 }, 12000);
  S.follow = true;
  X.walk(4860, 54); await wait(9000);
}
