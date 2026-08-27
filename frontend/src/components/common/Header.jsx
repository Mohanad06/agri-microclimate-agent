import React from 'react';
import { Sprout } from 'lucide-react';
import StatusPill from './StatusPill.jsx';

/**
 * Topbar Header component.
 * Features sticky backdrop blur, brand mark, live status pill, and direct navigation links.
 */
export function Header({ apiStatus = 'connected', currentPath = '/', onNavigate }) {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="brand-container" onClick={() => onNavigate && onNavigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <Sprout size={22} color="#FFFFFF" />
          </div>
          <div className="brand-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h1>Agri Microclimate Agent</h1>
              <span className="badge">
                FortyGuard '26
              </span>
            </div>
            <span className="brand-subtitle">AI Hyperlocal Agricultural Decision Engine</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/')}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={`nav-link ${currentPath === '/analyze' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/analyze')}
          >
            Analyze
          </button>

          <button
            type="button"
            className={`nav-link ${currentPath === '/agent' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/agent')}
          >
            Agent Intelligence
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusPill status={apiStatus} />

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate && onNavigate('/analyze')}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', width: 'auto' }}
          >
            + New Analysis
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

