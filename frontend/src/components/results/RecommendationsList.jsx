import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

/**
 * RecommendationsList component for displaying actionable agronomic advice.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function RecommendationsList({ recommendations = [] }) {
  const hasItems = Array.isArray(recommendations) && recommendations.length > 0;

  return (
    <div className="card" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title">
          <ShieldCheck size={20} color="#2E9F45" />
          Agronomic Action Plan
        </h3>
        {hasItems && (
          <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>
            {recommendations.length} Steps
          </span>
        )}
      </div>

      {!hasItems ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#617064', fontSize: '0.875rem' }}>
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
                  background: isHigh ? '#FDF2F2' : '#F4FAF4',
                  borderLeft: isHigh ? '4px solid #E5484D' : '4px solid #2E9F45',
                  border: isHigh ? '1px solid #FCA5A5' : '1px solid #E2E8E2',
                  borderLeftWidth: '4px'
                }}
              >
                <span
                  style={{
                    minWidth: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isHigh ? '#FDF2F2' : '#EAF7EC',
                    color: isHigh ? '#E5484D' : '#176B35',
                    border: `1px solid ${isHigh ? '#FCA5A5' : 'rgba(46, 159, 69, 0.3)'}`,
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
                <div style={{ flex: 1, fontSize: '0.925rem', lineHeight: '1.55', color: '#17301F' }}>
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

