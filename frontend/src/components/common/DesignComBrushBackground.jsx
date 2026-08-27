import React from 'react';

/**
 * DesignComBrushBackground Component.
 * Faithfully recreates the exact background elements from design.com:
 * 1. Circular Swirl Brush Strokes (Top-Left & Bottom-Right)
 * 2. Vertical Distressed Paint Drips & Streaks
 * 3. Dense Organic Paint Splatters & Droplets
 * 4. Smudged Acrylic Background Texture
 * Adapted using our website's premium green color system (#0B3C1B, #176B35, #2E9F45).
 */
export function DesignComBrushBackground() {
  return (
    <div
      className="designcom-brush-bg-wrapper"
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
        mixBlendMode: 'multiply',
        opacity: 0.88,
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
          <filter id="designComFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.15"
              numOctaves="3"
              seed="31"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Vertical Drip Roughness Filter */}
          <filter id="dripFilter" x="-20%" y="-10%" width="140%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08 0.02"
              numOctaves="2"
              seed="77"
              result="dNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="dNoise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Premium Green Color Gradients */}
          <radialGradient id="swirlGreenGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B3C1B" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#176B35" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2E9F45" stopOpacity="0.3" />
          </radialGradient>

          <linearGradient id="verticalDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#176B35" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#2E9F45" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0B3C1B" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ── 1. CIRCULAR SWIRL BRUSH STROKES (DESIGN.COM CORNER SWIRLS) ───── */}
        <g filter="url(#designComFilter)">
          {/* Top-Left Circular Swirl Brush Rings */}
          <path
            d="M -80 280 C -40 100, 100 -40, 280 -80 C 460 -120, 620 40, 580 220 C 540 400, 360 480, 180 440"
            fill="none"
            stroke="#176B35"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M -40 220 C 0 80, 120 -20, 260 -50 C 400 -80, 520 40, 480 180 C 440 320, 300 380, 160 340"
            fill="none"
            stroke="#0B3C1B"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 10 160 C 40 60, 140 10, 240 -20 C 340 -50, 420 40, 380 140 C 340 240, 240 280, 140 240"
            fill="none"
            stroke="#2E9F45"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Bottom-Right Circular Swirl Brush Rings */}
          <path
            d="M 1680 720 C 1640 900, 1500 1040, 1320 1080 C 1140 1120, 980 960, 1020 780 C 1060 600, 1240 520, 1420 560"
            fill="none"
            stroke="#176B35"
            strokeWidth="36"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 1640 780 C 1600 920, 1480 1020, 1340 1050 C 1200 1080, 1080 960, 1120 820 C 1160 680, 1300 620, 1440 660"
            fill="none"
            stroke="#0B3C1B"
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 1590 840 C 1560 940, 1460 990, 1360 1020 C 1260 1050, 1180 960, 1220 860 C 1260 760, 1360 720, 1460 760"
            fill="none"
            stroke="#2E9F45"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>


        {/* ── 2. VERTICAL DISTRESSED PAINT DRIPS & STREAKS (DESIGN.COM DRIPS) ─ */}
        <g filter="url(#dripFilter)">
          {/* Vertical Drip Line 1 (Left Margin) */}
          <line x1="90" y1="-20" x2="90" y2="750" stroke="#176B35" strokeWidth="5" strokeDasharray="180 25 320 40 120 15" opacity="0.85" />
          <line x1="105" y1="40" x2="105" y2="600" stroke="#0B3C1B" strokeWidth="3" strokeDasharray="240 50 160 20" opacity="0.9" />

          {/* Vertical Drip Line 2 (Mid-Left) */}
          <line x1="280" y1="-20" x2="280" y2="900" stroke="#2E9F45" strokeWidth="4" strokeDasharray="140 30 280 40 180 20" opacity="0.8" />
          <line x1="292" y1="120" x2="292" y2="800" stroke="#176B35" strokeWidth="2.5" strokeDasharray="200 40 150 25" opacity="0.85" />

          {/* Vertical Drip Line 3 (Center-Left) */}
          <line x1="510" y1="-20" x2="510" y2="650" stroke="#0B3C1B" strokeWidth="3.5" strokeDasharray="160 20 220 35" opacity="0.85" />

          {/* Vertical Drip Line 4 (Center-Right) */}
          <line x1="1090" y1="100" x2="1090" y2="1020" stroke="#176B35" strokeWidth="4.5" strokeDasharray="210 40 180 30 250 45" opacity="0.85" />
          <line x1="1105" y1="200" x2="1105" y2="920" stroke="#2E9F45" strokeWidth="3" strokeDasharray="150 25 240 35" opacity="0.8" />

          {/* Vertical Drip Line 5 (Right Margin) */}
          <line x1="1350" y1="-20" x2="1350" y2="1020" stroke="#0B3C1B" strokeWidth="6" strokeDasharray="280 50 140 25 320 40" opacity="0.9" />
          <line x1="1368" y1="60" x2="1368" y2="850" stroke="#176B35" strokeWidth="3.5" strokeDasharray="170 30 210 35" opacity="0.85" />
          <line x1="1490" y1="-20" x2="1490" y2="780" stroke="#2E9F45" strokeWidth="5" strokeDasharray="190 35 260 40" opacity="0.8" />

          {/* Vertical Teardrop Dripping Droplets */}
          <path d="M 88,320 Q 94,330 89,338 Q 84,330 88,320 Z" fill="#0B3C1B" opacity="0.9" />
          <path d="M 104,480 Q 110,490 105,498 Q 99,490 104,480 Z" fill="#176B35" opacity="0.85" />
          <path d="M 278,410 Q 284,420 279,428 Q 273,420 278,410 Z" fill="#2E9F45" opacity="0.85" />
          <path d="M 508,350 Q 514,360 509,368 Q 503,360 508,350 Z" fill="#0B3C1B" opacity="0.9" />
          <path d="M 1088,540 Q 1094,550 1089,558 Q 1083,550 1088,540 Z" fill="#176B35" opacity="0.85" />
          <path d="M 1348,620 Q 1354,630 1349,638 Q 1343,630 1348,620 Z" fill="#0B3C1B" opacity="0.9" />
          <path d="M 1488,430 Q 1494,440 1489,448 Q 1483,440 1488,430 Z" fill="#2E9F45" opacity="0.85" />
        </g>


        {/* ── 3. DENSE PAINT SPLATTERS & DROPLETS (DESIGN.COM SPLATTERS) ──── */}
        <g filter="url(#designComFilter)">
          {/* Top Left Splatter Cluster */}
          <circle cx="140" cy="180" r="5.5" fill="#0B3C1B" opacity="0.9" />
          <circle cx="180" cy="240" r="3.5" fill="#176B35" opacity="0.85" />
          <circle cx="230" cy="120" r="6.0" fill="#0B3C1B" opacity="0.92" />
          <circle cx="290" cy="190" r="4.0" fill="#2E9F45" opacity="0.85" />
          <circle cx="340" cy="260" r="2.8" fill="#176B35" opacity="0.8" />
          <circle cx="410" cy="140" r="5.0" fill="#0B3C1B" opacity="0.9" />
          <circle cx="460" cy="220" r="3.8" fill="#2E9F45" opacity="0.85" />

          {/* Bottom Right Splatter Cluster */}
          <circle cx="1180" cy="740" r="5.8" fill="#0B3C1B" opacity="0.9" />
          <circle cx="1240" cy="820" r="3.6" fill="#176B35" opacity="0.85" />
          <circle cx="1290" cy="690" r="6.2" fill="#0B3C1B" opacity="0.92" />
          <circle cx="1350" cy="780" r="4.2" fill="#2E9F45" opacity="0.85" />
          <circle cx="1410" cy="860" r="3.0" fill="#176B35" opacity="0.8" />
          <circle cx="1470" cy="720" r="5.2" fill="#0B3C1B" opacity="0.9" />
          <circle cx="1520" cy="810" r="4.0" fill="#2E9F45" opacity="0.85" />

          {/* Mid Canvas Ambient Splatters */}
          <circle cx="420" cy="680" r="4.2" fill="#176B35" opacity="0.8" />
          <circle cx="480" cy="760" r="3.0" fill="#0B3C1B" opacity="0.85" />
          <circle cx="1120" cy="280" r="4.5" fill="#2E9F45" opacity="0.8" />
          <circle cx="1180" cy="360" r="3.2" fill="#176B35" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

export default DesignComBrushBackground;
