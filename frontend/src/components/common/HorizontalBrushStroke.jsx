import React from 'react';

/**
 * Reusable Horizontal Brush Stroke Accent Component.
 * Exactly matches the user's reference image featuring a wide horizontal paint stroke
 * with fine dry-brush bristle tails extending from the left and right ends.
 */
export function HorizontalBrushStroke({
  width = '100%',
  height = '50px',
  color = 'url(#brushGreenGrad)',
  opacity = 0.9,
  style = {},
  className = '',
}) {
  return (
    <svg
      viewBox="0 0 700 140"
      preserveAspectRatio="none"
      className={`horizontal-brush-stroke ${className}`}
      style={{
        display: 'block',
        width: width,
        height: height,
        overflow: 'visible',
        opacity: opacity,
        ...style,
      }}
    >
      <defs>
        {/* Organic Dry Brush Roughness Filter */}
        <filter id="brushBristleRoughness" x="-15%" y="-30%" width="130%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.18" numOctaves="3" seed="22" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Premium Dark Green Color Gradient */}
        <linearGradient id="brushGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B3C1B" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#176B35" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#2E9F45" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#176B35" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <g filter="url(#brushBristleRoughness)" fill={color}>
        {/* Main Solid Horizontal Paint Body */}
        <path d="M 110 35 Q 350 30, 570 25 L 600 50 Q 370 55, 120 60 Z" />
        <path d="M 80 50 Q 350 42, 620 40 L 645 78 Q 330 84, 70 88 Z" />
        <path d="M 100 75 Q 350 68, 590 65 L 610 102 Q 340 108, 90 112 Z" />
        <path d="M 130 98 Q 350 92, 540 90 L 565 122 Q 360 126, 120 128 Z" />

        {/* Fine Horizontal Dry-Brush Bristles extending to Left */}
        <line x1="30" y1="45" x2="170" y2="47" stroke="#176B35" strokeWidth="3" />
        <line x1="10" y1="58" x2="140" y2="60" stroke="#176B35" strokeWidth="4.5" />
        <line x1="40" y1="70" x2="190" y2="71" stroke="#176B35" strokeWidth="2.5" />
        <line x1="20" y1="83" x2="160" y2="84" stroke="#176B35" strokeWidth="3.5" />
        <line x1="50" y1="95" x2="180" y2="96" stroke="#176B35" strokeWidth="4" />
        <line x1="35" y1="108" x2="150" y2="109" stroke="#176B35" strokeWidth="2" />

        {/* Fine Horizontal Dry-Brush Bristles extending to Right */}
        <line x1="530" y1="38" x2="670" y2="36" stroke="#176B35" strokeWidth="3" />
        <line x1="500" y1="50" x2="690" y2="48" stroke="#176B35" strokeWidth="4.5" />
        <line x1="540" y1="63" x2="660" y2="62" stroke="#176B35" strokeWidth="2.5" />
        <line x1="510" y1="75" x2="680" y2="73" stroke="#176B35" strokeWidth="4" />
        <line x1="550" y1="88" x2="665" y2="86" stroke="#176B35" strokeWidth="3" />
        <line x1="520" y1="100" x2="650" y2="98" stroke="#176B35" strokeWidth="2" />
      </g>
    </svg>
  );
}

export default HorizontalBrushStroke;
