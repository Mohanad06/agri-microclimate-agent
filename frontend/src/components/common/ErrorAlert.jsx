import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * ErrorAlert component for displaying normalized API errors and validation details.
 *
 * @param {Object} props
 * @param {Object} props.error - Normalized error object { code, message, details, status }
 * @param {Function} [props.onDismiss]
 */
export function ErrorAlert({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="error-alert-banner" role="alert" aria-live="assertive">
      <div className="error-alert-header">
        <div className="error-alert-title">
          <AlertCircle size={18} />
          <span>{error.code || 'ERROR'}</span>
        </div>
        {onDismiss && (
          <button type="button" className="error-dismiss-btn" onClick={onDismiss} aria-label="Dismiss error">
            <X size={14} />
          </button>
        )}
      </div>

      <p className="error-alert-message">{error.message}</p>

      {Array.isArray(error.details) && error.details.length > 0 && (
        <ul className="error-details-list">
          {error.details.map((detail, idx) => (
            <li key={idx}>
              <strong>{detail.field || detail.loc?.join('.')}:</strong> {detail.message || detail.msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ErrorAlert;
