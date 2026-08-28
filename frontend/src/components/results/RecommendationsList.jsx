import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * RecommendationsList component for displaying actionable agronomic advice.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function RecommendationsList({ recommendations = [] }) {
  const hasItems = Array.isArray(recommendations) && recommendations.length > 0;

  return (
    <div className="card" style={{ background: 'var(--surface-card, linear-gradient(135deg, rgba(20, 56, 45, 0.88) 0%, rgba(10, 32, 25, 0.92) 100%))', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title" style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={20} color="#34D399" />
          Agronomic Action Plan
        </h3>
        {hasItems && (
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.16)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {recommendations.length} Steps
          </span>
        )}
      </div>

      {!hasItems ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted, #94A3B8)', fontSize: '0.875rem' }}>
          <Info size={16} />
          <span>No specific management recommendations triggered for this query.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {recommendations.map((item, idx) => {
            const text = typeof item === 'string' ? item : (item.text || item.description);
            const isHigh = typeof item === 'object' && item?.priority === 'high';
            return (
              <div
                key={idx}
                className="recommendation-item"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '1rem 1.15rem',
                  borderRadius: '12px',
                  background: isHigh ? 'rgba(239, 68, 68, 0.12)' : 'rgba(12, 40, 32, 0.75)',
                  borderLeft: isHigh ? '4px solid #EF4444' : '4px solid #34D399',
                  border: isHigh ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderLeftWidth: '4px'
                }}
              >
                <span
                  style={{
                    minWidth: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.18)',
                    color: isHigh ? '#EF4444' : '#34D399',
                    border: `1px solid ${isHigh ? 'rgba(239, 68, 68, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, fontSize: '0.925rem', lineHeight: '1.55', color: '#FFFFFF' }}>
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecommendationsList;

