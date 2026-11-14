import { DEV } from './dev';

export interface TapOpts { delay?: number; stray?: number }

/**
 * Touch handling. The film never shows text or buttons for its beats: it waits
 * for a touch on the thing that matters. After `delay` ms a ring breathes on
 * it as a hint; `stray` taps anywhere else also move the film on, so nobody
 * gets stuck.
 */
export function createInput(stage: HTMLElement) {
  stage.addEventListener('pointerdown', e => {
    if ((e.target as Element).closest('button')) return;
    const r = document.createElement('div');
    r.className = 'rip';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    stage.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });

  const ms = (v: number) => v / DEV.speed;

  /** Resolve on a touch on any of `targets` (or `stray` touches elsewhere). */
  function tap(targets: Element[], ring: Element | null, { delay = 4500, stray = 4 }: TapOpts = {}) {
    return new Promise<void>(res => {
      let n = 0, done = false;
      const finish = () => {
        if (done) return; done = true;
        clearTimeout(tm); clearTimeout(au);
        targets.forEach(t => { t.removeEventListener('pointerdown', finish); t.classList.remove('live'); });
        stage.removeEventListener('pointerdown', any);
        ring?.classList.remove('on');
        res();
      };
      const any = (e: Event) => { if ((e.target as Element).closest('button')) return; if (++n >= stray) finish(); };
      const tm = setTimeout(() => ring?.classList.add('on'), ms(delay));
      const au = DEV.auto ? setTimeout(finish, ms(delay * .4 + 400)) : 0;
      targets.forEach(t => { t.addEventListener('pointerdown', finish); t.classList.add('live'); });
      stage.addEventListener('pointerdown', any);
    });
  }

  /** Call `cb` once when `target` is touched (no stray fallback). */
  function once(target: Element, ring: Element | null, delay: number, cb: () => void) {
    let done = false;
    const fire = () => {
      if (done) return; done = true;
      clearTimeout(tm); clearTimeout(au);
      target.removeEventListener('pointerdown', fire);
      target.classList.remove('live');
      ring?.classList.remove('on');
      cb();
    };
    target.addEventListener('pointerdown', fire);
    target.classList.add('live');
    const tm = setTimeout(() => ring?.classList.add('on'), ms(delay));
    const au = DEV.auto ? setTimeout(fire, ms(delay * .4 + 400)) : 0;
  }

  return { tap, once };
}

export type Input = ReturnType<typeof createInput>;
