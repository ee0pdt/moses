import type { AudioEngine } from '../engine/audio';
import type { Input } from '../engine/input';

/** What the shell hands a chapter. */
export interface ChapterCtx {
  stage: HTMLElement;   // carries data-t (time of day palette)
  scene: HTMLElement;   // the chapter owns everything inside this
  black: HTMLElement;   // fade-to-black overlay (chapter drives its opacity)
  flash: HTMLElement;   // white flash overlay
  audio: AudioEngine;
  input: Input;
}

/**
 * A chapter is one self-contained episode of the film (a "scene" in film
 * terms). The shell mounts it once, renders it every frame, and plays it.
 */
export interface Chapter {
  id: string;          // also the URL hash: #basket
  title: string;
  ref: string;         // scripture reference
  /** Menu tile art: inner SVG markup for a 160×120 viewBox. */
  cover: string;
  mount(ctx: ChapterCtx): void;
  /** Tear down everything mount() made (the shell clears tweens first). */
  unmount(): void;
  /** Return to the first frame (black). */
  reset(): void;
  render(dt: number, T: number): void;
  /** Run the chapter's script; resolves when it has reached its last beat. */
  play(): Promise<void>;
  fadeOut(): Promise<void>;
  /** Live scene for the console (__moses.X). */
  inspect?(): unknown;
}
