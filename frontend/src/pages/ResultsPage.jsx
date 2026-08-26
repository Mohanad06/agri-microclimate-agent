import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, FileText, Database, ListOrdered, Bot, Sparkles, CheckCircle2, ShieldAlert, AlertTriangle, Layers, MapPin } from 'lucide-react';
import RiskBanner from '../components/results/RiskBanner.jsx';
import FindingsGrid from '../components/results/FindingsGrid.jsx';
import RecommendationsList from '../components/results/RecommendationsList.jsx';
import SourcesList from '../components/results/SourcesList.jsx';
import AgentActivityTrace from '../components/trace/AgentActivityTrace.jsx';
import AuditTraceModal from '../components/trace/AuditTraceModal.jsx';

/**
 * ResultsPage component providing clean 4-tab decision-support dashboard.
 *
 * @param {Object} props
 * @param {Object} props.analysisResult
 * @param {Function} props.onNavigate
 * @param {boolean} props.auditModalOpen
 * @param {Function} props.setAuditModalOpen
 */
export function ResultsPage({
  analysisResult,
  onNavigate,
  auditModalOpen,
  setAuditModalOpen,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'evidence' | 'actions' | 'trace'

  if (!analysisResult) {
    return (
      <div className="card glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
          No Analysis Results Active
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Please start a new microclimate risk assessment to generate decisions.
        </p>
        <button className="primary-button" onClick={() => onNavigate('/analyze')} style={{ margin: '0 auto', width: 'auto' }}>
          Start New Analysis
        </button>
      </div>
    );
  }

  const { goal, location, risk_assessment, findings, recommendations, sources, tool_calls, audit_trace, narrative } = analysisResult;

  // Extract crop & stage from goal or findings for header badge
  const cropStageLabel = `${analysisResult.location?.address || 'Field Location'}`;

  return (
    <div className="results-page">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="secondary-button"
            onClick={() => onNavigate('/analyze')}
            style={{ padding: '0.5rem 0.85rem' }}
          >
            <ArrowLeft size={16} />
            New Analysis
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', borderColor: 'rgba(14, 165, 233, 0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={12} />
              {location?.address || 'Phoenix, AZ'}
            </span>
            {location?.latitude && location?.longitude && (
              <span className="badge" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            Verified Decision Output
          </span>
        </div>
      </div>

      {/* Primary Risk Verdict Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RiskBanner
          level={risk_assessment?.level}
          summary={risk_assessment?.reasoning}
        />
      </div>

      {/* 4 Clean Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.09)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          className={`secondary-button ${activeTab === 'overview' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.65rem 1.15rem',
            background: activeTab === 'overview' ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
            borderColor: activeTab === 'overview' ? '#0ea5e9' : 'transparent',
            color: activeTab === 'overview' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700
          }}
        >
          <LayoutDashboard size={16} />
          OVERVIEW
        </button>

        <button
          className={`secondary-button ${activeTab === 'evidence' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '0.65rem 1.15rem',
            background: activeTab === 'evidence' ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
            borderColor: activeTab === 'evidence' ? '#0ea5e9' : 'transparent',
            color: activeTab === 'evidence' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700
          }}
        >
          <Database size={16} />
          EVIDENCE ({findings?.length || 0})
        </button>

        <button
          className={`secondary-button ${activeTab === 'actions' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('actions')}
          style={{
            padding: '0.65rem 1.15rem',
            background: activeTab === 'actions' ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
            borderColor: activeTab === 'actions' ? '#0ea5e9' : 'transparent',
            color: activeTab === 'actions' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700
          }}
        >
          <ListOrdered size={16} />
          ACTIONS ({recommendations?.length || 0})
        </button>

        <button
          className={`secondary-button ${activeTab === 'trace' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('trace')}
          style={{
            padding: '0.65rem 1.15rem',
            background: activeTab === 'trace' ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
            borderColor: activeTab === 'trace' ? '#0ea5e9' : 'transparent',
            color: activeTab === 'trace' ? '#38bdf8' : '#94a3b8',
            fontWeight: 700
          }}
        >
          <Bot size={16} />
          AGENT TRACE ({tool_calls?.length || 0})
        </button>
      </div>

      {/* TAB 1 — OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Executive Summary & Narrative */}
          {narrative && (
            <div className="card glass-card" style={{ borderLeft: '4px solid #0ea5e9' }}>
              <div className="section-header" style={{ marginBottom: '0.6rem' }}>
                <h3 className="section-title">
                  <FileText size={18} color="#0ea5e9" />
                  Executive Summary & Farmer Narrative
                </h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#f8fafc', margin: 0 }}>
                {narrative}
              </p>
            </div>
          )}

          {/* Environmental Observations Grid */}
          <FindingsGrid findings={findings} />
        </div>
      )}

      {/* TAB 2 — EVIDENCE */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <SourcesList sources={sources} />

          {/* Grounded Threshold Table */}
          <div className="card glass-card">
            <div className="section-header">
              <h3 className="section-title">
                <Database size={18} color="#10b981" />
                Agronomic vs Environmental Comparisons
              </h3>
            </div>

            {findings && findings.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Metric</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Observed Runtime Value</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Agronomic Boundary</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {findings.map((f, idx) => {
                      const isViolated = f.status === 'violated';
                      const isWarning = f.status === 'warning';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#f8fafc' }}>
                            {f.metric || 'Metric'}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", color: isViolated ? '#fca5a5' : '#34d399' }}>
                            {f.observed !== null && f.observed !== undefined ? String(f.observed) : 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8' }}>
                            {f.threshold !== null && f.threshold !== undefined ? String(f.threshold) : 'Observation'}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              className="badge"
                              style={{
                                background: isViolated ? 'rgba(239, 68, 68, 0.15)' : isWarning ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isViolated ? '#fca5a5' : isWarning ? '#fcd34d' : '#34d399',
                                borderColor: isViolated ? 'rgba(239, 68, 68, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              {f.status ? f.status.toUpperCase() : 'EVALUATED'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No comparison metrics recorded for this query.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3 — ACTIONS */}
      {activeTab === 'actions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RecommendationsList recommendations={recommendations} />
        </div>
      )}

      {/* TAB 4 — AGENT TRACE */}
      {activeTab === 'trace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Agent Activity Diagram */}
          <div className="card glass-card">
            <div className="section-header">
              <h3 className="section-title">
                <Bot size={18} color="#a855f7" />
                How the Agent Reached This Decision
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem', background: '#090d16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>01. USER GOAL</span>
              <span style={{ color: '#64748b' }}>→</span>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>02. GOAL PARSER</span>
              <span style={{ color: '#64748b' }}>→</span>
              <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>03. DYNAMIC PLANNER</span>
              <span style={{ color: '#64748b' }}>→</span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>04. TOOL REGISTRY</span>
              <span style={{ color: '#64748b' }}>→</span>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d' }}>05. DECISION ENGINE</span>
            </div>
          </div>

          <AgentActivityTrace
            toolCalls={tool_calls}
            onOpenAuditModal={() => setAuditModalOpen(true)}
          />
        </div>
      )}

      {/* Full Audit Trace Modal */}
      <AuditTraceModal
        open={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        trace={audit_trace}
      />
    </div>
  );
}

export default ResultsPage;
