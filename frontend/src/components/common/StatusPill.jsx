import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

/**
 * StatusPill component to visually display API connection status.
 *
 * @param {Object} props
 * @param {'connected'|'disconnected'|'checking'} props.status
 */
export function StatusPill({ status = 'connected' }) {
  if (status === 'checking') {
    return (
      <div className="status-pill insufficient" aria-live="polite">
        <Loader2 size={12} className="spin-icon" />
        Checking API...
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="status-pill high-risk" aria-live="polite">
        <WifiOff size={12} />
        API Disconnected
      </div>
    );
  }

  return (
    <div className="status-pill online" aria-live="polite">
      <Wifi size={12} />
      API Connected
    </div>
  );
}

export default StatusPill;
