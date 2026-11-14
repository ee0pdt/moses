# Notes for Claude

Interactive animated film (Vite + TypeScript, SVG + WebAudio, no assets). Read
`docs/ARCHITECTURE.md` and `docs/ART.md` before changing rendering or art.

- `npm run typecheck` must pass; `npm run smoke` (with `npm run dev` running) checks
  the menu and plays every chapter headlessly via `?auto&speed=6`; it must finish without errors.
- New chapters go in `src/chapters/<id>/` and are registered in `src/chapters/index.ts`.
- In story scripts use `every()` (not `setInterval`) so switching chapters cancels it.
- Keep the render loop allocation-light and read-free (see Performance rules).
- Use `smooth(k, dt)` for any per-frame easing; never assume 60 Hz.
- No on-screen text in the film (the chapter menu's titles are the exception).
  Every `tap()` needs a hint ring and stray-tap fallback.
- `prototype/` is the original reference; don't edit it.
