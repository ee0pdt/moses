import { DEV } from './dev';

/** requestAnimationFrame loop with a clamped, scaled delta in seconds. */
export function startLoop(cb: (dt: number, T: number) => void) {
  let last = 0, T = 0;
  const frame = (ts: number) => {
    const dt = Math.min(.05, (ts - (last || ts)) / 1000) * DEV.speed;
    last = ts; T += dt;
    cb(dt, T);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
