import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import StatusPill from './StatusPill.jsx';

/**
 * Topbar Header component.
 *
 * @param {Object} props
 * @param {'connected'|'disconnected'|'checking'} [props.apiStatus='connected']
 * @param {string} [props.currentPath='/']
 * @param {Function} [props.onNavigate]
 */
export function Header({ apiStatus = 'connected', currentPath = '/', onNavigate }) {
  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="brand-container" onClick={() => onNavigate && onNavigate('/')} style={{ cursor: 'pointer' }}>
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

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            type="button"
            className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPath === '/' ? '#38bdf8' : '#94a3b8',
              fontWeight: currentPath === '/' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.4rem 0',
              borderBottom: currentPath === '/' ? '2px solid #0ea5e9' : '2px solid transparent'
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={`nav-link ${currentPath === '/analyze' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/analyze')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPath === '/analyze' ? '#38bdf8' : '#94a3b8',
              fontWeight: currentPath === '/analyze' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.4rem 0',
              borderBottom: currentPath === '/analyze' ? '2px solid #0ea5e9' : '2px solid transparent'
            }}
          >
            Analyze
          </button>

          <button
            type="button"
            className={`nav-link ${currentPath === '/agent' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('/agent')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPath === '/agent' ? '#38bdf8' : '#94a3b8',
              fontWeight: currentPath === '/agent' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.4rem 0',
              borderBottom: currentPath === '/agent' ? '2px solid #0ea5e9' : '2px solid transparent'
            }}
          >
            Agent Intelligence
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <StatusPill status={apiStatus} />

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate && onNavigate('/analyze')}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem', width: 'auto' }}
          >
            + New Analysis
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
