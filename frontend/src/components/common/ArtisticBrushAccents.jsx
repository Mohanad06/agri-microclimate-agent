import React from 'react';

/**
 * Artistic Brush Accents Component.
 * Implements hand-painted premium dark-green acrylic brush dabs, organic paint splatters,
 * and dry-brush textures designed to feel comfortable, elegant, and artistic.
 */
export function ArtisticBrushAccents() {
  return (
    <div
      className="artistic-brush-layer"
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
        opacity: 0.85,
        transition: 'opacity 0.4s ease',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <defs>
          {/* Organic Hand-Painted Acrylic Rough Edge Filter */}
          <filter id="organicPaintEdge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.08"
              numOctaves="4"
              seed="27"
              result="pNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="pNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Finer Dry-Brush Edge Filter */}
          <filter id="dryBrushBristle" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.07 0.18"
              numOctaves="3"
              seed="54"
              result="bNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="bNoise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Premium Dark Green Acrylic Color Gradients */}
          <radialGradient id="paintDabGrad1" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0B3C1B" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#145E2D" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#1E7A39" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2E9F45" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="paintDabGrad2" cx="60%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#083015" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#115427" stopOpacity="0.88" />
            <stop offset="80%" stopColor="#1B6C33" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2E9F45" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="brushStrokeGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#0B3C1B" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#176B35" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#2E9F45" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ── TOP-RIGHT ARTISTIC HAND-PAINTED BRUSH DAB ─────────────────── */}
        <g filter="url(#organicPaintEdge)">
          {/* Main Hand-Painted Dab Silhouette */}
          <path
            d="M 1050 -80 
               C 1200 -50, 1420 -20, 1550 80 
               C 1650 160, 1680 320, 1620 450 
               C 1560 560, 1380 620, 1220 540 
               C 1120 490, 1080 380, 1140 280 
               C 1180 200, 1300 140, 1260 60 
               C 1230 0, 1100 -20, 1050 -80 Z"
            fill="url(#paintDabGrad1)"
          />

          {/* Overlapping Secondary Dry Brush Stroke */}
          <path
            d="M 1250 -60 
               Q 1450 120, 1580 340 
               T 1420 520 
               Q 1280 360, 1190 180 
               Z"
            fill="url(#brushStrokeGrad)"
            opacity="0.8"
          />

          {/* Broad Sweeping Hand-Painted Blotch */}
          <path
            d="M 1350 40 
               C 1500 100, 1650 250, 1610 400 
               C 1570 500, 1460 580, 1360 530 
               C 1290 490, 1310 390, 1390 320 
               C 1470 250, 1520 180, 1420 100 
               Z"
            fill="#093517"
            opacity="0.65"
          />
        </g>

        {/* Dry-Brush Bristle Streaks (Top Right) */}
        <g filter="url(#dryBrushBristle)" opacity="0.85">
          <path d="M 1120 -40 Q 1420 180, 1620 480" stroke="#0B3C1B" strokeWidth="12" strokeDasharray="180 30 240 40" fill="none" />
          <path d="M 1180 -40 Q 1460 160, 1630 420" stroke="#176B35" strokeWidth="8" strokeDasharray="220 50 160 30" fill="none" />
          <path d="M 1260 -40 Q 1500 140, 1640 360" stroke="#2E9F45" strokeWidth="6" strokeDasharray="140 20 280 60" fill="none" />
          <path d="M 1340 -40 Q 1540 120, 1650 300" stroke="#0B3C1B" strokeWidth="10" strokeDasharray="300 40 120 30" fill="none" />
        </g>


        {/* ── BOTTOM-LEFT ARTISTIC HAND-PAINTED BRUSH DAB ──────────────── */}
        <g filter="url(#organicPaintEdge)">
          {/* Main Hand-Painted Dab Silhouette */}
          <path
            d="M -100 500 
               C 50 420, 240 460, 380 580 
               C 520 700, 580 880, 480 1020 
               C 380 1140, 180 1120, 20 1010 
               C -100 920, -120 780, -60 670 
               C -20 590, 80 550, -100 500 Z"
            fill="url(#paintDabGrad2)"
          />

          {/* Overlapping Secondary Dry Brush Stroke */}
          <path
            d="M -60 580 
               Q 180 660, 420 890 
               T 280 1080 
               Q 60 880, -80 720 
               Z"
            fill="url(#brushStrokeGrad)"
            opacity="0.8"
          />

          {/* Broad Sweeping Hand-Painted Blotch */}
          <path
            d="M 40 620 
               C 180 700, 360 820, 320 960 
               C 280 1060, 140 1090, 40 1010 
               C -30 950, 10 850, 110 780 
               C 190 700, 180 650, 40 620 
               Z"
            fill="#093517"
            opacity="0.65"
          />
        </g>

        {/* Dry-Brush Bristle Streaks (Bottom Left) */}
        <g filter="url(#dryBrushBristle)" opacity="0.85">
          <path d="M -40 540 Q 240 720, 480 1040" stroke="#0B3C1B" strokeWidth="14" strokeDasharray="200 40 180 30" fill="none" />
          <path d="M -40 620 Q 220 780, 420 1040" stroke="#176B35" strokeWidth="9" strokeDasharray="160 30 240 40" fill="none" />
          <path d="M -40 700 Q 180 820, 350 1040" stroke="#2E9F45" strokeWidth="7" strokeDasharray="250 50 130 20" fill="none" />
        </g>


        {/* ── ORGANIC HAND-PAINTED SPLATTERS & DROPLETS ────────────────── */}
        <g filter="url(#dryBrushBristle)">
          {/* Top-Right Paint Drops */}
          <circle cx="1180" cy="180" r="5.5" fill="#0B3C1B" opacity="0.9" />
          <circle cx="1140" cy="240" r="3.8" fill="#176B35" opacity="0.85" />
          <circle cx="1210" cy="290" r="6.2" fill="#083015" opacity="0.92" />
          <circle cx="1270" cy="350" r="3.2" fill="#2E9F45" opacity="0.8" />
          <circle cx="1320" cy="410" r="5.0" fill="#0B3C1B" opacity="0.9" />
          <circle cx="1380" cy="470" r="4.0" fill="#176B35" opacity="0.85" />
          <circle cx="1440" cy="530" r="6.5" fill="#083015" opacity="0.88" />
          <circle cx="1500" cy="590" r="3.5" fill="#2E9F45" opacity="0.8" />

          {/* Organic Teardrop Paint Splatters (Top Right) */}
          <path d="M 1160,210 Q 1165,218 1159,225 Q 1153,218 1160,210 Z" fill="#0B3C1B" opacity="0.9" />
          <path d="M 1250,320 Q 1255,328 1249,335 Q 1243,328 1250,320 Z" fill="#176B35" opacity="0.85" />
          <path d="M 1350,440 Q 1356,448 1349,455 Q 1343,448 1350,440 Z" fill="#083015" opacity="0.92" />

          {/* Bottom-Left Paint Drops */}
          <circle cx="180" cy="560" r="5.0" fill="#0B3C1B" opacity="0.9" />
          <circle cx="240" cy="620" r="3.5" fill="#176B35" opacity="0.85" />
          <circle cx="300" cy="680" r="6.0" fill="#083015" opacity="0.92" />
          <circle cx="360" cy="750" r="4.2" fill="#2E9F45" opacity="0.8" />
          <circle cx="420" cy="820" r="5.8" fill="#0B3C1B" opacity="0.9" />
          <circle cx="470" cy="890" r="3.2" fill="#176B35" opacity="0.85" />

          {/* Organic Teardrop Paint Splatters (Bottom Left) */}
          <path d="M 210,590 Q 215,598 209,605 Q 203,598 210,590 Z" fill="#0B3C1B" opacity="0.9" />
          <path d="M 330,710 Q 335,718 329,725 Q 323,718 330,710 Z" fill="#176B35" opacity="0.88" />
          <path d="M 440,850 Q 446,858 439,865 Q 433,858 440,850 Z" fill="#083015" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export default ArtisticBrushAccents;
