import React from 'react';
import { LOGO_DATA_URL } from './logoData.js';

/**
 * Agri Microclimate Agent Logo Component.
 * Directly renders the user's exact uploaded logo PNG image without extra borders or containers.
 */
export function AgriLogo({ size = 44, className = '', style = {} }) {
  return (
    <img
      src={LOGO_DATA_URL}
      alt="Agri Microclimate Agent Logo"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'block',
        objectFit: 'contain',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent',
        ...style,
      }}
    />
  );
}

export default AgriLogo;
