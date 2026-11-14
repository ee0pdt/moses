import type { AudioEngine } from '../../engine/audio';

/** Hijaz-flavoured scale on D, for the mother's hum. */
const N = { D: 293.66, Eb: 311.13, Fs: 369.99, G: 392, A: 440, Bb: 466.16, C: 523.25, d: 587.33 };

/** Named sound cues for this chapter. */
export const makeSfx = (a: AudioEngine) => ({
  /** The mother hums: a lullaby phrase. Returns its length in seconds. */
  lullaby(g = .055, when = 0, phrase = 0) {
    const tunes = [
      [[N.A, .9], [N.G, .45], [N.Fs, .45], [N.G, .9], [N.Fs, .45], [N.Eb, .45], [N.D, 1.8]],
      [[N.Fs, .45], [N.G, .45], [N.A, .9], [N.Bb, .45], [N.A, .45], [N.G, .9], [N.Fs, .45], [N.Eb, .45], [N.D, 2]],
    ];
    let t = when;
    for (const [f, d] of tunes[phrase % 2]) { a.voice([f], d * 1.12 + .3, { g, a: .14, when: t, vow: [330, 820] }); t += d; }
    return t - when;
  },
  /** A newborn's wail. */
  cry(g = .045, when = 0) {
    a.tn(430, .5, { type: 'sawtooth', f2: 540, g, a: .05, trem: 9, lp: 1600, rv: .25, when });
    a.tn(540, .7, { type: 'sawtooth', f2: 380, g, a: .03, trem: 8, lp: 1500, rv: .25, when: when + .5 });
  },
  whimper: () => a.tn(470, .35, { type: 'sawtooth', f2: 400, g: .025, a: .06, trem: 10, lp: 1300, rv: .3 }),
  coo: () => { a.tn(520, .22, { f2: 760, g: .045, a: .03, rv: .4 }); a.tn(760, .25, { f2: 600, g: .035, when: .22, rv: .4 }); },
  /** A harp arpeggio: the court of Pharaoh. */
  harp(root = 293.66, when = 0) {
    [1, 1.5, 2, 2.52, 3, 4].forEach((k, i) => a.tn(root * k, 2.2, { type: 'triangle', g: .05, a: .004, lp: 2800, rv: .7, when: when + i * .14 }));
  },
  step: (g = .06) => a.nz(.09, { type: 'lowpass', f: 240, g }),
  march: (lv: number) => { a.nz(.13, { type: 'lowpass', f: 120, g: .18 * lv }); if (Math.random() < .5) a.tn(2300 + Math.random() * 600, .07, { type: 'triangle', g: .012 * lv }); },
  heartbeat: () => { a.tn(58, .2, { f2: 40, g: .28 }); a.tn(58, .2, { f2: 40, g: .2, when: .3 }); },
  snuff: () => { a.nz(.22, { type: 'highpass', f: 2400, g: .09, a: .01 }); a.nz(.3, { type: 'lowpass', f: 300, g: .06 }); },
  rustle: () => a.nz(.35, { f: 700, f2: 1800, q: .7, g: .06, a: .06 }),
  daub: () => a.nz(.5, { type: 'lowpass', f: 420, f2: 260, g: .1, a: .05 }),
  thump: () => a.nz(.2, { type: 'lowpass', f: 160, g: .3 }),
  splash: () => { a.nz(.6, { f: 1300, f2: 280, q: .8, g: .13, rv: .3 }); a.nz(.4, { type: 'lowpass', f: 280, g: .18 }); },
  drips: () => [0, 1, 2, 3].forEach(i => a.tn(1500 - i * 140, .12, { f2: 900, g: .03, when: .15 + i * .19 + Math.random() * .06, rv: .4 })),
  chime: () => [587.33, 880, 1174.7, 1318.5].forEach((f, i) => a.tn(f, 2.6, { g: .04, a: .03, when: i * .1, rv: .8 })),
});
export type Sfx = ReturnType<typeof makeSfx>;
