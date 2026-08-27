import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * RiskBanner component for rendering risk verdict assessment cards.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function RiskBanner({ level = 'INSUFFICIENT_EVIDENCE', summary }) {
  if (level === 'HIGH') {
    return (
      <div className="risk-banner high" role="region" aria-label="Risk Assessment: HIGH">
        <div className="risk-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div className="risk-title">
            <AlertTriangle size={24} color="#E5484D" />
            HIGH HEAT RISK DETECTED
          </div>
          <span className="badge" style={{ background: '#FDF2F2', color: '#E5484D', borderColor: '#FCA5A5', padding: '0.4rem 0.85rem' }}>HIGH RISK</span>
        </div>
        <p className="risk-summary">{summary || 'Observed temperature exceeds crop thermal thresholds.'}</p>
      </div>
    );
  }

  if (level === 'LOW') {
    return (
      <div className="risk-banner low" role="region" aria-label="Risk Assessment: LOW">
        <div className="risk-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div className="risk-title">
            <CheckCircle2 size={24} color="#2E9F45" />
            LOW RISK / SAFE CONDITIONS
          </div>
          <span className="badge" style={{ background: '#EAF7EC', color: '#176B35', borderColor: 'rgba(46, 159, 69, 0.3)', padding: '0.4rem 0.85rem' }}>LOW RISK</span>
        </div>
        <p className="risk-summary">{summary || 'Environmental conditions are within safe crop growth thresholds.'}</p>
      </div>
    );
  }

  return (
    <div className="risk-banner insufficient" role="region" aria-label="Risk Assessment: INSUFFICIENT EVIDENCE">
      <div className="risk-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <div className="risk-title">
          <HelpCircle size={24} color="#64748B" />
          INSUFFICIENT EVIDENCE
        </div>
        <span className="badge" style={{ background: '#F1F5F9', color: '#64748B', borderColor: '#CBD5E1', padding: '0.4rem 0.85rem' }}>INSUFFICIENT DATA</span>
      </div>
      <p className="risk-summary">
        {summary || 'Agronomic evidence was found, but no runtime observation was available to evaluate risk.'}
      </p>
    </div>
  );
}

export default RiskBanner;

