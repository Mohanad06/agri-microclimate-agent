import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

/**
 * StatusPill component to visually display API connection status.
 */
export function StatusPill({ status = 'connected' }) {
  if (status === 'checking') {
    return (
      <div className="status-pill checking" aria-live="polite">
        <Loader2 size={13} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
        Checking API...
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="status-pill offline" aria-live="polite">
        <WifiOff size={13} />
        API Offline
      </div>
    );
  }

  return (
    <div className="status-pill online" aria-live="polite">
      <Wifi size={13} />
      API Connected
    </div>
  );
}

export default StatusPill;

