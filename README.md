# Moses

An animated, interactive film about the life of Moses, for phones (touch) and desktop.
Flat vector art, a minimal palette per scene, and fluid procedural animation —
in the spirit of *Another World* and modern minimalist iOS games.

There is no text on screen and no UI beyond sound and replay: the film pauses at
key beats and waits for you to touch the thing that matters (the far light, the
fire, a sandal, the staff, the hand). If you hesitate, a ring breathes on it.

**Status:** one chapter — *The Burning Bush* (Exodus 3–4) — the vertical slice.
See [docs/STORY.md](docs/STORY.md) for the planned arc.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173 (also on your LAN, for testing on a phone)
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/
```

`dist/` is fully static (relative paths), so it can be hosted anywhere or wrapped
later with Capacitor/WKWebView for the app stores.

### Development switches

| URL | Effect |
| --- | --- |
| `?speed=4` | run the film 4× faster |
| `?auto` | answer every touch prompt automatically |
| `?auto&speed=6` | watch the whole chapter in ~25 seconds |

In the browser console, `__moses.X` is the live scene (`__moses.X.S` is every
animated value, `__moses.X.cam` the camera).

### Smoke test

With the dev server running: `npm run smoke` plays the whole chapter at desktop
and phone sizes and fails on any page error (`-- --shots` saves frames to `shots/`).
Needs Playwright (`npm i -D playwright` if it isn't installed globally).

## Layout

```
index.html                 the shell: stage, overlays, mute / replay / start
src/main.ts                boots the shell, runs the loop, plays the chapter
src/engine/                no story knowledge — reusable across chapters
  tween.ts                 promise-based tweens; the story is written with them
  loop.ts  camera.ts       rAF loop (clamped dt) · aspect-aware camera framing
  input.ts                 tap-to-advance prompts, hint rings, ripples
  audio.ts                 synthesised WebAudio (no sound files)
src/characters/            Moses (procedural IK rig + poses), sheep & goats
src/art/                   generators for paper-cut scenery (ridges, glows)
src/styles/                shell CSS · time-of-day palettes
src/chapters/<id>/         one chapter: markup, world, scene (render), story (script)
prototype/                 the original single-file vertical slice, for reference
docs/                      architecture, art direction, story plan
```

More in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ART.md](docs/ART.md).
