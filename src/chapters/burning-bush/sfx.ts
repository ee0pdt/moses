import type { AudioEngine } from '../../engine/audio';

/** Named sound cues for this chapter. */
export const makeSfx = (a: AudioEngine) => ({
  bleat: (hi: boolean) => a.tn(hi ? 520 : 390, .5, { type: 'sawtooth', f2: hi ? 430 : 320, g: .07, a: .04, trem: 13, lp: 1700, rv: .25 }),
  chime: () => [880, 1174.7, 1318.5, 1760].forEach((f, i) => a.tn(f, 2.4, { g: .045, a: .03, when: i * .09, rv: .8 })),
  rumble: () => a.nz(3.2, { type: 'lowpass', f: 90, g: .9, a: .08, rv: .5 }),
  step: () => a.nz(.1, { type: 'lowpass', f: 260, g: .1 }),
});
export type Sfx = ReturnType<typeof makeSfx>;
