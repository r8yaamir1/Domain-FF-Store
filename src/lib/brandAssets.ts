/**
 * High-Precision Vector Esport Mascot Emblem of DOMAIN FF STORE
 * Matches the user's reference image:
 * - Red and dark layered gaming shield crest
 * - Spiky anime warrior with glowing red eyes and battle suit
 * - Futuristic red energy aura & crimson metallic plate
 * - Distinct circular border badge with outer glowing ring
 */

const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="bgRadial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#14040a" />
      <stop offset="60%" stop-color="#0a0105" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Crimson Core Gradient -->
    <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3b53" />
      <stop offset="45%" stop-color="#ef4444" />
      <stop offset="85%" stop-color="#b91c1c" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>

    <!-- Red Energy Wave Gradient -->
    <radialGradient id="energyAura" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff1e38" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#dc2626" stop-opacity="0.5" />
      <stop offset="80%" stop-color="#991b1b" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Metallic Shield Steel -->
    <linearGradient id="metalPlate" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a2327" />
      <stop offset="50%" stop-color="#161214" />
      <stop offset="100%" stop-color="#0e0a0c" />
    </linearGradient>

    <!-- Red Edge Glow -->
    <filter id="esportGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="intenseGlow">
      <feGaussianBlur stdDeviation="8" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Circular Clip Mask Area -->
  <!-- Dark Obsidian Circular Base -->
  <circle cx="256" cy="256" r="248" fill="url(#bgRadial)" />

  <!-- Outer Ambient Fiery Energy Swirls -->
  <g opacity="0.85" filter="url(#intenseGlow)">
    <!-- Swirling Crimson Wings / Fire trails -->
    <path d="M120,240 Q100,140 180,90 Q220,70 210,120 Q170,140 150,190 Q130,230 120,240 Z" fill="url(#crimsonGrad)" opacity="0.6" />
    <path d="M140,280 Q90,200 130,130 Q170,80 230,70 Q190,110 170,170 Q150,220 140,280 Z" fill="#ef4444" opacity="0.4" />
    <path d="M370,130 Q410,210 380,300 Q360,240 330,190 Q350,140 370,130 Z" fill="#b91c1c" opacity="0.5" />
  </g>

  <!-- Red Esport Crest Outer Shield -->
  <path d="M256,40 L395,100 L415,280 L256,440 L97,280 L117,100 Z" 
        fill="#120409" 
        stroke="url(#crimsonGrad)" 
        stroke-width="12" 
        stroke-linejoin="round"
        filter="url(#esportGlow)" />

  <!-- Inner Red Shield Contour -->
  <path d="M256,65 L375,118 L390,265 L256,405 L122,265 L137,118 Z" 
        fill="#0a0206" 
        stroke="#ff2e4d" 
        stroke-width="5" 
        stroke-linejoin="round" />

  <!-- Dynamic Red Flame Ring on Left & Top -->
  <path d="M150,220 C130,150 180,95 240,90 C205,115 190,150 200,185 C190,170 170,180 160,205 Z" 
        fill="#ff1e38" />

  <!-- Character Mascot: Anime Warrior Profile -->
  <g id="animeWarrior">
    <!-- Battle Armor Shoulders & Chest -->
    <path d="M165,410 L195,300 L256,330 L315,300 L345,410 Z" fill="#14080f" />
    <path d="M185,340 L256,385 L325,340 L310,410 L200,410 Z" fill="#200a16" />
    
    <!-- Red Armor Plates & Cybernetics -->
    <path d="M220,335 L256,360 L290,335 L280,375 L256,390 L230,375 Z" fill="url(#crimsonGrad)" stroke="#ff4d68" stroke-width="2.5" />
    <circle cx="210" cy="320" r="6" fill="#ff1e38" filter="url(#esportGlow)" />
    
    <!-- Red High Collar Suit -->
    <path d="M205,250 L230,320 L280,320 L305,250 L280,265 L256,260 L230,265 Z" fill="#0f050b" stroke="#ff2a4b" stroke-width="4" />
    <path d="M238,270 L256,310 L274,270 Z" fill="#b91c1c" />

    <!-- Chiseled Neck & Shadow -->
    <path d="M232,220 L230,265 L280,265 L278,220 Z" fill="#2d1720" />
    <path d="M232,220 L248,265 L280,265 Z" fill="#15080e" />

    <!-- Warrior Jawline & Face (Anime 3/4 Side Profile Facing Right) -->
    <path d="M220,150 L235,235 L285,230 L320,185 L310,140 L260,130 Z" fill="#f0cdc2" />
    <!-- Face Shadowing -->
    <path d="M220,150 L235,235 L270,232 L260,170 L245,150 Z" fill="#b88072" />
    <path d="M260,170 L305,175 L285,230 L270,232 Z" fill="#d99b8d" opacity="0.6" />

    <!-- Glowing Red Warrior Eyes with Trail -->
    <!-- Right Eye (Visible 3/4) -->
    <polygon points="280,165 305,160 300,172 278,172" fill="#0d0408" />
    <polygon points="284,166 302,163 298,170 283,170" fill="#ff1133" filter="url(#intenseGlow)" />
    <circle cx="294" cy="166" r="3.5" fill="#ffffff" />
    <!-- Eye Scar / Red Mark -->
    <path d="M272,175 L288,195" stroke="#ff2a4b" stroke-width="3.5" stroke-linecap="round" />

    <!-- Sharp Anime Eyebrow -->
    <polygon points="274,158 312,152 308,157 276,162" fill="#0a0106" />

    <!-- Nose & Lips (Chiseled Manga Style) -->
    <path d="M312,168 L324,185 L310,190" fill="none" stroke="#8a5347" stroke-width="3" stroke-linejoin="round" />
    <path d="M298,208 L312,206" stroke="#66342c" stroke-width="2.5" stroke-linecap="round" />
    <path d="M302,216 L310,216" stroke="#994d3f" stroke-width="2" stroke-linecap="round" />

    <!-- Spiky Black Anime Hair with Red Energy Highlights -->
    <!-- Base Dark Hair Strands -->
    <path d="M195,165 L215,95 L260,70 L330,75 L360,120 L370,165 L335,160 L345,135 L310,125 L320,105 L265,100 L240,125 L235,150 L220,135 L200,165 Z" fill="#0d0408" />
    
    <!-- Sharp Spikes Shooting Backward & Upward -->
    <path d="M255,75 L285,35 L305,70 L345,45 L350,90 L385,80 L375,130 L405,120 L375,165 L350,150" fill="#14060e" />
    
    <!-- Vibrant Crimson Red Hair Highlights (Backlighting from Red Shield) -->
    <path d="M280,38 L300,70" stroke="#ff2e4d" stroke-width="6" stroke-linecap="round" filter="url(#esportGlow)" />
    <path d="M340,48 L348,88" stroke="#ff2e4d" stroke-width="7" stroke-linecap="round" filter="url(#esportGlow)" />
    <path d="M380,82 L372,128" stroke="#ff2e4d" stroke-width="6" stroke-linecap="round" filter="url(#esportGlow)" />
    <path d="M400,122 L372,162" stroke="#ff2e4d" stroke-width="6" stroke-linecap="round" filter="url(#esportGlow)" />
    
    <!-- Inner Hair Red Reflections -->
    <path d="M210,105 L245,125" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
    <path d="M260,102 L295,122" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" />
  </g>

  <!-- Lower Metal Nameplate Banner -->
  <g id="brandPlate" transform="translate(0, 20)">
    <!-- Base Plate -->
    <path d="M80,360 L432,360 L412,410 L100,410 Z" fill="url(#metalPlate)" stroke="#ff2e4d" stroke-width="3.5" />
    <!-- Rivets/Bolts -->
    <circle cx="95" cy="385" r="4.5" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5" />
    <circle cx="417" cy="385" r="4.5" fill="#4b5563" stroke="#9ca3af" stroke-width="1.5" />
    
    <!-- DOMAIN Text on Plate -->
    <text x="256" y="396" 
          font-family="'Rajdhani', 'Outfit', sans-serif" 
          font-size="34" 
          font-weight="900" 
          letter-spacing="5"
          fill="#ffffff" 
          text-anchor="middle"
          stroke="#ff1e38"
          stroke-width="1.2">
      DOMAIN
    </text>

    <!-- Subplate Banner: FF STORE -->
    <path d="M130,410 L382,410 L362,445 L150,445 Z" fill="#0d0206" stroke="#ef4444" stroke-width="2.5" />
    <text x="256" y="437" 
          font-family="'Rajdhani', 'Outfit', sans-serif" 
          font-size="22" 
          font-weight="900" 
          letter-spacing="4"
          fill="#ff2a4b" 
          text-anchor="middle">
      FF STORE
    </text>
  </g>

  <!-- Outer High-Contrast Circular Ring Frame -->
  <circle cx="256" cy="256" r="246" fill="none" stroke="#ff2e4d" stroke-width="4.5" filter="url(#esportGlow)" />
  <circle cx="256" cy="256" r="249" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.9" />
  <circle cx="256" cy="256" r="253" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.5" />
</svg>`;

export const DOMAIN_FF_BRAND_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(baseSvg)}`;

export const DOMAIN_FF_FAVICON = `data:image/svg+xml;utf8,${encodeURIComponent(baseSvg)}`;
