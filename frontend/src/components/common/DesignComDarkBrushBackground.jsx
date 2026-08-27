import React from 'react';

/**
 * DesignComDarkBrushBackground Component (Option 2 - Dark Canvas Mode).
 * Recreates the exact dark canvas aesthetic of design.com with glowing emerald/mint green brush artwork:
 * 1. Glowing Circular Swirl Brush Rings (Top-Left & Bottom-Right)
 * 2. Vertical Distressed Dripping Paint Lines & Streaks
 * 3. Dense Glowing Paint Splatters & Droplets
 * 4. Soft Smudged Charcoal/Forest Background Shading
 */
export function DesignComDarkBrushBackground() {
  return (
    <div
      className="designcom-dark-brush-bg-wrapper"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#0B1A10',
        transition: 'opacity 0.4s ease',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <defs>
          {/* Organic Rough Brush Edge Filter */}
          <filter id="darkBrushFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.14"
              numOctaves="3"
              seed="42"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="9"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Vertical Drip Filter */}
          <filter id="darkDripFilter" x="-20%" y="-10%" width="140%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.07 0.02"
              numOctaves="2"
              seed="88"
              result="dNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="dNoise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Glowing Green Brush Gradients */}
          <radialGradient id="darkSwirlGrad1" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0B1A10" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="darkSwirlGrad2" cx="70%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#10B981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0B1A10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── AMBIENT SMUDGED FOREST SHADING (BACKDROP BLOTCHES) ────────── */}
        <ellipse cx="250" cy="200" rx="450" ry="350" fill="url(#darkSwirlGrad1)" opacity="0.6" />
        <ellipse cx="1350" cy="800" rx="500" ry="380" fill="url(#darkSwirlGrad2)" opacity="0.55" />

        {/* ── 1. CIRCULAR SWIRL BRUSH STROKES (TOP-LEFT & BOTTOM-RIGHT) ──── */}
        <g filter="url(#darkBrushFilter)">
          {/* Top-Left Glowing Circular Swirl Brush Rings */}
          <path
            d="M -80 280 C -40 100, 100 -40, 280 -80 C 460 -120, 620 40, 580 220 C 540 400, 360 480, 180 440"
            fill="none"
            stroke="#10B981"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M -40 220 C 0 80, 120 -20, 260 -50 C 400 -80, 520 40, 480 180 C 440 320, 300 380, 160 340"
            fill="none"
            stroke="#34D399"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 10 160 C 40 60, 140 10, 240 -20 C 340 -50, 420 40, 380 140 C 340 240, 240 280, 140 240"
            fill="none"
            stroke="#059669"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Bottom-Right Glowing Circular Swirl Brush Rings */}
          <path
            d="M 1680 720 C 1640 900, 1500 1040, 1320 1080 C 1140 1120, 980 960, 1020 780 C 1060 600, 1240 520, 1420 560"
            fill="none"
            stroke="#10B981"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d="M 1640 780 C 1600 920, 1480 1020, 1340 1050 C 1200 1080, 1080 960, 1120 820 C 1160 680, 1300 620, 1440 660"
            fill="none"
            stroke="#34D399"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 1590 840 C 1560 940, 1460 990, 1360 1020 C 1260 1050, 1180 960, 1220 860 C 1260 760, 1360 720, 1460 760"
            fill="none"
            stroke="#059669"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>


        {/* ── 2. VERTICAL DISTRESSED PAINT DRIPS & STREAKS (GLOWING GREEN) ── */}
        <g filter="url(#darkDripFilter)">
          {/* Vertical Drip Line 1 (Left Margin) */}
          <line x1="90" y1="-20" x2="90" y2="780" stroke="#10B981" strokeWidth="4" strokeDasharray="180 25 320 40 120 15" opacity="0.6" />
          <line x1="105" y1="40" x2="105" y2="650" stroke="#34D399" strokeWidth="2.5" strokeDasharray="240 50 160 20" opacity="0.7" />

          {/* Vertical Drip Line 2 (Mid-Left) */}
          <line x1="280" y1="-20" x2="280" y2="920" stroke="#059669" strokeWidth="3.5" strokeDasharray="140 30 280 40 180 20" opacity="0.5" />
          <line x1="292" y1="120" x2="292" y2="820" stroke="#10B981" strokeWidth="2" strokeDasharray="200 40 150 25" opacity="0.6" />

          {/* Vertical Drip Line 3 (Center-Right) */}
          <line x1="1090" y1="80" x2="1090" y2="1020" stroke="#10B981" strokeWidth="4" strokeDasharray="210 40 180 30 250 45" opacity="0.6" />
          <line x1="1105" y1="180" x2="1105" y2="940" stroke="#34D399" strokeWidth="2.5" strokeDasharray="150 25 240 35" opacity="0.7" />

          {/* Vertical Drip Line 4 (Right Margin) */}
          <line x1="1350" y1="-20" x2="1350" y2="1020" stroke="#059669" strokeWidth="5" strokeDasharray="280 50 140 25 320 40" opacity="0.65" />
          <line x1="1368" y1="50" x2="1368" y2="880" stroke="#10B981" strokeWidth="3" strokeDasharray="170 30 210 35" opacity="0.7" />
          <line x1="1490" y1="-20" x2="1490" y2="800" stroke="#34D399" strokeWidth="4" strokeDasharray="190 35 260 40" opacity="0.6" />

          {/* Vertical Teardrop Dripping Droplets */}
          <path d="M 88,320 Q 94,330 89,338 Q 84,330 88,320 Z" fill="#10B981" opacity="0.75" />
          <path d="M 104,480 Q 110,490 105,498 Q 99,490 104,480 Z" fill="#34D399" opacity="0.8" />
          <path d="M 278,410 Q 284,420 279,428 Q 273,420 278,410 Z" fill="#059669" opacity="0.7" />
          <path d="M 1088,540 Q 1094,550 1089,558 Q 1083,550 1088,540 Z" fill="#10B981" opacity="0.75" />
          <path d="M 1348,620 Q 1354,630 1349,638 Q 1343,630 1348,620 Z" fill="#34D399" opacity="0.8" />
        </g>


        {/* ── 3. DENSE GLOWING PAINT SPLATTERS & DROPLETS ───────────────── */}
        <g filter="url(#darkBrushFilter)">
          {/* Top Left Splatters */}
          <circle cx="140" cy="180" r="4.5" fill="#10B981" opacity="0.7" />
          <circle cx="180" cy="240" r="3.0" fill="#34D399" opacity="0.8" />
          <circle cx="230" cy="120" r="5.0" fill="#059669" opacity="0.65" />
          <circle cx="290" cy="190" r="3.5" fill="#10B981" opacity="0.75" />
          <circle cx="340" cy="260" r="2.5" fill="#34D399" opacity="0.7" />

          {/* Bottom Right Splatters */}
          <circle cx="1180" cy="740" r="4.8" fill="#10B981" opacity="0.7" />
          <circle cx="1240" cy="820" r="3.2" fill="#34D399" opacity="0.8" />
          <circle cx="1290" cy="690" r="5.2" fill="#059669" opacity="0.65" />
          <circle cx="1350" cy="780" r="3.8" fill="#10B981" opacity="0.75" />
          <circle cx="1410" cy="860" r="2.6" fill="#34D399" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

export default DesignComDarkBrushBackground;
