export type Ease = (u: number) => number;

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const io: Ease = u => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
export const lin: Ease = u => u;
export const out: Ease = u => 1 - Math.pow(1 - u, 3);
export const inn: Ease = u => u * u * u;

/** Deterministic PRNG (mulberry32) so generated scenery is identical every run. */
export const rng = (s: number) => () => {
  s |= 0; s = s + 0x6D2B79F5 | 0;
  let t = Math.imul(s ^ s >>> 15, 1 | s);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

/**
 * Frame-rate independent smoothing factor. `k` is the fraction to close per
 * 60Hz frame; returns the equivalent for a frame of `dt` seconds, so 120Hz
 * ProMotion screens and 60Hz screens animate identically.
 */
export const smooth = (k: number, dt: number) => 1 - Math.pow(1 - k, dt * 60);
