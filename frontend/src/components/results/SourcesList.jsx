import React from 'react';
import { Database, FileText } from 'lucide-react';

/**
 * SourcesList component for rendering citation sources and evidence references.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function SourcesList({ sources = [] }) {
  const hasSources = Array.isArray(sources) && sources.length > 0;

  return (
    <div className="card" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title">
          <Database size={20} color="#2E9F45" />
          Grounded Citation Sources
        </h3>
      </div>

      {!hasSources ? (
        <p style={{ color: '#617064', fontSize: '0.875rem', fontStyle: 'italic' }}>
          No specific citation sources attached to this risk verdict.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sources.map((item, idx) => {
            const name = item.name || item.document || 'Source Citation';
            const badgeText = item.type || item.chunk_id || item.reference || 'Evidence';
            const details = item.source || item.reference || item.section || item.excerpt;

            return (
              <div key={idx} className="source-item" style={{ padding: '1rem 1.15rem', background: '#F4FAF4', borderRadius: '12px', border: '1px solid #E2E8E2' }}>
                <div className="source-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="source-name" style={{ fontWeight: 800, color: '#17301F', fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={16} color="#2E9F45" />
                    {name}
                  </span>
                  <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>{badgeText}</span>
                </div>
                {details && (
                  <div className="source-excerpt" style={{ fontSize: '0.85rem', color: '#617064', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{details}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SourcesList;

