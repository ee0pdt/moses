import { smooth } from './math';

/**
 * All sound is synthesised at runtime with WebAudio — no audio files.
 * Two noise "beds" (wind, roar) run continuously and are steered each frame;
 * one-shots are noise bursts (nz), tones (tn) and formant voices (voice).
 */
export interface NzOpts { type?: BiquadFilterType; f?: number; f2?: number; q?: number; g?: number; a?: number; rv?: number; when?: number }
export interface TnOpts { type?: OscillatorType; g?: number; a?: number; f2?: number; rv?: number; when?: number; trem?: number; lp?: number }
export interface VoiceOpts { g?: number; a?: number; when?: number; vow?: number[] }
export interface Beds { wind: number; roar: number; crackleRate: number; crackleGain: number }

interface Bed { f: BiquadFilterNode; g: GainNode }

export class AudioEngine {
  ctx: AudioContext | null = null;
  muted = false;
  private master!: GainNode;
  private rev!: ConvolverNode;
  private nb!: AudioBuffer;
  private wind!: Bed;
  private roar!: Bed;

  /** Must be called from a user gesture (iOS). */
  init() {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C || this.ctx) return;
    try {
      const c = this.ctx = new C();
      this.master = c.createGain(); this.master.gain.value = this.muted ? 0 : 1; this.master.connect(c.destination);
      const len = c.sampleRate * 3 | 0, ir = c.createBuffer(2, len, c.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
      this.rev = c.createConvolver(); this.rev.buffer = ir;
      const rg = c.createGain(); rg.gain.value = .5; this.rev.connect(rg); rg.connect(this.master);
      const nl = c.sampleRate * 2 | 0; this.nb = c.createBuffer(1, nl, c.sampleRate);
      const nd = this.nb.getChannelData(0); for (let i = 0; i < nl; i++) nd[i] = Math.random() * 2 - 1;
      this.wind = this.bed('bandpass', 420, .7);
      this.roar = this.bed('lowpass', 300, .5);
      c.resume?.();
      document.addEventListener('visibilitychange', () => { document.hidden ? c.suspend() : c.resume(); });
    } catch { this.ctx = null; }
  }

  setMuted(m: boolean) { this.muted = m; if (this.ctx) this.master.gain.value = m ? 0 : 1; }

  private bed(type: BiquadFilterType, f: number, q: number): Bed {
    const c = this.ctx!, s = c.createBufferSource(); s.buffer = this.nb; s.loop = true;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = c.createGain(); g.gain.value = 0; s.connect(fl); fl.connect(g); g.connect(this.master); s.start();
    return { f: fl, g };
  }

  private send(node: AudioNode, rv: number) {
    node.connect(this.master);
    if (rv) { const r = this.ctx!.createGain(); r.gain.value = rv; node.connect(r); r.connect(this.rev); }
  }

  private env(g: GainNode, t: number, peak: number, a: number, dur: number) {
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  }

  /** Filtered noise burst. */
  nz(dur: number, { type = 'bandpass', f = 1000, f2, q = 1, g = .3, a = .005, rv = 0, when = 0 }: NzOpts = {}) {
    if (!this.ctx) return;
    try {
      const c = this.ctx, t = c.currentTime + when, s = c.createBufferSource(); s.buffer = this.nb; s.loop = true;
      const fl = c.createBiquadFilter(); fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t);
      if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
      const gn = c.createGain(); this.env(gn, t, g, a, dur); s.connect(fl); fl.connect(gn); this.send(gn, rv);
      s.start(t, Math.random() * 1.5); s.stop(t + dur + .05);
    } catch { /* ignore */ }
  }

  /** Oscillator tone, optional glide / tremolo / lowpass. */
  tn(freq: number, dur: number, { type = 'sine', g = .2, a = .01, f2, rv = 0, when = 0, trem = 0, lp = 0 }: TnOpts = {}) {
    if (!this.ctx) return;
    try {
      const c = this.ctx, t = c.currentTime + when, o = c.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(freq, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      const gn = c.createGain(); this.env(gn, t, g, a, dur); let node: AudioNode = o;
      if (lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; node.connect(f); node = f; }
      if (trem) {
        const tg = c.createGain(); tg.gain.value = .6;
        const l = c.createOscillator(); l.frequency.value = trem;
        const ld = c.createGain(); ld.gain.value = .4; l.connect(ld); ld.connect(tg.gain); l.start(t); l.stop(t + dur + .05);
        node.connect(tg); node = tg;
      }
      node.connect(gn); this.send(gn, rv); o.start(t); o.stop(t + dur + .05);
    } catch { /* ignore */ }
  }

  /** A choir-like formant voice: detuned saws through vowel bandpasses. */
  voice(freqs: number[], dur: number, { g = .16, a = .5, when = 0, vow = [600, 1040] }: VoiceOpts = {}) {
    if (!this.ctx) return;
    try {
      const c = this.ctx, t = c.currentTime + when, o = c.createGain();
      o.gain.setValueAtTime(.0001, t); o.gain.linearRampToValueAtTime(g, t + a);
      o.gain.setValueAtTime(g, t + Math.max(a + .01, dur - .9)); o.gain.linearRampToValueAtTime(.0001, t + dur);
      const fs = vow.map(f => { const b = c.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = 6; b.connect(o); return b; });
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340;
      const lg = c.createGain(); lg.gain.value = .5; lp.connect(lg); lg.connect(o);
      const l = c.createOscillator(); l.frequency.value = 4.6;
      const ld = c.createGain(); ld.gain.value = 2.2; l.connect(ld); l.start(t); l.stop(t + dur + .1);
      freqs.forEach(f => [-7, 6].forEach(det => {
        const os = c.createOscillator(); os.type = 'sawtooth'; os.frequency.value = f; os.detune.value = det; ld.connect(os.frequency);
        fs.forEach(b => os.connect(b)); os.connect(lp); os.start(t); os.stop(t + dur + .1);
      }));
      this.send(o, .9);
    } catch { /* ignore */ }
  }

  /** Steer the continuous beds; call once per frame. */
  frame(dt: number, T: number, b: Beds) {
    if (!this.ctx) return;
    const w = b.wind * (.7 + .3 * Math.sin(T * .37) + .15 * Math.sin(T * 1.1));
    this.wind.g.gain.value += (w - this.wind.g.gain.value) * smooth(.04, dt);
    this.wind.f.frequency.value = 400 + 150 * Math.sin(T * .23) + 70 * Math.sin(T * .71);
    this.roar.g.gain.value += (b.roar - this.roar.g.gain.value) * smooth(.08, dt);
    if (Math.random() < dt * b.crackleRate)
      this.nz(.03 + Math.random() * .04, { type: 'highpass', f: 1800 + Math.random() * 3000, g: (.04 + Math.random() * .16) * b.crackleGain });
  }
}
