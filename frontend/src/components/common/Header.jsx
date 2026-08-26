import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import StatusPill from './StatusPill.jsx';

/**
 * Topbar Header component.
 *
 * @param {Object} props
 * @param {'connected'|'disconnected'|'checking'} [props.apiStatus='connected']
 */
export function Header({ apiStatus = 'connected' }) {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="brand-container">
          <div className="brand-logo-icon">
            <Sprout size={18} color="#ffffff" />
          </div>
          <div className="brand-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1>Agri Microclimate Agent</h1>
              <span className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                FortyGuard '26
              </span>
            </div>
            <span>AI Hyperlocal Agricultural Decision Engine</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusPill status={apiStatus} />
        </div>
      </div>
    </header>
  );
}

export default Header;
