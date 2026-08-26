import React, { useEffect } from 'react';
import { X, FileText, Copy, Check } from 'lucide-react';

/**
 * AuditTraceModal component for rendering full agent audit trace logs in a dialog overlay.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string|Object} [props.trace]
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
    >
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" id="audit-modal-title">
            <FileText size={18} color="#0ea5e9" />
            Agent Audit Trace Log
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button type="button" className="secondary-button" onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Trace'}
            </button>
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <pre className="audit-trace-pre">{traceText || 'No audit trace available.'}</pre>
        </div>
      </div>
    </div>
  );
}

export default AuditTraceModal;
