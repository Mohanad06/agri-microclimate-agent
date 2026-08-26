import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * MetricCard21st Component
 *
 * Integrated from 21st.dev (Component ID: 24337 - Neomorphism Metric Card)
 * Designed for Agri Microclimate Agent environmental observation metrics.
 */
export function MetricCard21st({
  title,
  value,
  unit,
  subtitle,
  explanation,
  status,
  icon: Icon
}) {
  const isViolated = status === 'violated';
  const isWarning = status === 'warning';
  const isSafe = status === 'safe';

  // Status color mappings
  let statusColor = '#34d399'; // Emerald safe
  let StatusIcon = CheckCircle2;
  let statusLabel = 'Optimal';

  if (isViolated) {
    statusColor = '#fca5a5'; // Red alert
    StatusIcon = ShieldAlert;
    statusLabel = 'Threshold Exceeded';
  } else if (isWarning) {
    statusColor = '#fcd34d'; // Amber warning
    StatusIcon = AlertTriangle;
    statusLabel = 'Low Observation';
  }

  return (
    <div
      className="metric-card-21st"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: `1px solid ${isViolated ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.09)'}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: isViolated ? '0 4px 20px rgba(239, 68, 68, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {Icon && <Icon size={14} color={statusColor} />}
            {title}
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              background: isViolated ? 'rgba(239, 68, 68, 0.15)' : isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: statusColor,
              border: `1px solid ${statusColor}40`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <StatusIcon size={10} />
            {statusLabel}
          </span>
        </div>

        <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: isViolated ? '#fca5a5' : isWarning ? '#fcd34d' : '#f8fafc', fontFamily: "'JetBrains Mono', monospace" }}>
          {value} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>{unit}</span>
        </div>

        {subtitle && (
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.35rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      {explanation && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.6rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            color: isViolated ? '#fca5a5' : isWarning ? '#fde047' : '#94a3b8',
            fontStyle: 'italic'
          }}
        >
          💡 {explanation}
        </div>
      )}
    </div>
  );
}

export default MetricCard21st;
