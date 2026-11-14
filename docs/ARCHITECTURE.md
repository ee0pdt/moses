# Architecture

## Principles

1. **Everything animated is a number.** Scene state is a plain object of numbers
   (`S.fire`, `S.m.x`, `S.h.p` …). The story tweens those numbers; the renderer
   reads them every frame and writes SVG attributes. Nothing else animates
   (apart from a few CSS palette cross-fades and hint rings).
2. **The story is a script.** `story.ts` is a linear `async` function; each
   `await` is a beat. `tap()` is where it waits for the viewer. This keeps the
   direction readable — you can read a chapter like a screenplay.
3. **Procedural over keyframed.** Characters are rigs (IK limbs, a skinned robe)
   driven by a handful of pose numbers, so new poses are one line and every
   transition between them is smooth for free.
4. **Frame-rate independent.** Tweens advance by wall-clock delta; per-frame
   smoothing uses `smooth(k, dt)`, so 60 Hz, 120 Hz (ProMotion) and a dropped
   frame all look the same.
5. **No assets to load.** Art is inline SVG, sound is synthesised. The whole
   chapter is ~15 kB gzipped and starts instantly.

## Shell and chapters

`main.ts` owns the start screen, the chapter menu and the replay/menu buttons.
The start tap also requests full screen (`engine/fullscreen.ts`, skipped under
`?auto`); a toggle button by the sound button appears only where the browser
supports it and the app isn't already installed full screen.
Switching chapters calls `tweens.clear()` and `chapter.unmount()`. `clear()`
drops every tween, so a running story script just stops at its next `await`.
It also runs cancel hooks (`tweens.onClear`) that `tap()`/`once()` prompts and
`every()` intervals register, so nothing is left listening or ticking. Use
`every()` instead of `setInterval` in story scripts for that reason.

## Frame

```
rAF → loop.ts (dt clamped to 50 ms, × ?speed)
    → tweens.update(dt)          // story-driven values move
    → chapter.render(dt, T)      // scene reads values, writes SVG
        → audio.frame(...)       // continuous sound beds follow the scene
```

## Rendering

Retained-mode SVG in the DOM. Each world "set" is a stack of parallax layers
(`Layer { g, d, ref }`) offset by the camera; close-ups ("inserts") are separate
full-screen SVGs shown over the world. The camera (`fit`) sets the `viewBox`
and blends between a portrait framing (`pw`) and a landscape framing (`w`) so
the same shot composes well on a phone and a monitor.

Why SVG: resolution-independent at any DPR, authorable in any vector tool, hit
testing for free (`.hit` rects), CSS palettes. The cost is that the browser
re-rasterises changed regions every frame.

### Performance rules

- Write attributes, never read layout in the loop (`getBBox`, `getAttribute` on
  geometry, `offsetWidth` …).
- Cache element references at build time — no `querySelector` per frame.
- Round to 1–2 decimals before writing (`f1`) to keep attribute strings short.
- Avoid SVG filters and blur; fake glow with stacked flat polygons (`blob`) or
  a few radial gradients.
- Hide what is off-screen (`display="none"` on inactive sets/inserts).

### Known risks / next steps

- The fire is ~14 large radial-gradient circles redrawn every frame; on
  low-end Android this is the most likely place to drop frames. Profile on a
  real device first. If needed, the fallback is a Canvas2D (or WebGL, e.g. Pixi)
  layer for glows/particles beneath the SVG, keeping SVG for line art.
- Palette changes animate `fill` via CSS transitions on every card at once;
  fine now, worth watching as scenes grow.

## Adding a chapter

1. `src/chapters/<id>/` with an `index.ts` exporting a `Chapter`
   (see `src/chapters/types.ts`): `mount`, `reset`, `render`, `play`, `fadeOut`.
2. Put static art in `markup.ts`, generated art in `world.ts`, the per-frame
   renderer in `scene.ts`, the script in `story.ts`, sound cues in `sfx.ts`.
3. Build people with `createFigure(defs, { head, prop, scale, rim })` using
   `HEADS`/`PROPS` from `characters/moses.ts`; move them with `walkTo()`;
   add poses to `POSES` in `characters/figure.ts`. `belly` fills out the front
   of the robe; `fig.hand` is where the front hand was last drawn (e.g. to hang
   a torch's glow on it); `fig.part('flame')` finds a `data-r` part of the head
   or prop art to animate (look it up once, at build time).
4. Give it a `cover` (a 160×120 SVG tile) and add it to `src/chapters/index.ts`.
   It then appears in the menu and at `#<id>`, and the smoke test plays it.
5. Time-of-day palettes live in `styles/palette.css` (`data-t` on the stage);
   `--pal` sets the cross-fade length (e.g. a quick cut when a lamp goes out).

## Conventions

- World units: the ground line is y≈600; Moses is ~130 units tall.
- Ids inside chapter markup are global to the document; prefix if two chapters
  could ever be mounted at once.
- Interaction: every prompt has a hint ring after a delay and a stray-tap
  fallback, so no one is ever stuck. No text in the film itself; the chapter
  menu carries a title and scripture reference per tile.
