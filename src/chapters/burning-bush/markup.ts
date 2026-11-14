import { FLAME_D } from '../../art/shapes';

/**
 * Static vector art for "The Burning Bush". The two world sets (A: the plain,
 * B: the mountain) are generated in world.ts; the close-up inserts below are
 * hand-authored flat polygons, Another World style.
 */

export const SKY = `
  <div class="sky dusk full"></div>
  <div class="sky night full"></div>
  <div class="sky dawn full"></div>
  <div class="stars full"></div>`;

export const WORLD = `
<svg id="world" class="full" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <radialGradient id="gGlow"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/><stop offset=".22" stop-color="#f8b83a" stop-opacity=".55"/><stop offset=".6" stop-color="#ef7a1a" stop-opacity=".16"/><stop offset="1" stop-color="#ef7a1a" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloudR"><stop offset="0" stop-color="#d23a1e" stop-opacity=".8"/><stop offset=".55" stop-color="#c8321e" stop-opacity=".4"/><stop offset="1" stop-color="#c8321e" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloudO"><stop offset="0" stop-color="#f58a1f" stop-opacity=".9"/><stop offset=".55" stop-color="#ef7a1a" stop-opacity=".45"/><stop offset="1" stop-color="#ef7a1a" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloudY"><stop offset="0" stop-color="#ffe08a" stop-opacity=".95"/><stop offset=".55" stop-color="#f8c95a" stop-opacity=".5"/><stop offset="1" stop-color="#f8c95a" stop-opacity="0"/></radialGradient>
    <radialGradient id="gCloudW"><stop offset="0" stop-color="#fffdf2"/><stop offset=".4" stop-color="#fff3c4" stop-opacity=".8"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
    <linearGradient id="gPath" x1="1" x2="0"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#f8d27a"/><stop offset="1" stop-color="#f8d27a" stop-opacity=".25"/></linearGradient>
    <path id="flame" d="${FLAME_D}"/>
  </defs>
  <g id="setA"></g>
  <g id="setB" display="none"></g>
</svg>`;

/* insert: the sandals */
const FEET = `
<svg id="feet" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#120a12"/>
  <polygon id="fGlow" points="330,-3000 3000,-3000 3000,3000 560,3000 440,200 500,-400" fill="#8a4a26"/>
  <path d="M-3000,3000 L-3000,18 L-420,8 L-300,-22 L-180,14 L40,22 L260,-6 L420,16 L3000,6 L3000,3000Z" fill="#1b1326"/>
  <rect x="-3000" y="60" width="6000" height="3000" fill="#150d14"/>
  <rect x="-3000" y="60" width="6000" height="4" fill="#e8a25a" opacity=".3"/>
  <g id="holy" opacity="0"><polygon points="-520,66 -220,34 200,30 520,60 260,104 -240,108" fill="#fff3c4" opacity=".45"/><polygon points="-300,66 -120,48 140,46 300,64 150,86 -130,88" fill="#ffffff" opacity=".6"/></g>
  <rect id="holyLine" x="-3000" y="59" width="6000" height="3" fill="#fff3c4" opacity="0"/>
  <g id="footFar" transform="translate(-75,54) scale(.88)">
    <g class="leg"><path d="M-27,-240 L-31,-22 L-27,-4 L-11,0 L61,0 L74,-4 L73,-13 L47,-21 L26,-30 L17,-42 L15,-240Z" fill="#e8a25a"/><path d="M-30,-240 L-34,-22 L-30,-4 L-14,0 L58,0 L71,-4 L70,-13 L44,-21 L23,-30 L14,-42 L12,-240Z" fill="#6e4530"/></g>
    <g class="sandal"><path d="M-40,0 L74,0 C80,0 80,9 74,9 L-40,9 C-46,9 -46,0 -40,0Z" fill="#33200f"/><path d="M26,1 L33,-25 M51,1 L45,-19 M-34,-31 L14,-35 M-31,1 L-33,-30 M13,-35 L30,-2" stroke="#b08d5c" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <circle class="ring" cx="16" cy="-12" r="52"/><rect class="hit" x="-70" y="-90" width="170" height="130"/>
  </g>
  <g id="footNear" transform="translate(40,62)">
    <g class="leg"><path d="M-27,-240 L-31,-22 L-27,-4 L-11,0 L61,0 L74,-4 L73,-13 L47,-21 L26,-30 L17,-42 L15,-240Z" fill="#f0aa5e"/><path d="M-30,-240 L-34,-22 L-30,-4 L-14,0 L58,0 L71,-4 L70,-13 L44,-21 L23,-30 L14,-42 L12,-240Z" fill="#9a6240"/></g>
    <g class="sandal"><path d="M-40,0 L74,0 C80,0 80,9 74,9 L-40,9 C-46,9 -46,0 -40,0Z" fill="#3b2416"/><path d="M26,1 L33,-25 M51,1 L45,-19 M-34,-31 L14,-35 M-31,1 L-33,-30 M13,-35 L30,-2" stroke="#c7a06a" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <circle class="ring" cx="16" cy="-12" r="56"/><rect class="hit" x="-60" y="-90" width="170" height="140"/>
  </g>
  <path d="M-197,-900 L-227,-200 L-212,-82 L-117,-98 L-57,-74 L53,-96 L113,-70 L203,-90 L238,-76 L228,-500 L218,-900Z" fill="#c06a36" opacity=".55" transform="translate(4,2)"/>
  <path d="M-200,-900 L-230,-200 L-215,-84 L-120,-100 L-60,-76 L50,-98 L110,-72 L200,-92 L235,-78 L225,-500 L215,-900Z" fill="#0d0912"/>
</svg>`;

/* insert: the vision in the fire */
const VISION = `
<svg id="vision" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#4a0d10"/><polygon points="-520,-60 -380,-400 -60,-540 300,-470 520,-200 560,160 380,470 20,560 -330,480 -540,220" fill="#a3261a"/><polygon points="-380,-40 -280,-290 -30,-390 220,-340 380,-140 400,110 270,330 10,400 -240,340 -390,150" fill="#c8321e"/><polygon points="-240,-30 -170,-190 -20,-250 140,-210 240,-90 250,70 170,200 0,240 -150,200 -240,90" fill="#ef7a1a"/><polygon points="-110,-20 -80,-100 -10,-130 70,-110 110,-50 120,30 80,90 0,110 -70,90 -110,40" fill="#f8c04a"/>
  <polygon points="-340,110 -195,-95 -50,110" fill="#b5361f" opacity=".55"/>
  <polygon points="-170,110 -62,-34 46,110" fill="#9c2a18" opacity=".7"/>
  <g id="vFlames"></g>
  <rect x="-3000" y="110" width="6000" height="3000" fill="#3a0c10"/>
  <g fill="#24060a" stroke="#24060a" stroke-linecap="round">
    <g id="vBlock"><rect x="-196" y="58" width="58" height="46" stroke="none"/><circle cx="-184" cy="106" r="5" stroke="none"/><circle cx="-150" cy="106" r="5" stroke="none"/><path d="M-138,80 L-74,64 L-24,64 L26,64" stroke-width="2.2" fill="none"/></g>
    <g id="vHaul"></g>
    <g transform="translate(118,110)">
      <path d="M0,-28 L0,-64" stroke-width="14"/><path d="M0,-28 L-7,0 M0,-28 L8,0" stroke-width="7"/>
      <circle cx="-1" cy="-76" r="8" stroke="none"/><path d="M-7,-85 L9,-86 L15,-58 L5,-66Z" stroke="none"/>
      <g id="vWhip"><path d="M0,-60 L-10,-86" stroke-width="6"/><path d="M-10,-86 C-12,-126 -66,-124 -88,-74" stroke-width="2.4" fill="none"/></g>
    </g>
  </g>
</svg>`;

/* insert: the hand (flat polygons) */
const HAND = `
<svg id="hand" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#1a1220"/>
  <polygon points="120,-3000 3000,-3000 3000,3000 420,3000 300,300 380,-200" fill="#231626"/>
  <polygon id="hLight" points="520,-3000 3000,-3000 3000,3000 760,3000 640,200 700,-400" fill="#8a4a26"/>
  <g id="hArm">
    <polygon points="150,-62 900,-150 900,170 150,64" fill="#0d0912"/>
    <polygon points="150,-62 900,-150 900,-96 168,-34" fill="#5a3320"/>
    <polygon points="60,-28 170,-40 170,40 60,30" style="fill:var(--hb)"/>
    <polygon points="60,-28 170,-40 170,-14 60,-8" style="fill:var(--hl)"/>
    <g id="hPalm">
      <polygon points="60,-30 -10,-36 -30,-10 -28,22 0,34 60,30" style="fill:var(--hb)"/>
      <polygon points="60,-30 -10,-36 -16,-18 60,-8" style="fill:var(--hl)"/>
      <polygon points="60,30 0,34 -28,22 -20,14 60,16" style="fill:var(--hs)"/>
      <polygon points="26,-32 0,-66 -20,-60 -10,-36" style="fill:var(--hl)"/>
      <g id="hFing">
        <polygon points="-10,-36 -82,-36 -86,-23 -30,-18" style="fill:var(--hl)"/>
        <polygon points="-30,-18 -94,-17 -97,-3 -30,-2" style="fill:var(--hb)"/>
        <polygon points="-30,-2 -88,1 -90,14 -29,12" style="fill:var(--hb)"/>
        <polygon points="-29,12 -72,19 -72,31 -22,26" style="fill:var(--hs)"/>
      </g>
    </g>
  </g>
  <polygon points="-3000,-3000 70,-3000 10,-520 -20,-200 -64,0 -34,230 -70,560 -110,3000 -3000,3000" fill="#0d0912"/>
  <polygon points="70,-3000 10,-520 -20,-200 -64,0 -34,230 -70,560 -110,3000 -140,3000 -96,560 -62,230 -92,0 -50,-200 -22,-520 36,-3000" fill="#5a3320"/>
  <circle class="ring" id="hRing" cx="40" cy="20" r="80"/>
  <rect class="hit" id="hHit" x="-3000" y="-3000" width="6000" height="6000"/>
</svg>`;

/* insert: his face, eye widening */
const FACE = `
<svg id="face" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#0b1030"/>
  <polygon id="fcLight" points="260,-3000 3000,-3000 3000,3000 420,3000 330,300 400,-300" fill="#8a4a26"/>
  <polygon points="-3000,-3000 90,-3000 62,-300 40,-150 20,-150 10,-40 20,60 70,70 60,150 24,270 -40,460 -60,3000 -3000,3000" fill="#0d0912"/>
  <polygon points="20,-150 40,-150 70,-70 80,-50 120,0 86,14 92,34 80,50 70,70 20,60 10,-40" fill="#b8683a"/>
  <polygon points="30,-150 40,-150 70,-70 80,-50 120,0 100,-4 66,-48 52,-80" fill="#e8a25a"/>
  <polygon points="90,-3000 62,-300 40,-150 26,-150 46,-300 70,-3000" fill="#5a3320"/>
  <polygon points="70,70 78,74 68,152 60,150" fill="#5a3320"/>
  <g id="fcEye"><polygon points="30,-64 52,-70 64,-58 50,-50 32,-52" fill="#f3e6c8"/><polygon points="48,-66 58,-62 56,-53 46,-54" fill="#0d0912"/></g>
  <polygon points="24,-74 60,-84 70,-70 28,-66" fill="#0d0912"/>
</svg>`;

export const INSERTS = FEET + VISION + HAND + FACE;
