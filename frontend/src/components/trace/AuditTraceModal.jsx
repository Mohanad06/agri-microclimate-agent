import React, { useEffect } from 'react';
import { X, FileText, Copy, Check } from 'lucide-react';

/**
 * AuditTraceModal component for rendering full agent audit trace logs in a dialog overlay.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function AuditTraceModal({ open, onClose, trace }) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const traceText = typeof trace === 'string' ? trace : JSON.stringify(trace, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(traceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="modal-content-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(15, 32, 21, 0.95)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          color: 'var(--text-primary)'
        }}
      >
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(10, 24, 15, 0.9)' }}>
          <div className="modal-title" id="audit-modal-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary-green)" />
            Agent Audit Trace Log
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button type="button" className="secondary-button" onClick={handleCopy} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              {copied ? <Check size={14} color="var(--primary-green)" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Trace'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <pre
            className="audit-trace-pre"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              background: 'rgba(10, 24, 15, 0.85)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0
            }}
          >
            {traceText || 'No audit trace available.'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default AuditTraceModal;

