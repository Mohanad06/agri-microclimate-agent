import React from 'react';
import HorizontalBrushStroke from './HorizontalBrushStroke.jsx';

/**
 * Global Fixed Background Component featuring the exact horizontal brush stroke shape
 * from the user reference image, rendered in premium brand green in suitable background locations.
 */
export function HorizontalBrushBackground() {
  return (
    <div
      className="horizontal-brush-bg-layer"
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
      }}
    >
      {/* Top-Right Margin Horizontal Brush Blot */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '-90px',
          width: '580px',
          height: '110px',
          transform: 'rotate(-4deg)',
        }}
      >
        <HorizontalBrushStroke width="100%" height="100%" opacity={0.88} />
      </div>

      {/* Mid-Left Margin Horizontal Brush Blot */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '-110px',
          width: '620px',
          height: '120px',
          transform: 'rotate(3deg)',
        }}
      >
        <HorizontalBrushStroke width="100%" height="100%" opacity={0.82} />
      </div>

      {/* Bottom-Right Margin Horizontal Brush Blot */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '-70px',
          width: '540px',
          height: '105px',
          transform: 'rotate(-2deg)',
        }}
      >
        <HorizontalBrushStroke width="100%" height="100%" opacity={0.78} />
      </div>
    </div>
  );
}

export default HorizontalBrushBackground;
