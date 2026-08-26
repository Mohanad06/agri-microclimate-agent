import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * RiskBanner component for rendering risk verdict assessment cards.
 *
 * @param {Object} props
 * @param {'HIGH'|'LOW'|'INSUFFICIENT_EVIDENCE'} props.level
 * @param {string} props.summary
 */
export function RiskBanner({ level = 'INSUFFICIENT_EVIDENCE', summary }) {
  if (level === 'HIGH') {
    return (
      <div className="risk-banner high" role="region" aria-label="Risk Assessment: HIGH">
        <div className="risk-header">
          <div className="risk-title">
            <AlertTriangle size={22} color="#ef4444" />
            HIGH HEAT RISK DETECTED
          </div>
          <div className="status-pill high-risk">HIGH RISK</div>
        </div>
        <p className="risk-reasoning">{summary || 'Observed temperature exceeds crop thermal thresholds.'}</p>
      </div>
    );
  }

  if (level === 'LOW') {
    return (
      <div className="risk-banner low" role="region" aria-label="Risk Assessment: LOW">
        <div className="risk-header">
          <div className="risk-title">
            <CheckCircle2 size={22} color="#10b981" />
            LOW RISK / SAFE CONDITIONS
          </div>
          <div className="status-pill low-risk">LOW RISK</div>
        </div>
        <p className="risk-reasoning">{summary || 'Environmental conditions are within safe crop growth thresholds.'}</p>
      </div>
    );
  }

  return (
    <div className="risk-banner insufficient" role="region" aria-label="Risk Assessment: INSUFFICIENT EVIDENCE">
      <div className="risk-header">
        <div className="risk-title">
          <HelpCircle size={22} color="#94a3b8" />
          INSUFFICIENT EVIDENCE
        </div>
        <div className="status-pill insufficient">INSUFFICIENT DATA</div>
      </div>
      <p className="risk-reasoning">
        {summary || 'Agronomic evidence was found, but no runtime observation was available to evaluate risk.'}
      </p>
    </div>
  );
}

export default RiskBanner;
