import { at, show } from '../../engine/dom';
import { io, lin, out, inn } from '../../engine/math';
import { tween, wait, cut, every } from '../../engine/tween';
import { walkTo } from '../../characters/figure';
import { PROPS } from '../../characters/moses';
import type { Scene } from './scene';
import { RB, BANK, WATER, HIDE1, HIDE2, REST, LAMP_X } from './world';

/**
 * Exodus 1:22 – 2:10, as a script. Each `await` is a beat; `tap` is where the
 * film waits for the viewer.
 */
export async function story(X: Scene) {
  const { S, W, I, sfx, ctx, cast, soldiers } = X;
  const { tap } = ctx.input;
  const { mother, miriam, princess, maid1 } = cast;
  const cam = () => X.cam;

  // 1 · Goshen, at night. A mother hums to her newborn son. (2:1–2)
  tween(S, { black: 0 }, 3000);
  tween(cam(), { x: -20, w: 700, pw: 580 }, 20000, lin);
  await wait(1400);
  await wait(sfx.lullaby(.055, 0, 0) * 1000 + 500);
  sfx.lullaby(.045, 0, 1);
  await wait(3600);

  // 2 · "Every son that is born ye shall cast into the river" (1:22) — soldiers in the street
  tween(S, { march: .45, torch: .55 }, 3000); tween(S, { patrol: -260 }, 5600, lin);
  tween(cam(), { x: 0, pw: 660 }, 4000);                         // on a phone, bring the window into frame
  await wait(1500);
  // the baby stirs at the noise; she rocks him closer and hushes him; his sister looks up
  tween(miriam.P, { h: -14 }, 600);
  mother.toPose('hush', 900); tween(S, { hush: 1 }, 900);
  sfx.whimper(); await wait(500); sfx.shh(); await wait(1000); sfx.whimper(); sfx.shh(.04);
  await tap([W.lampHit], W.lampRing, { delay: 2600, stray: 3 });

  // 3 · his sister creeps to the lamp, reaches up on tiptoe, and pinches it out
  await miriam.toPose('stand', 350);
  await walkTo(S.mi, LAMP_X + 12, 64);
  miriam.toPose('snuff', 450); await tween(S.mi, { hop: 6 }, 450, out);
  await wait(200);
  sfx.snuff(); tween(S, { lamp: 0 }, 240, out); S.smoke = 1; tween(S, { smoke: 0 }, 2800);
  X.palette('dark', .8);
  tween(S, { march: 1, torch: 1 }, 1500); const passing = tween(S, { patrol: -30 }, 3400, lin);
  await wait(400);
  tween(S.mi, { hop: 0 }, 300); miriam.toPose('stand', 300); await wait(250);
  await walkTo(S.mi, -132, 60); miriam.toPose('hide', 600);
  await passing;
  // they stop at the window; the torch is lifted to look in
  tween(S, { march: 0 }, 250);
  await wait(500);
  soldiers[1].toPose('peer', 1000); tween(S, { peer: 1 }, 1000);
  await wait(1300);

  // close on her face: eyes on the window, then shut; the baby frets; she holds him to her cheek
  Object.assign(S, { look: 1, eyeLid: 0, bow: .3, shh: 0, fuss: 0 });
  cut(X.hcam, { w: 640, pw: 440 }); show(I.hush, true); tween(X.hcam, { w: 560, pw: 400 }, 9000, lin);
  sfx.heartbeat(); await wait(1100);
  tween(S, { eyeLid: 1, look: .2 }, 700); sfx.heartbeat(); await wait(1000);
  tween(S, { fuss: 1 }, 300); sfx.whimper();
  tween(S, { bow: 1, shh: 1 }, 700); sfx.shh(); await wait(900);
  sfx.heartbeat(); tween(S, { fuss: 0 }, 1400); await wait(1100);
  // a soldier waves them on; the torch comes down
  soldiers[0].toPose('waveOn', 600); soldiers[1].toPose('torch', 900); tween(S, { peer: 0 }, 900);
  await wait(700); soldiers[0].toPose('spear', 600);
  tween(S, { march: 1 }, 300); tween(S, { patrol: 560 }, 5400, lin); tween(S, { torch: 0 }, 5400, inn);
  await wait(900); tween(S, { eyeLid: 0, shh: 0 }, 900); tween(S, { look: 1 }, 1200);
  await wait(1700);
  show(I.hush, false);
  // and they are gone
  await wait(1200); tween(S, { march: 0 }, 1600);
  tween(S, { hush: 0 }, 2000); miriam.toPose('kneel', 1400); tween(miriam.P, { h: 0 }, 1400);
  await wait(1800);

  // 4 · "she hid him three months" (2:2)
  await mother.toPose('sitCradle', 1500); tween(S, { rock: .6 }, 1200);
  X.palette('lamp', 3); tween(S, { lamp: .8 }, 2400); tween(S, { moon: 1 }, 1600);
  sfx.lullaby(.035, .6, 0);
  await tween(S, { months: 3 }, 7600, io);
  tween(S, { moon: 0 }, 900); tween(S, { dawnWin: 1 }, 2600);
  // and when she could no longer hide him (2:3)
  tween(S, { rock: 0 }, 500); sfx.cry(.05); await wait(1300); sfx.cry(.055);
  tween(mother.P, { h: -6 }, 600); await wait(1800);
  await tween(S, { black: 1 }, 1400);

  // 5 · "an ark of bulrushes … daubed it with slime and with pitch" (2:3)
  show(I.weave, true); X.palette('lamp', 0);
  tween(S, { black: 0 }, 1200); tween(X.wcam, { w: 690, pw: 430 }, 24000, lin);
  for (let r = 0; r < 3; r++) {
    at(I.wRing, 'cy', 98 - Math.floor(S.weave) * 30 + 14);
    await tap([I.wHit], I.wRing, { delay: 2600, stray: 1 });
    S.weaving = 1; const stop = every(240, sfx.rustle);
    await tween(S, { weave: Math.floor(S.weave) + 1 }, 1500, io);
    stop(); S.weaving = 0;
  }
  at(I.wRing, 'cy', 50);
  await tap([I.wHit], I.wRing, { delay: 2600, stray: 1 });
  { const stop = every(380, sfx.daub); await tween(S, { pitch: 1 }, 2400, io); stop(); }
  await wait(400); tween(S, { handOut: 1 }, 1100, inn); await wait(700);
  // she lays the child in it
  sfx.coo(); await tween(S, { babyIn: 1 }, 2800, io);
  sfx.lullaby(.04, 0, 1); await wait(2200);
  at(I.wRing, 'cy', -40);
  await tap([I.wHit], I.wRing, { delay: 3000, stray: 1 });
  await tween(S, { lid: 1 }, 1100, inn); sfx.thump(); await wait(1500);
  await tween(S, { black: 1 }, 1500);
  show(I.weave, false);

  // 6 · dawn at the river: "she laid it in the flags by the river's brink" (2:3)
  X.setSet('B'); X.palette('rdawn', 0);
  cut(cam(), { x: RB - 640, y: 470, w: 980, pw: 560 });
  S.rock = 0;
  Object.assign(S.mo, { x: RB - 1150, y: 632, f: 1, rim: .35, lean: 0 });
  mother.setProp(PROPS.basket); mother.propOn = true; mother.toPose('carry');
  Object.assign(S.mi, { x: RB - 1250, y: BANK, f: 1, hop: 0, rim: .3 }); miriam.toPose('stand');
  tween(S, { black: 0 }, 2600);
  walkTo(S.mi, RB - 300, 46); tween(cam(), { x: RB - 300 }, 8000);
  await walkTo(S.mo, RB - 170, 46);
  await mother.toPose('place', 1300);
  mother.propOn = false; Object.assign(S, { bOn: true, bx: RB - 140, by: BANK - 20, bob: 0, btilt: 0, bWet: 0 });
  at(W.basketW, 'display', 'inline');
  await tap([W.basketHit], W.basketRing, { delay: 3000 });
  // she lets it go
  mother.toPose('push', 600);
  tween(S, { bx: RB - 70, by: WATER }, 1500, out);
  await wait(320); sfx.splash(); S.rip = 0; tween(S, { rip: 1 }, 2600, out); tween(S, { bWet: 1 }, 500); tween(S, { bob: 1 }, 1800);
  await wait(1700);
  await mother.toPose('place', 900); tween(mother.P, { h: 24 }, 1400);
  await wait(2600);

  // 7 · she goes; "his sister stood afar off, to wit what would be done to him" (2:4)
  await mother.toPose('stand', 1200);
  walkTo(S.mi, HIDE1 - 26, 40).then(() => miriam.toPose('crouch', 800));
  await walkTo(S.mo, RB - 560, 38); await wait(500);
  S.mo.f = 1; await wait(1800); S.mo.f = -1;
  walkTo(S.mo, RB - 1600, 44);
  // the current carries it along the reeds
  tween(S, { bx: HIDE2 + 40 }, 9500, io); tween(cam(), { x: RB + 60 }, 9500, io);
  await wait(3600);
  await tap([miriam.hit], miriam.ring, { delay: 3000 });
  miriam.toPose('sneak', 400); await walkTo(S.mi, HIDE2 - 26, 32); miriam.toPose('crouch', 700);
  tween(S, { bx: REST }, 7500, io); tween(cam(), { x: RB + 340, w: 1060, pw: 600 }, 7500, io);

  // 8 · the white heat of day; "the daughter of Pharaoh came down to wash herself" (2:5)
  X.palette('rday', 6); tween(S, { sun: 1 }, 6000); tween(S.mi, { rim: 0 }, 4000);
  await wait(4200); tween(S, { bob: .55 }, 2500);
  sfx.harp(293.66);
  walkTo(S.m2, RB + 770, 40); walkTo(S.m1, RB + 690, 40);
  [S.pr, S.m1, S.m2].forEach(m => tween(m, { rim: .75 }, 3000));
  await walkTo(S.pr, RB + 610, 40);
  await wait(600); await princess.toPose('look', 700); await wait(800);
  princess.toPose('point', 700); sfx.harp(440, .2);
  await tap([W.basketHit], W.basketRing, { delay: 3000 });

  // 9 · "she sent her maid to fetch it" — drawn out of the water
  princess.toPose('stand', 700);
  await walkTo(S.m1, REST + 44, 44);
  await maid1.toPose('reachLow', 800);
  W.bFigs.before(W.basketW);                                    // now in front of the bank
  tween(S, { bob: 0, btilt: -6 }, 400);
  await tween(S, { bx: REST + 22, by: BANK - 40 }, 1300, io); sfx.drips(); tween(S, { bWet: 0 }, 300);
  S.bOn = false; at(W.basketW, 'display', 'none');
  maid1.propOn = true; await maid1.toPose('carry', 600);
  S.m1.f = 1; await walkTo(S.m1, RB + 580, 40); S.m1.f = -1;
  await maid1.toPose('place', 900);
  maid1.propOn = false; Object.assign(S, { bOn: true, bx: S.m1.x - 34, by: BANK - 4, btilt: 0, bob: 0, bWet: 0 });
  at(W.basketW, 'display', 'inline');
  maid1.toPose('stand', 700); walkTo(S.m1, RB + 680, 40).then(() => { S.m1.f = -1; });
  await wait(500);
  await princess.toPose('kneel', 900); sfx.chime(); await wait(1200);

  // 10 · "when she had opened it, she saw the child: and, behold, the babe wept" (2:6)
  await tween(S, { black: 1 }, 500);
  Object.assign(S, { open: 0, cry: 0, reach: 0, grip: 0 }); cut(X.ocam, { w: 740, pw: 470 });
  show(I.open, true); tween(S, { black: 0 }, 700); tween(X.ocam, { w: 660, pw: 420 }, 16000, lin);
  await tap([I.oLidHit], I.oLidRing, { delay: 2600, stray: 2 });
  sfx.rustle(); await tween(S, { open: 1 }, 1300, io);
  tween(S, { cry: 1 }, 400); sfx.cry(); const stopCry = every(1400, () => sfx.cry());
  await wait(1800);
  // "and she had compassion on him"
  await tap([I.oBabyHit], I.oBabyRing, { delay: 2400, stray: 2 });
  await tween(S, { reach: 1 }, 1800, io); stopCry(); tween(S, { cry: 0 }, 700);
  await wait(500); await tween(S, { grip: 1 }, 700, out); sfx.coo(); await wait(2600);
  await tween(S, { black: 1 }, 900);
  show(I.open, false);

  // she holds him
  princess.propOn = true; princess.toPose('cradle'); S.bOn = false; at(W.basketW, 'display', 'none');
  cut(cam(), { x: RB + 500, y: 500, w: 780, pw: 420 });
  tween(S, { black: 0 }, 1200); await wait(1500);

  // 11 · his sister: "Shall I go and call to thee a nurse of the Hebrew women?" (2:7)
  await tap([miriam.hit], miriam.ring, { delay: 3000 });
  miriam.toPose('stand', 400); await walkTo(S.mi, RB + 520, 72);
  await miriam.toPose('bow', 600); await wait(1200);
  miriam.toPose('point', 500); S.mi.f = -1; await wait(900);
  await tween(princess.P, { h: 26 }, 400); await tween(princess.P, { h: 14 }, 500);
  miriam.toPose('stand', 300); walkTo(S.mi, RB - 300, 125); await wait(2000);
  await tween(S, { black: 1 }, 1000);

  // "And the maid went and called the child's mother" (2:8)
  cut(cam(), { x: RB + 420, y: 490, w: 900, pw: 540 });
  Object.assign(S.mo, { x: RB - 60, f: 1, rim: .2 }); mother.propOn = false; mother.toPose('stand');
  Object.assign(S.mi, { x: RB - 10, f: 1 });
  tween(S, { black: 0 }, 1000);
  walkTo(S.mi, RB + 455, 52); await walkTo(S.mo, RB + 515, 46);

  // 12 · "Take this child away, and nurse it for me" (2:9)
  await mother.toPose('bow', 800); await wait(700);
  princess.toPose('give', 1100); await mother.toPose('give', 1100);
  princess.propOn = false; mother.setProp(PROPS.bundle); mother.propOn = true; sfx.coo();
  princess.toPose('stand', 900); await mother.toPose('cradle', 900);
  sfx.chime(); await wait(1200);

  // 13 · "and she called his name Moses: because I drew him out of the water" (2:10)
  princess.toPose('bless', 1400);
  sfx.harp(293.66, .4); sfx.lullaby(.05, 1.6, 0);
  tween(S, { rock: .6 }, 2000);
  tween(cam(), { x: RB + 380, y: 440, w: 1500, pw: 780 }, 15000, io);
  await wait(3000); princess.toPose('stand', 1600);
  await wait(7000);
}
