import React from 'react';
import { Database, FileText } from 'lucide-react';

/**
 * SourcesList component for rendering citation sources and evidence references.
 *
 * @param {Object} props
 * @param {Array} [props.sources=[]]
 */
export function SourcesList({ sources = [] }) {
  const hasSources = Array.isArray(sources) && sources.length > 0;

  return (
    <div className="card glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Database size={18} color="#0ea5e9" />
          Grounded Citation Sources
        </h3>
      </div>

      {!hasSources ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No specific citation sources attached to this risk verdict.
        </p>
      ) : (
        sources.map((item, idx) => {
          const name = item.name || item.document || 'Source Citation';
          const badgeText = item.type || item.chunk_id || item.reference || 'Evidence';
          const details = item.source || item.reference || item.section || item.excerpt;

          return (
            <div key={idx} className="source-item">
              <div className="source-header">
                <span className="source-name">
                  <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {name}
                </span>
                <span className="badge">{badgeText}</span>
              </div>
              {details && (
                <div className="source-excerpt">
                  "{details}"
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default SourcesList;
