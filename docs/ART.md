# Art direction

**References:** *Another World* (Éric Chahi) — flat polygons, cinematic
close-up inserts, silhouettes against light; modern minimalist mobile games —
few colours, generous negative space, motion that carries the emotion.

## Rules

- **Silhouette first.** Characters are a single ink colour (`--fig`). Light is
  added as a warm offset "rim" copy behind the ink, not as shading.
- **Paper-cut depth.** Scenery is flat cards in depth bands
  (`far → mount → mid → ground → fore1 → fore2`), each one colour, with parallax.
- **One palette per time of day.** Defined in `src/styles/palette.css`;
  switching `data-t` on the stage cross-fades the whole world.
  Current: `dusk`, `night`, `dawn`.
- **Fire is the only saturated thing** in the burning-bush chapter: reds,
  oranges, yellow, cream (`#c8321e #ef7a1a #f8c04a #fff3c4`). Keep one such
  accent per chapter (e.g. the Nile's blue, the Passover's red, Sinai's white).
- **Inserts** (close-ups: sandals, hand, face, the vision) are hand-drawn flat
  polygons with 2–3 tones per surface (base / light / shadow), lit from the
  side the light source is on.
- **No outlines, no gradients on characters, no text.**

## Motion

- Ease everything (`io` by default; `out` for reactions, `inn` for falls).
- Hold still before big moments; let silence and wind carry them.
- Reactions are physical and delayed: the snake moves *then* he jumps.
- Idle life everywhere: fire flicker, grazing, breathing camera drifts.
