import React from 'react';
import { Thermometer, Sun, Droplets, Activity } from 'lucide-react';
import MetricCard21st from './MetricCard21st.jsx';

/**
 * Returns an appropriate Lucide icon component for a given metric key.
 */
function getMetricIconComponent(metricName) {
  const name = (metricName || '').toLowerCase();
  if (name.includes('max') || name.includes('sun') || name.includes('heat')) {
    return Sun;
  }
  if (name.includes('moisture') || name.includes('water') || name.includes('rain') || name.includes('precip')) {
    return Droplets;
  }
  if (name.includes('humidity')) {
    return Activity;
  }
  return Thermometer;
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
 * Uses 21st.dev Neomorphism Metric Cards.
 *
 * @param {Object} props
 * @param {Array} [props.findings=[]]
 */
export function FindingsGrid({ findings = [] }) {
  if (!findings || findings.length === 0) {
    return (
      <div className="card" style={{ background: '#FFFFFF' }}>
        <div className="section-header">
          <h3 className="section-title">
            <Thermometer size={20} color="#2E9F45" />
            Environmental Observations
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
          No environmental observations available for this query.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: '#FFFFFF' }}>
      <div className="section-header">
        <h3 className="section-title">
          <Thermometer size={20} color="#2E9F45" />
          Environmental Observations
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge">
            21st.dev UI #24337
          </span>
          <span className="status-pill online">{findings.length} Metrics</span>
        </div>
      </div>

      <div className="metrics-grid">
        {findings.map((item, idx) => {
          const { label, value, unit, subtitle, explanation, status } = formatMetricDisplay(item);
          const Icon = getMetricIconComponent(label);

          return (
            <MetricCard21st
              key={idx}
              title={label}
              value={value}
              unit={unit}
              subtitle={subtitle}
              explanation={explanation}
              status={status}
              icon={Icon}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FindingsGrid;

