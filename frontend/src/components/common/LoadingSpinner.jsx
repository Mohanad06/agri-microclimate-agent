import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Accessible LoadingSpinner component.
 *
 * @param {Object} props
 * @param {number} [props.size=24]
 * @param {string} [props.label="Analyzing microclimate data..."]
 */
export function LoadingSpinner({ size = 24, label = "Analyzing microclimate data..." }) {
  return (
    <div className="loading-spinner-container" role="status" aria-live="polite">
      <Loader2 size={size} className="spin-icon" style={{ color: 'var(--primary)' }} />
      {label && <span className="loading-label">{label}</span>}
    </div>
  );
}

export default LoadingSpinner;
