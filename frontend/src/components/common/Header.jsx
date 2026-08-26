import React from 'react';
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
          <div className="brand-logo-icon">FG</div>
          <div className="brand-text">
            <h1>Agri Microclimate Agent</h1>
            <span>AI Agricultural Decision Support</span>
          </div>
        </div>
        <StatusPill status={apiStatus} />
      </div>
    </header>
  );
}

export default Header;
