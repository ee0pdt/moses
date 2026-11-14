# Notes for Claude

Interactive animated film (Vite + TypeScript, SVG + WebAudio, no assets). Read
`docs/ARCHITECTURE.md` and `docs/ART.md` before changing rendering or art.

- `npm run typecheck` must pass; `npm run smoke` (with `npm run dev` running) plays
  every chapter headlessly via `?auto&speed=6` and must finish without errors.
- Keep the render loop allocation-light and read-free (see Performance rules).
- Use `smooth(k, dt)` for any per-frame easing; never assume 60 Hz.
- No on-screen text. Every `tap()` needs a hint ring and stray-tap fallback.
- `prototype/` is the original reference; don't edit it.
