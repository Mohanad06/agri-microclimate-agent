import React from 'react';

/**
 * RealWhiteBrushBackground Component
 * Green Vertical Paint Brush Border Image (brush_bottom_green.jpg):
 * Renders the exact user-uploaded green paint brush border image.
 */
export function RealWhiteBrushBackground() {
  return (
    <div
      className="real-white-brush-bg-wrapper"
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
        background: '#0E3529',
      }}
    >
      <img
        src="/brush_bottom_green.jpg"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: 0.9,
        }}
      />
    </div>
  );
}

export default RealWhiteBrushBackground;




