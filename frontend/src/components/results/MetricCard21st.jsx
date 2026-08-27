import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * MetricCard21st Component
 *
 * Integrated from 21st.dev (Component ID: 24337 - Neomorphism Metric Card)
 * Restyled for Agri Microclimate Agent Light-First Premium AgriTech system.
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

  // Status color & badge mappings
  let statusColor = '#2E9F45'; // Primary green
  let statusBg = '#EAF7EC';
  let statusBorder = 'rgba(46, 159, 69, 0.3)';
  let StatusIcon = CheckCircle2;
  let statusLabel = 'Optimal';

  if (isViolated) {
    statusColor = '#E5484D';
    statusBg = '#FDF2F2';
    statusBorder = '#FCA5A5';
    StatusIcon = ShieldAlert;
    statusLabel = 'Threshold Exceeded';
  } else if (isWarning) {
    statusColor = '#D97706';
    statusBg = '#FEFCE8';
    statusBorder = '#FCD34D';
    StatusIcon = AlertTriangle;
    statusLabel = 'Low Observation';
  }

  return (
    <div
      className="metric-card-21st"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${isViolated ? '#FCA5A5' : isWarning ? '#FCD34D' : '#DDE9DF'}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: isViolated ? '0 4px 18px rgba(229, 72, 77, 0.12)' : '0 4px 18px rgba(23, 107, 53, 0.05)',
        transition: 'transform 200ms ease, box-shadow 200ms ease'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#617064', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {Icon && <Icon size={14} color={statusColor} />}
            {title}
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              background: statusBg,
              color: statusColor,
              border: `1px solid ${statusBorder}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <StatusIcon size={10} />
            {statusLabel}
          </span>
        </div>

        <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: isViolated ? '#E5484D' : '#17301F', fontFamily: "'JetBrains Mono', monospace" }}>
          {value} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#617064' }}>{unit}</span>
        </div>

        {subtitle && (
          <div style={{ fontSize: '0.775rem', color: '#8A9A8D', marginTop: '0.35rem', fontWeight: 500 }}>
            {subtitle}
          </div>
        )}
      </div>

      {explanation && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid #DDE9DF',
            fontSize: '0.8rem',
            lineHeight: '1.45',
            color: isViolated ? '#991B1B' : isWarning ? '#92400E' : '#276738',
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
