import React from 'react';

/**
 * AgroLeafBackground Component
 * Background inspired by AgroVale graphic aesthetic:
 * - Rich deep emerald/teal agricultural gradient canvas
 * - Large organic overlapping leaf shapes & curves
 * - Concentric bio-geometric contour lines & glowing leaf accents
 * - Fully responsive, fixed background layer behind the app
 */
export function AgroLeafBackground() {
  return (
    <div
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
        background: 'linear-gradient(145deg, #022C22 0%, #004D3D 45%, #02362B 85%, #011E17 100%)',
      }}
    >
      {/* Ambient Radial Glow Spots */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '60vw',
          height: '60vw',
          maxHeight: '600px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0, 137, 123, 0.08) 55%, transparent 70%)',
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '50vw',
          height: '50vw',
          maxHeight: '550px',
          background: 'radial-gradient(circle, rgba(0, 230, 118, 0.18) 0%, rgba(4, 120, 87, 0.06) 60%, transparent 75%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />

      {/* SVG Organic Leaf Graphic Motifs */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Leaf Gradients inspired by the reference image */}
          <linearGradient id="leafGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#00897B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#004D40" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#047857" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="leafGradBottomRight" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.38" />
            <stop offset="70%" stopColor="#00695C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#011E17" stopOpacity="0" />
          </linearGradient>

          {/* Soft Drop Shadow for Leaf Layers */}
          <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* ── TOP CENTER / RIGHT OVERLAPPING LEAF CROWN ─────────────────── */}
        {/* Main Large Leaf 1 (Top Center) */}
        <path
          d="M720,-40 C860,60 980,180 940,320 C880,440 700,430 580,310 C480,210 540,50 720,-40 Z"
          fill="url(#leafGradTop)"
          filter="url(#leafShadow)"
        />
        {/* Leaf 1 Outline Contour */}
        <path
          d="M720,-40 C860,60 980,180 940,320 C880,440 700,430 580,310 C480,210 540,50 720,-40 Z"
          fill="none"
          stroke="#00E676"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />
        {/* Leaf Center Vein Line */}
        <path
          d="M720,-40 Q760,180 760,370"
          fill="none"
          stroke="#34D399"
          strokeWidth="2"
          strokeOpacity="0.4"
          strokeDasharray="6 6"
        />

        {/* Overlapping Leaf 2 (Top Right) */}
        <path
          d="M1020,-80 C1180,20 1280,160 1220,300 C1140,420 960,380 860,260 C780,160 840,0 1020,-80 Z"
          fill="url(#leafGradTop)"
          opacity="0.8"
        />
        <path
          d="M1020,-80 C1180,20 1280,160 1220,300 C1140,420 960,380 860,260 C780,160 840,0 1020,-80 Z"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* ── LEFT SIDE ORGANIC LEAF CURVES ───────────────────────────── */}
        {/* Big Leaf Curve (Left Edge) */}
        <path
          d="M-100,180 C120,240 260,420 200,620 C140,780 -60,820 -200,720 C-300,640 -260,420 -100,180 Z"
          fill="url(#leafGradLeft)"
          filter="url(#leafShadow)"
        />
        <path
          d="M-100,180 C120,240 260,420 200,620 C140,780 -60,820 -200,720 Z"
          fill="none"
          stroke="#00E676"
          strokeWidth="2"
          strokeOpacity="0.28"
        />

        {/* Outer Circular Leaf Contour Ring (Bottom Left) */}
        <circle
          cx="-50"
          cy="680"
          r="480"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeOpacity="0.22"
        />
        <circle
          cx="-50"
          cy="680"
          r="360"
          fill="none"
          stroke="#34D399"
          strokeWidth="1"
          strokeOpacity="0.18"
          strokeDasharray="8 8"
        />

        {/* ── BOTTOM RIGHT ORGANIC LEAF & RINGS ────────────────────────── */}
        {/* Large Leaf (Bottom Right) */}
        <path
          d="M1540,520 C1380,620 1260,780 1340,940 C1420,1080 1620,1060 1720,920 C1800,800 1720,620 1540,520 Z"
          fill="url(#leafGradBottomRight)"
          filter="url(#leafShadow)"
        />
        <path
          d="M1540,520 C1380,620 1260,780 1340,940 C1420,1080 1620,1060 1720,920 Z"
          fill="none"
          stroke="#00E676"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />

        {/* Bio-Geometric Concentric Rings (Bottom Right) */}
        <circle
          cx="1440"
          cy="850"
          r="520"
          fill="none"
          stroke="#00E676"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <circle
          cx="1440"
          cy="850"
          r="400"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <circle
          cx="1440"
          cy="850"
          r="280"
          fill="none"
          stroke="#34D399"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="12 6"
        />

        {/* Subtle Floating Bio Leaf Particles / Accents */}
        <g opacity="0.35">
          {/* Small Leaf 1 */}
          <path
            d="M320,160 Q350,130 380,160 Q350,190 320,160 Z"
            fill="#00E676"
          />
          {/* Small Leaf 2 */}
          <path
            d="M1120,540 Q1150,510 1180,540 Q1150,570 1120,540 Z"
            fill="#34D399"
            transform="rotate(25 1150 540)"
          />
          {/* Small Leaf 3 */}
          <path
            d="M240,780 Q265,755 290,780 Q265,805 240,780 Z"
            fill="#10B981"
            transform="rotate(-40 265 780)"
          />
        </g>
      </svg>
    </div>
  );
}

export default AgroLeafBackground;
