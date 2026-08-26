import React from 'react';
import { Thermometer, Sun, Droplets, Activity } from 'lucide-react';

/**
 * Returns an appropriate Lucide icon for a given metric key.
 */
function getMetricIcon(metricName) {
  const name = (metricName || '').toLowerCase();
  if (name.includes('max') || name.includes('sun') || name.includes('heat')) {
    return <Sun size={12} color="#f59e0b" />;
  }
  if (name.includes('moisture') || name.includes('water') || name.includes('rain') || name.includes('precip')) {
    return <Droplets size={12} color="#0ea5e9" />;
  }
  if (name.includes('humidity')) {
    return <Activity size={12} color="#10b981" />;
  }
  return <Thermometer size={12} color="#0ea5e9" />;
}

/**
 * Normalizes backend metric key to human-friendly display label and default unit.
 */
function formatMetricDisplay(item) {
  const rawMetric = item.metric || item.label || 'Metric';
  let label = item.label || rawMetric.replace(/_/g, ' ').toUpperCase();
  let unit = item.unit || '';

  const lower = rawMetric.toLowerCase();
  if (lower.includes('temp')) {
    if (!unit) unit = '°C';
    if (Array.isArray(item.threshold)) {
      label = 'Optimal Temp Range';
    } else if (lower === 'min_temperature') {
      label = 'Min Temperature';
    } else if (lower === 'mean_temperature') {
      label = 'Mean Temperature';
    } else if (lower === 'wet_bulb_temperature') {
      label = 'Wet-Bulb Temp';
    } else {
      label = 'Max Thermal Limit';
    }
  } else if (lower.includes('soil') || lower.includes('wetness')) {
    if (!unit) unit = 'index';
    label = 'Root-Zone Soil Wetness';
  } else if (lower.includes('precip') || lower.includes('rain')) {
    if (!unit) unit = 'mm/d';
    label = 'Avg Daily Rainfall';
  } else if (lower.includes('humidity')) {
    if (!unit) unit = '%';
    label = 'Relative Humidity';
  } else if (lower.includes('heat_index')) {
    if (!unit) unit = '°C';
    label = 'Heat Index';
  } else if (lower.includes('irradiance')) {
    if (!unit) unit = 'W/m²';
    label = 'Solar Irradiance';
  }

  const val = item.value !== undefined ? item.value : item.observed;
  const formattedVal = typeof val === 'number' ? val.toFixed(1) : (val !== null && val !== undefined ? String(val) : 'N/A');

  let subtitle = item.subtitle;
  if (!subtitle && item.threshold !== undefined && item.threshold !== null) {
    const thStr = Array.isArray(item.threshold) ? item.threshold.join(' – ') : String(item.threshold);
    subtitle = `Threshold: ${thStr}${unit ? ' ' + unit : ''}`;
  }

  // Extract farmer explanation sentence from item.description if available
  let explanation = item.description || '';
  if (explanation.includes('—')) {
    explanation = explanation.split('—').pop().trim();
  }

  return { label, value: formattedVal, unit, subtitle, explanation, status: item.status };
}

/**
 * FindingsGrid component for rendering environmental observation metrics.
 *
 * @param {Object} props
 * @param {Array} [props.findings=[]]
 */
export function FindingsGrid({ findings = [] }) {
  if (!findings || findings.length === 0) {
    return (
      <div className="card glass-card">
        <div className="section-header">
          <h3 className="section-title">
            <Thermometer size={18} color="#0ea5e9" />
            Environmental Observations
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No environmental observations available for this query.
        </p>
      </div>
    );
  }

  return (
    <div className="card glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Thermometer size={18} color="#0ea5e9" />
          Environmental Observations
        </h3>
        <span className="status-pill online">{findings.length} Metrics Evaluated</span>
      </div>

      <div className="metrics-grid">
        {findings.map((item, idx) => {
          const { label, value, unit, subtitle, explanation, status } = formatMetricDisplay(item);
          const isViolated = status === 'violated';
          const isWarning = status === 'warning';

          return (
            <div key={idx} className="metric-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="metric-label">
                  {getMetricIcon(label)}
                  {label}
                </div>
                <div
                  className="metric-value"
                  style={{ color: isViolated ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--text-primary)' }}
                >
                  {value} {unit}
                </div>
                {subtitle && <div className="metric-subtitle">{subtitle}</div>}
              </div>

              {explanation && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    lineHeight: '1.35',
                    color: isViolated ? '#fca5a5' : isWarning ? '#fde047' : 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  💡 {explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FindingsGrid;
