import { FLAME_D } from '../../art/shapes';

/**
 * Static vector art for "The Basket". World sets (A: the house in Goshen,
 * B: the Nile) are generated in world.ts; the close-ups are hand-authored
 * flat polygons below.
 */

export const SKY = `
  <div class="sky lamp full"></div>
  <div class="sky dark full"></div>
  <div class="sky rdawn full"></div>
  <div class="sky rday full"></div>`;

export const WORLD = `
<svg id="world" class="full" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <radialGradient id="gLamp"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".85"/><stop offset=".2" stop-color="#f8a84a" stop-opacity=".38"/><stop offset=".6" stop-color="#e07a2a" stop-opacity=".1"/><stop offset="1" stop-color="#e07a2a" stop-opacity="0"/></radialGradient>
    <radialGradient id="gTorch"><stop offset="0" stop-color="#fff0c0" stop-opacity=".95"/><stop offset=".3" stop-color="#f6a040" stop-opacity=".55"/><stop offset="1" stop-color="#e0601a" stop-opacity="0"/></radialGradient>
    <radialGradient id="gSun"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".25" stop-color="#fbe3a8" stop-opacity=".45"/><stop offset="1" stop-color="#f6d08a" stop-opacity="0"/></radialGradient>
    <clipPath id="clWin"><rect x="150" y="380" width="140" height="90"/></clipPath>
    <path id="flame" d="${FLAME_D}"/>
  </defs>
  <g id="setA"></g>
  <g id="setB" display="none"></g>
</svg>`;

/* A Another-World hand: sleeve to +x, fingers to -x. Fills via CSS vars so skin can change. */
const HAND = `
  <polygon points="150,-62 900,-150 900,170 150,64" style="fill:var(--sl)"/>
  <polygon points="150,-62 900,-150 900,-96 168,-34" style="fill:var(--sll)"/>
  <polygon points="60,-28 170,-40 170,40 60,30" style="fill:var(--hb)"/>
  <polygon points="60,-28 170,-40 170,-14 60,-8" style="fill:var(--hl)"/>
  <polygon points="60,-30 -10,-36 -30,-10 -28,22 0,34 60,30" style="fill:var(--hb)"/>
  <polygon points="60,-30 -10,-36 -16,-18 60,-8" style="fill:var(--hl)"/>
  <polygon points="60,30 0,34 -28,22 -20,14 60,16" style="fill:var(--hs)"/>
  <polygon points="26,-32 0,-66 -20,-60 -10,-36" style="fill:var(--hl)"/>
  <polygon points="-10,-36 -82,-36 -86,-23 -30,-18" style="fill:var(--hl)"/>
  <polygon points="-30,-18 -94,-17 -97,-3 -30,-2" style="fill:var(--hb)"/>
  <polygon points="-30,-2 -88,1 -90,14 -29,12" style="fill:var(--hb)"/>
  <polygon points="-29,12 -72,19 -72,31 -22,26" style="fill:var(--hs)"/>`;

const BOWL = 'M-200,-20 C-196,70 -120,128 0,128 C120,128 196,70 200,-20 Z';

/** The swaddled baby, lying with his head to the right. */
const BABY = `
  <ellipse cx="-20" cy="0" rx="128" ry="34" fill="#e8dcc0"/>
  <path d="M-130,4 C-80,20 0,24 60,10 L60,30 C0,40 -90,34 -130,4Z" fill="#c9bb9c"/>
  <path d="M-90,-22 L-60,20 M-40,-28 L-14,24 M10,-30 L30,22" stroke="#cfc2a4" stroke-width="5" fill="none"/>
  <path d="M42,-40 C70,-62 132,-50 136,-6 C132,26 76,34 48,18Z" fill="#e8dcc0"/>
  <circle cx="92" cy="-12" r="30" fill="#b8683a"/>
  <path d="M74,-36 C88,-46 112,-42 120,-26 C104,-34 88,-34 74,-36Z" fill="#e8a25a"/>`;

/* insert: the basket is woven, pitched, and he is laid in it (Exodus 2:3) */
const WEAVE = `
<svg id="weave" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <defs>
    <radialGradient id="gWarm"><stop offset="0" stop-color="#f8b060" stop-opacity=".55"/><stop offset="1" stop-color="#f8b060" stop-opacity="0"/></radialGradient>
    <clipPath id="clBowl"><path d="${BOWL}"/></clipPath>
    <clipPath id="clPitch"><rect id="wPitchR" x="-215" y="-80" width="0" height="230"/></clipPath>
  </defs>
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#1d120e"/>
  <polygon points="-3000,-3000 -200,-3000 120,3000 -3000,3000" fill="#2a1913"/>
  <ellipse id="wGlow" cx="-380" cy="-240" rx="620" ry="520" fill="url(#gWarm)"/>
  <rect x="-3000" y="150" width="6000" height="3000" fill="#160d0a"/>
  <ellipse cx="0" cy="146" rx="250" ry="16" fill="#0d0705"/>
  <g id="wBasket">
    <ellipse cx="0" cy="-20" rx="200" ry="38" fill="#24160d"/>
    <g id="wBaby" transform="translate(0,-420)">${BABY}<path d="M78,-12 q8,6 16,0 M100,-14 q6,5 12,0" stroke="#5a2e1a" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <g clip-path="url(#clBowl)">
      <path d="${BOWL}" fill="#3b2614"/>
      <g id="wRibs" stroke="#6b4a26" stroke-width="7" fill="none"></g>
      <g id="wRows"></g>
      <g clip-path="url(#clPitch)">
        <path d="${BOWL}" fill="#1c110a"/>
        <path d="M-170,10 C-120,70 -40,96 40,98 M-120,-4 C-60,40 20,58 120,40" stroke="#5c3d26" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/>
      </g>
    </g>
    <path id="wRimW" d="M-200,-20 A200,38 0 0 0 200,-20" stroke="#9b7240" stroke-width="13" fill="none" opacity="0"/>
    <path id="wRimP" d="M-200,-20 A200,38 0 0 0 200,-20" stroke="#24160d" stroke-width="13" fill="none" opacity="0"/>
    <g id="wLid" transform="translate(0,-600)">
      <path d="M-208,-20 C-200,-96 200,-96 208,-20 C120,-6 -120,-6 -208,-20Z" fill="#1c110a"/>
      <path d="M-140,-52 C-70,-80 70,-80 140,-54" stroke="#5c3d26" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
    </g>
  </g>
  <path id="wStrand" stroke="#c9a060" stroke-width="5" stroke-linecap="round" fill="none"/>
  <g id="wHandL" style="--sl:#0d0912;--sll:#5a3320;--hb:#8e5a3a;--hl:#c98a55;--hs:#5e3a28"><g transform="translate(-250,60) scale(-.62,.62) rotate(-30)">${HAND}</g></g>
  <g id="wHandR" style="--sl:#0d0912;--sll:#5a3320;--hb:#8e5a3a;--hl:#c98a55;--hs:#5e3a28"><g transform="scale(.62) rotate(-20)">${HAND}</g></g>
  <circle class="ring" id="wRing" cx="0" cy="50" r="120"/>
  <rect class="hit" id="wHit" x="-3000" y="-3000" width="6000" height="6000"/>
</svg>`;

/* insert: Pharaoh's daughter opens the basket; the child weeps (Exodus 2:6) */
const OPEN = `
<svg id="open" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#c9b38a"/>
  <polygon points="-3000,-3000 3000,-3000 3000,-190 -3000,-150" fill="#2e6c72"/>
  <polygon points="-3000,-150 3000,-190 3000,-170 -3000,-128" fill="#7fa7a0" opacity=".6"/>
  <g stroke="#f6efcf" stroke-width="4" stroke-linecap="round" opacity=".7"><path d="M-300,-240 h50 M-120,-300 h80 M120,-230 h40 M260,-280 h70 M-420,-200 h30"/></g>
  <polygon points="-3000,200 3000,170 3000,3000 -3000,3000" fill="#b39c74"/>
  <ellipse cx="20" cy="140" rx="250" ry="34" fill="#8a7556"/>
  <g id="oBasket">
    <ellipse cx="0" cy="-20" rx="200" ry="38" fill="#120a06"/>
    <g id="oBaby" transform="translate(0,-28)">
      ${BABY}
      <path id="oEyes" d="M78,-12 q8,6 16,0 M100,-14 q6,5 12,0" stroke="#5a2e1a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse id="oMouth" cx="106" cy="4" rx="7" ry="8" fill="#4a1810"/>
      <g id="oTears" fill="#f6efcf"><path d="M70,-4 q-4,8 0,12 q4,-4 0,-12Z"/><path d="M118,-6 q-4,8 0,12 q4,-4 0,-12Z"/></g>
      <g id="oFist"><circle r="11" fill="#b8683a"/><path d="M-6,-6 q6,-4 12,0" stroke="#e8a25a" stroke-width="3" fill="none"/></g>
    </g>
    <path d="${BOWL}" fill="#20140c"/>
    <path d="M-170,10 C-120,70 -40,96 40,98 M-120,-4 C-60,40 20,58 120,40" stroke="#6e4c30" stroke-width="7" stroke-linecap="round" fill="none" opacity=".75"/>
    <path d="M-200,-20 A200,38 0 0 0 200,-20" stroke="#2c1c10" stroke-width="13" fill="none"/>
    <path d="M-200,-20 A200,38 0 0 0 200,-20" stroke="#7a5638" stroke-width="3" fill="none" transform="translate(0,-4)" opacity=".7"/>
    <g id="oLid">
      <path d="M-208,-20 C-200,-96 200,-96 208,-20 C120,-6 -120,-6 -208,-20Z" fill="#1c110a"/>
      <path d="M-140,-52 C-70,-80 70,-80 140,-54" stroke="#6e4c30" stroke-width="6" stroke-linecap="round" fill="none" opacity=".75"/>
    </g>
    <circle class="ring" id="oLidRing" cx="0" cy="-50" r="150"/>
    <circle class="ring" id="oBabyRing" cx="90" cy="-14" r="70"/>
    <rect class="hit" id="oLidHit" x="-240" y="-140" width="480" height="270"/>
    <rect class="hit" id="oBabyHit" x="-240" y="-140" width="480" height="270"/>
  </g>
  <g id="oHand" style="--sl:#efe6cf;--sll:#fffaea;--hb:#a8653a;--hl:#d8955c;--hs:#7a4528">
    <g transform="rotate(-38) scale(.7)">${HAND}<rect x="150" y="-60" width="30" height="128" fill="#e0b040" transform="skewY(-7)"/><rect x="154" y="-58" width="8" height="122" fill="#fff0a8" transform="skewY(-7)"/></g>
  </g>
</svg>`;


/* insert: the mother's face as the soldiers stop at the window (Exodus 2:2).
   Cool night tones; the warm copies (class hw) fade in with the torchlight from the right. */
const FACE_D = 'M16,-200 L48,-204 L68,-190 L78,-162 L82,-142 L80,-132 L86,-118 L98,-100 L110,-86 L106,-80 L96,-78 L98,-70 L102,-64 L96,-60 L100,-54 L96,-46 L90,-40 L94,-28 L88,-16 L70,-8 L40,-14 L14,-34 L-6,-70 L-14,-120 L-8,-170Z';
const LIT_D = 'M48,-204 L68,-190 L78,-162 L82,-142 L80,-132 L86,-118 L98,-100 L110,-86 L106,-80 L96,-78 L98,-70 L102,-64 L96,-60 L100,-54 L96,-46 L90,-40 L94,-28 L88,-16 L70,-8 L66,-30 L58,-60 L60,-96 L54,-136 L44,-180Z';
const SWADDLE_D = 'M152,52 C176,86 156,130 104,160 C42,196 -40,212 -82,190 C-104,160 -62,118 0,100 C52,84 104,52 152,52Z';
const HUSH = `
<svg id="hush" class="full" preserveAspectRatio="none" style="display:none" aria-hidden="true">
  <rect x="-3000" y="-3000" width="6000" height="6000" fill="#0a0c18"/>
  <g id="hPatch" opacity="0">
    <polygon points="96,-360 400,-326 446,80 128,48" fill="#2a1712"/>
    <polygon points="122,-332 372,-304 412,50 150,22" fill="#40221a"/>
    <polygon points="150,-300 342,-280 376,16 174,-4" fill="#5a301e"/>
  </g>
  <g id="hMa">
    <path d="M-110,-150 C-140,-40 -170,80 -210,200 L-280,420 L-40,420 L-20,40Z" fill="#17162a"/>
    <path d="M-40,62 C10,30 72,24 104,40 C164,72 214,172 240,420 L-90,420Z" fill="#131220"/>
    <g id="hHead">
      <polygon points="14,-34 70,-10 82,40 -2,66 -12,0" fill="#2e232c"/>
      <polygon points="70,-10 82,40 60,46 54,-6" class="hw" fill="#7a4428" opacity="0"/>
      <path d="${FACE_D}" fill="#4a3a44"/>
      <path d="M40,-14 L14,-34 L-6,-70 L-14,-120 L10,-112 L26,-62 L50,-34Z" fill="#33272f"/>
      <path d="${LIT_D}" fill="#5a4652"/>
      <path d="${FACE_D}" class="hw" fill="#9a5c38" opacity="0"/>
      <path d="${LIT_D}" class="hw" fill="#d2925c" opacity="0"/>
      <polygon points="58,-104 76,-100 72,-86 56,-90" fill="#6a5662"/>
      <polygon points="58,-104 76,-100 72,-86 56,-90" class="hw" fill="#eaaa70" opacity="0"/>
      <!-- tired: shadows beneath the eye -->
      <path d="M52,-114 C60,-106 70,-106 80,-113 C72,-102 60,-100 50,-108Z" fill="#241a22" opacity=".85"/>
      <polygon points="54,-122 64,-128 76,-125 79,-118 66,-115" fill="#bfb2a6"/>
      <circle id="hIris" cx="70" cy="-121" r="4.4" fill="#120c10"/>
      <g id="hLid">
        <polygon points="50,-137 64,-141 81,-133 80,-117 66,-114 52,-118" fill="#4a3a44"/>
        <polygon points="50,-137 64,-141 81,-133 80,-117 66,-114 52,-118" class="hw" fill="#b8764a" opacity="0"/>
        <path d="M52,-118 L66,-114 L80,-117" stroke="#120c10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <polygon points="48,-141 66,-149 82,-142 66,-145" fill="#140e12"/>
      <g id="hLips"><path d="M95,-70 L101,-65 L97,-61 L101,-55 L95,-51 L92,-60Z" fill="#5a3438"/>
        <path d="M95,-70 L101,-65 L97,-61 L101,-55 L95,-51 L92,-60Z" class="hw" fill="#a84c3c" opacity="0"/>
        <path d="M93,-61 L98,-61" stroke="#140e12" stroke-width="1.6"/></g>
      <!-- loose strands escaping the veil -->
      <path d="M34,-201 C44,-186 36,-170 47,-152 M22,-199 C16,-182 24,-166 19,-148" stroke="#100b10" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M70,-198 C60,-226 20,-246 -30,-242 C-90,-236 -126,-190 -132,-130 C-138,-60 -146,10 -160,60 L-6,60 C-14,20 -18,-30 -16,-90 C-16,-140 -2,-180 30,-198 C44,-202 58,-202 70,-198Z" fill="#1c1b2e"/>
      <path d="M-40,-224 C-84,-200 -104,-150 -110,-80 M-6,-210 C-40,-190 -58,-140 -62,-60" stroke="#262540" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M70,-198 C60,-226 20,-246 -30,-242 L-26,-232 C14,-236 50,-222 62,-196Z" class="hw" fill="#8a4a2a" opacity="0"/>
    </g>
    <g id="hBaby">
      <path d="${SWADDLE_D}" fill="#3e3b4c"/>
      <path d="${SWADDLE_D}" class="hw" fill="#b09a78" opacity="0"/>
      <path d="M100,96 C70,120 30,140 -20,150 M120,120 C90,150 50,170 0,182" stroke="#2c2a38" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="128" cy="62" r="29" fill="#4a3a44"/>
      <circle cx="128" cy="62" r="29" class="hw" fill="#b06a40" opacity="0"/>
      <path d="M104,44 C110,26 136,22 152,34 C132,34 116,46 112,70Z" fill="#3e3b4c"/>
      <path id="hBabyEyes" d="M120,58 q5,4 10,0 M138,54 q4,3 8,0" stroke="#160e12" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path id="hBabyBrow" d="M120,50 L129,48 M138,46 L146,45" stroke="#160e12" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0"/>
      <ellipse id="hBabyMouth" cx="140" cy="72" rx="3.5" ry="1.2" fill="#2a1418"/>
    </g>
    <g id="hHand">
      <path d="M-220,420 L-40,190 L20,112 L46,134 L-20,232 L-80,420Z" fill="#131220"/>
      <polygon points="18,108 58,96 82,106 76,124 30,134" fill="#4a3a44"/>
      <polygon points="58,96 82,106 76,124 62,114" class="hw" fill="#c98a55" opacity="0"/>
      <path d="M50,100 L74,92 M54,108 L80,100 M56,116 L80,112" stroke="#33272f" stroke-width="2.4" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

export const INSERTS = WEAVE + OPEN + HUSH;
