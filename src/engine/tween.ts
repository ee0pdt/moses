import { io, type Ease } from './math';
import { DEV } from './dev';

type Num = Record<string, number>;
interface Tw { o: Num; from: Num; to: Num; ms: number; ease: Ease; t: number; res: () => void }

/**
 * A tiny tween scheduler. Every animated value in the film is a plain number
 * on a plain object; `tween` returns a promise so the story reads as a script.
 * Starting a tween on a key that is already animating takes that key over.
 */
class Tweens {
  private set = new Set<Tw>();
  private hooks = new Set<() => void>();

  tween<T extends object>(o: T, to: Partial<Record<keyof T, number>>, ms: number, ease: Ease = io): Promise<void> {
    const oo = o as unknown as Num, tt = to as Num;
    this.release(oo, tt);
    return new Promise(res => {
      const from: Num = {};
      for (const k in tt) from[k] = oo[k];
      this.set.add({ o: oo, from, to: { ...tt }, ms: Math.max(1, ms), ease, t: 0, res });
    });
  }

  wait(ms: number) { return this.tween({}, {}, ms); }

  /** Jump straight to values, cancelling any tween on those keys. */
  cut<T extends object>(o: T, p: Partial<T>) {
    this.release(o as unknown as Num, p as Num);
    Object.assign(o, p);
  }

  update(dtMs: number) {
    for (const t of [...this.set]) {
      t.t += dtMs;
      const u = Math.min(1, t.t / t.ms), e = t.ease(u);
      for (const k in t.to) t.o[k] = t.from[k] + (t.to[k] - t.from[k]) * e;
      if (u >= 1) { this.set.delete(t); t.res(); }
    }
  }

  /**
   * Drop everything. Pending tweens never resolve, so a running story script
   * simply stops at its next await; cancel hooks (input prompts, intervals)
   * run so nothing is left listening or ticking.
   */
  clear() {
    this.set.clear();
    const h = [...this.hooks]; this.hooks.clear();
    h.forEach(f => f());
  }

  /** Run `fn` on the next clear(); returns an unregister function. */
  onClear(fn: () => void) { this.hooks.add(fn); return () => { this.hooks.delete(fn); }; }

  /** setInterval that respects ?speed and stops on clear(). Returns a stop function. */
  every(ms: number, fn: () => void) {
    const id = setInterval(fn, ms / DEV.speed);
    const off = this.onClear(() => clearInterval(id));
    return () => { clearInterval(id); off(); };
  }

  private release(o: Num, keys: Num) {
    for (const t of this.set) if (t.o === o) for (const k in keys) delete t.to[k];
  }
}

export const tweens = new Tweens();
export const tween = tweens.tween.bind(tweens);
export const wait = tweens.wait.bind(tweens);
export const cut = tweens.cut.bind(tweens);
export const every = tweens.every.bind(tweens);
