import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * RecommendationsList component for displaying actionable agronomic advice.
 *
 * @param {Object} props
 * @param {Array} [props.recommendations=[]]
 */
export function RecommendationsList({ recommendations = [] }) {
  const hasItems = Array.isArray(recommendations) && recommendations.length > 0;

  return (
    <div className="card glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <ShieldCheck size={18} color="#10b981" />
          Agronomic Action Plan
        </h3>
        {hasItems && (
          <span className="status-pill online" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            {recommendations.length} Steps
          </span>
        )}
      </div>

      {!hasItems ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Info size={14} />
          <span>No specific management recommendations triggered for this query.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: isHigh ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  borderLeft: isHigh ? '3px solid #ef4444' : '3px solid #10b981',
                }}
              >
                <span
                  style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isHigh ? '#ef4444' : '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                  }}
                >
                  {idx + 1}
                </span>
                <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.45', color: 'var(--text-primary)' }}>
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
