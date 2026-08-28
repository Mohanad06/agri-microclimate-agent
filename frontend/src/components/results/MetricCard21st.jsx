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
  let statusColor = '#34D399'; // Primary green
  let statusBg = 'rgba(16, 185, 129, 0.16)';
  let statusBorder = 'rgba(52, 211, 153, 0.4)';
  let StatusIcon = CheckCircle2;
  let statusLabel = 'Optimal';

  if (isViolated) {
    statusColor = '#EF4444';
    statusBg = 'rgba(239, 68, 68, 0.16)';
    statusBorder = 'rgba(239, 68, 68, 0.4)';
    StatusIcon = ShieldAlert;
    statusLabel = 'Threshold Exceeded';
  } else if (isWarning) {
    statusColor = '#F59E0B';
    statusBg = 'rgba(245, 158, 11, 0.16)';
    statusBorder = 'rgba(245, 158, 11, 0.4)';
    StatusIcon = AlertTriangle;
    statusLabel = 'Low Observation';
  }

  return (
    <div
      className="metric-card-21st"
      style={{
        background: 'rgba(12, 40, 32, 0.75)',
        border: `1px solid ${isViolated ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: isViolated ? '0 4px 18px rgba(239, 68, 68, 0.18)' : '0 4px 18px rgba(0, 0, 0, 0.3)',
        transition: 'transform 200ms ease, box-shadow 200ms ease'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

        <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: isViolated ? '#EF4444' : '#FFFFFF', fontFamily: "'JetBrains Mono', monospace" }}>
          {value} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8' }}>{unit}</span>
        </div>

        {subtitle && (
          <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.35rem', fontWeight: 500 }}>
            {subtitle}
          </div>
        )}
      </div>

      {explanation && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem',
            lineHeight: '1.45',
            color: isViolated ? '#FCA5A5' : isWarning ? '#FDE68A' : '#6EE7B7',
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
