import { createFigure, type Figure } from './figure';
export { POSES, type Motion, type PoseName } from './figure';

/** Heads and props for the cast. Local units: head centre at 0,0, facing +x. */
export const HEADS = {
  /** Headcloth with a hanging tail, and a beard. */
  moses: `<circle r="10.5"/><path d="M-11,-3 C-10,-15 7,-16 10,-5 C4,-8 -3,-7 -7,0 C-9,4 -12,6 -14,9 C-15,3 -14,-1 -11,-3Z"/><path data-r="tail" d="M-11,-3 C-9,-3 -6,-1 -7,0 C-11,8 -17,13 -21,23 C-22,11 -16,2 -11,-3Z"/><path d="M4,6 C11,6 13,13 8,22 C4,18 2,12 4,6Z"/>`,
  /** A long veil falling down the back. */
  mother: `<circle r="9.5"/><path d="M-11,-1 C-12,-14 6,-17 11,-6 C5,-9 -2,-8 -5,-2 C-7,3 -10,7 -12,9Z"/><path data-r="tail" d="M-11,-2 C-8,-2 -5,0 -6,2 C-8,14 -10,26 -9,40 C-17,31 -19,10 -11,-2Z"/>`,
  /** A girl: a cap of hair and a braid. */
  girl: `<circle r="10"/><path d="M-10,-2 C-11,-13 5,-15 10,-6 C4,-8 -2,-6 -4,-1Z"/><path data-r="tail" d="M-9,-3 C-7,-2 -6,0 -7,1 C-10,8 -11,14 -9,21 C-15,14 -14,3 -9,-3Z"/>`,
  /** Egyptian court wig: blunt bob, straight fringe, a lotus at the brow. */
  princess: `<circle r="9.5"/><path d="M-12,-3 C-13,-15 8,-18 12,-7 L12,-5 L3,-5 C1,-5 -1,-3 -1,0 L-1,15 L-13,15 C-14,8 -13,2 -12,-3Z"/><path d="M8,-11 L9,-19 L11.5,-13 L14,-18 L13.5,-10Z"/>`,
  maid: `<circle r="9.5"/><path d="M-12,-3 C-13,-15 8,-18 12,-7 L12,-5 L3,-5 C1,-5 -1,-3 -1,0 L-1,7 L-13,7 C-14,4 -13,0 -12,-3Z"/>`,
};

export const PROPS = {
  staff: `<path d="M2.5,64 L-1.5,-44 C-1.5,-56 10.5,-55 9.5,-45" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
  bundle: `<g transform="translate(-5,-6) rotate(-14)"><ellipse rx="13" ry="6.5"/><circle cx="12" cy="-3" r="4.6"/></g>`,
  basket: `<g transform="translate(-4,-4)"><path d="M-18,-6 L18,-6 C17,4 10,8 0,8 C-10,8 -17,4 -18,-6Z"/><path d="M-17,-7 C-10,-14 10,-14 17,-7Z"/></g>`,
  fan: `<path d="M0,44 L0,-58" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M0,-56 C-14,-64 -17,-84 0,-94 C17,-84 14,-64 0,-56Z"/>`,
};

/** Moses as a grown man: headcloth, beard, shepherd's staff. */
export const createMoses = (defs: SVGDefsElement) => createFigure(defs, { head: HEADS.moses, prop: PROPS.staff, ring: [28, -70, 42] });
export type Moses = Figure;
