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
  <circle cx="92" cy="-12" r="30" fill="#9a5a36"/>
  <path d="M104,-40 C116,-34 122,-22 121,-12 C110,-26 98,-34 82,-36Z" fill="#b87048"/>
  <path d="M68,-30 C76,-46 100,-48 114,-36 C100,-38 84,-36 74,-24Z" fill="#1e120c"/>`;

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
      <g id="oFist"><circle r="11" fill="#9a5a36"/><path d="M-6,-6 q6,-4 12,0" stroke="#b87048" stroke-width="3" fill="none"/></g>
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
// her profile, facing right: forehead, brow, a long nose, full lips, chin, jaw
const PROFILE = 'C56,-206 72,-192 77,-170 C79,-158 81,-149 80.5,-142 C79.5,-135 75,-132 73,-127 C72.2,-117 81.2,-105 88.4,-95 C92.9,-90 97.2,-87 96.8,-82 C96.4,-77 92.5,-75.5 89,-75.5 C87,-75.5 84,-73 82.8,-70 C85.7,-68 86.7,-64 83.6,-60 C81.1,-58 80,-57.5 80,-56 C81.7,-53 79.1,-47 74.5,-45 C72,-43 70.8,-40 70.4,-37 C70.5,-31 66.6,-25.5 58.5,-23.5';
const FACE_D = `M30,-206 ${PROFILE} C40,-18 10,-26 -0.5,-46 C0,-58 -4,-74 -4,-90 C-5,-112 -6,-132 -4,-150 C-2,-180 10,-200 30,-206Z`;
const LIT_D = `M30,-206 ${PROFILE} C52.2,-32 49.5,-48 56.7,-64 C66.1,-80 59.4,-96 61.8,-112 C60,-140 60,-176 30,-206Z`;
const LID_D = 'M54,-136 C64,-141 77,-138 83,-127 L81,-121 C74,-116 64,-114 57,-119Z';
const LIPS_D = 'M83.3,-70 C85.7,-68 86.7,-64 83.6,-60 C81.2,-58.5 79.2,-58.5 77.8,-59Z M80,-56 C81.7,-53 79.1,-47 74.5,-45 C74.2,-49 76.3,-53.5 80,-56Z';
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
    <!-- the veil hanging behind, and her robe -->
    <path d="M-20,-250 C-90,-246 -132,-196 -140,-130 C-150,-40 -170,80 -210,200 L-280,420 L-30,420 L-10,40 C-20,-60 -10,-180 -20,-250Z" fill="#211d2c"/>
    <path d="M-40,62 C10,30 72,24 104,40 C164,72 214,172 240,420 L-90,420Z" fill="#141220"/>
    <path d="M-40,62 C10,34 60,30 90,36 C60,44 20,52 -20,74Z" fill="#2a2536"/>
    <g id="hHead">
      <path d="M-24,-50 C-4,-36 14,-30 27,-30 C27,0 29,30 33,56 L-21,70 C-17,30 -21,-10 -24,-50Z" fill="#33231d"/>
      <path d="M27,-30 C27,0 29,30 33,56 L21,58 C17,32 15,4 15,-28Z" class="hw" fill="#7a4626" opacity="0"/>
      <path d="${FACE_D}" fill="#4c362e"/>
      <path d="${LIT_D}" fill="#5e4438"/>
      <path d="${FACE_D}" class="hw" fill="#7c4a2c" opacity="0"/>
      <path d="${LIT_D}" class="hw" fill="#b06e3e" opacity="0"/>
      <!-- the cheekbone catching the light -->
      <path d="M60,-106 C68,-104 76,-100 78,-92 C70,-92 62,-96 60,-106Z" class="hw" fill="#d08a52" opacity="0"/>
      <!-- the eye sits back in its socket, behind the bridge of the nose -->
      <path d="M60,-136 C66,-128 70,-120 68,-108 C62,-112 58,-120 56,-130Z" fill="#2e1f19" opacity=".55"/>
      <g transform="translate(-14,1)">
      <!-- tired: the shadow beneath the eye -->
      <path d="M57,-114 C64,-108 72,-108 80,-116 C75,-106 64,-104 55,-110Z" fill="#20140f" opacity=".75"/>
      <!-- the eye: dark iris, lined with kohl -->
      <path d="M57,-120 C63,-128 74,-128 80,-122 C74,-117 64,-115 57,-120Z" fill="#cdbba4"/>
      <g id="hIris"><circle cx="70" cy="-122" r="4.8" fill="#140a06"/><circle cx="71.6" cy="-123.6" r="1.1" fill="#e8d6bc"/></g>
      <path d="M57,-120 C64,-115 74,-116 80,-122" stroke="#140a06" stroke-width="1.2" fill="none"/>
      <g id="hLid">
        <path d="${LID_D}" fill="#4c362e"/>
        <path d="${LID_D}" class="hw" fill="#8e5532" opacity="0"/>
        <path d="M55,-119 C64,-114 74,-116 81,-121 L86,-124" stroke="#0e0705" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      </g>
      <path d="M56,-131 C64,-137 76,-136 82,-128" stroke="#24150f" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M48,-141 C58,-151 74,-152 86,-141 C76,-146 62,-146 50,-138Z" fill="#0f0806"/>
      </g>
      <path d="M85.1,-79.5 C87.4,-77 89.4,-77 91,-78.5" stroke="#1e110c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <g id="hLips">
        <path d="${LIPS_D}" fill="#5a3029"/>
        <path d="${LIPS_D}" class="hw" fill="#94493a" opacity="0"/>
        <path d="M77.1,-58 C78.8,-57 79.8,-57 81,-57.5" stroke="#1a0c0a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      </g>
      <!-- the veil over her head, framing the face -->
      <path d="M46,-206 C26,-198 10,-178 4,-150 C-4,-120 -8,-80 2,-40 C8,-8 2,30 -12,72 L-70,72 C-62,0 -52,-120 -30,-204Z" fill="#211d2c"/>
      <path d="M86,-198 C80,-236 32,-256 -20,-252 C-62,-250 -94,-230 -110,-202 C-62,-218 0,-213 44,-207 C62,-205 76,-201 86,-198Z" fill="#2b2638"/>
      <path d="M86,-198 C80,-236 32,-256 -20,-252 L-18,-244 C26,-246 70,-230 78,-200Z" class="hw" fill="#8a5232" opacity="0"/>
      <path d="M-50,-226 C-92,-200 -110,-150 -116,-80 M-14,-214 C-46,-190 -60,-140 -62,-70" stroke="#2e2a3e" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <!-- the neckline of her robe, over the base of the neck -->
    <path d="M-16,76 C12,44 40,34 66,32 C88,31 104,38 114,48 L114,140 L-16,140Z" fill="#141220"/>
    <path d="M-16,76 C12,44 40,34 66,32 C88,31 104,38 114,48" stroke="#2a2536" stroke-width="5" fill="none"/>
    <g transform="translate(-10,-40)">
    <g id="hBaby">
      <path d="${SWADDLE_D}" fill="#3e3b4c"/>
      <path d="${SWADDLE_D}" class="hw" fill="#a8916e" opacity="0"/>
      <path d="M100,96 C70,120 30,140 -20,150 M120,120 C90,150 50,170 0,182" stroke="#2c2a38" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="128" cy="62" r="29" fill="#4a3329"/>
      <circle cx="128" cy="62" r="29" class="hw" fill="#93583a" opacity="0"/>
      <g transform="rotate(55 128 62)">
      <path d="M104,46 C112,30 134,28 148,38 C134,36 120,42 112,56Z" fill="#140c08"/>
      <path d="M104,44 C110,26 136,22 152,34 C134,28 116,30 106,52Z" fill="#3e3b4c"/>
      <path id="hBabyEyes" d="M115,60 q5,4 10,0 M133,56 q4,3 8,0" stroke="#140a06" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path id="hBabyBrow" d="M115,52 L124,50 M133,48 L141,47" stroke="#140a06" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0"/>
      <ellipse id="hBabyMouth" cx="132" cy="75" rx="3.5" ry="1.2" fill="#24100c"/>
      </g>
    </g>
    <g id="hHand">
      <path d="M-220,420 L-40,190 L20,112 L46,134 L-20,232 L-80,420Z" fill="#141220"/>
      <path d="M18,110 C34,100 54,94 70,96 C80,98 84,106 80,114 C76,124 54,132 30,134Z" fill="#4c362e"/>
      <path d="M56,95 C70,94 82,100 80,114 C74,110 66,104 56,95Z" class="hw" fill="#b06e3e" opacity="0"/>
      <path d="M48,101 C58,96 68,94 76,96 M52,109 C62,104 72,102 80,104 M54,117 C64,113 72,112 79,113" stroke="#2e1f19" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    </g>
  </g>
</svg>`;

export const INSERTS = WEAVE + OPEN + HUSH;
