import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, FileText, Database, ListOrdered, Bot, MapPin } from 'lucide-react';
import RiskBanner from '../components/results/RiskBanner.jsx';
import FindingsGrid from '../components/results/FindingsGrid.jsx';
import RecommendationsList from '../components/results/RecommendationsList.jsx';
import SourcesList from '../components/results/SourcesList.jsx';
import AgentActivityTrace from '../components/trace/AgentActivityTrace.jsx';
import AuditTraceModal from '../components/trace/AuditTraceModal.jsx';

/**
 * ResultsPage component providing clean 4-tab decision-support dashboard.
 * Restyled for Light-First Commercial AgriTech system.
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
      <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '640px', margin: '2rem auto', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.85rem', color: '#17301F' }}>
          No Active Analysis Results
        </h3>
        <p style={{ color: '#617064', fontSize: '0.925rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Please submit a microclimate risk assessment on the Analyze page to generate verified decisions and evidence reports.
        </p>
        <button className="primary-button" onClick={() => onNavigate('/analyze')} style={{ margin: '0 auto', width: 'auto' }}>
          Start New Analysis
        </button>
      </div>
    );
  }

  const { location, risk_assessment, findings, recommendations, sources, tool_calls, audit_trace, narrative } = analysisResult;

  return (
    <div className="results-page">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            className="secondary-button"
            onClick={() => onNavigate('/analyze')}
            style={{ padding: '0.6rem 1.15rem' }}
          >
            <ArrowLeft size={16} />
            New Analysis
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#EAF7EC', color: '#176B35', borderColor: 'rgba(46, 159, 69, 0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}>
              <MapPin size={15} color="#2E9F45" />
              {location?.address || 'Phoenix, AZ'}
            </span>
            {location?.latitude && location?.longitude && (
              <span className="badge" style={{ fontFamily: "'JetBrains Mono', monospace", background: '#F4FAF4', color: '#617064', padding: '0.4rem 0.85rem' }}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge" style={{ background: '#EAF7EC', color: '#2E9F45', borderColor: 'rgba(46, 159, 69, 0.3)', padding: '0.4rem 0.85rem' }}>
            Verified Decision Report
          </span>
        </div>
      </div>

      {/* Primary Risk Verdict Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <RiskBanner
          level={risk_assessment?.level}
          summary={risk_assessment?.reasoning}
        />
      </div>

      {/* 4 Clean Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.75rem', borderBottom: '1px solid #E2E8E2', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          className={`secondary-button ${activeTab === 'overview' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.7rem 1.25rem',
            background: activeTab === 'overview' ? '#EAF7EC' : '#FFFFFF',
            borderColor: activeTab === 'overview' ? '#2E9F45' : '#E2E8E2',
            color: activeTab === 'overview' ? '#176B35' : '#617064',
            fontWeight: 800
          }}
        >
          <LayoutDashboard size={16} />
          OVERVIEW
        </button>

        <button
          className={`secondary-button ${activeTab === 'evidence' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '0.7rem 1.25rem',
            background: activeTab === 'evidence' ? '#EAF7EC' : '#FFFFFF',
            borderColor: activeTab === 'evidence' ? '#2E9F45' : '#E2E8E2',
            color: activeTab === 'evidence' ? '#176B35' : '#617064',
            fontWeight: 800
          }}
        >
          <Database size={16} />
          EVIDENCE ({findings?.length || 0})
        </button>

        <button
          className={`secondary-button ${activeTab === 'actions' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('actions')}
          style={{
            padding: '0.7rem 1.25rem',
            background: activeTab === 'actions' ? '#EAF7EC' : '#FFFFFF',
            borderColor: activeTab === 'actions' ? '#2E9F45' : '#E2E8E2',
            color: activeTab === 'actions' ? '#176B35' : '#617064',
            fontWeight: 800
          }}
        >
          <ListOrdered size={16} />
          ACTIONS ({recommendations?.length || 0})
        </button>

        <button
          className={`secondary-button ${activeTab === 'trace' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('trace')}
          style={{
            padding: '0.7rem 1.25rem',
            background: activeTab === 'trace' ? '#EAF7EC' : '#FFFFFF',
            borderColor: activeTab === 'trace' ? '#2E9F45' : '#E2E8E2',
            color: activeTab === 'trace' ? '#176B35' : '#617064',
            fontWeight: 800
          }}
        >
          <Bot size={16} />
          AGENT TRACE ({tool_calls?.length || 0})
        </button>
      </div>

      {/* TAB 1 — OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Executive Summary & Narrative */}
          {narrative && (
            <div className="card" style={{ borderLeft: '4px solid #2E9F45', background: '#FFFFFF', padding: '1.75rem' }}>
              <div className="section-header" style={{ marginBottom: '0.75rem' }}>
                <h3 className="section-title">
                  <FileText size={20} color="#2E9F45" />
                  Executive Summary & Farmer Narrative
                </h3>
              </div>
              <p style={{ fontSize: '0.975rem', lineHeight: 1.65, color: '#17301F', margin: 0 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <SourcesList sources={sources} />

          {/* Grounded Threshold Table */}
          <div className="card" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <h3 className="section-title">
                <Database size={20} color="#2E9F45" />
                Agronomic vs Environmental Comparisons
              </h3>
            </div>

            {findings && findings.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8E2', textAlign: 'left', color: '#617064' }}>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Metric</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Observed Runtime Value</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Agronomic Boundary</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {findings.map((f, idx) => {
                      const isViolated = f.status === 'violated';
                      const isWarning = f.status === 'warning';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #F4FAF4' }}>
                          <td style={{ padding: '0.85rem 0.6rem', fontWeight: 700, color: '#17301F' }}>
                            {f.metric || 'Metric'}
                          </td>
                          <td style={{ padding: '0.85rem 0.6rem', fontFamily: "'JetBrains Mono', monospace", color: isViolated ? '#E5484D' : '#2E9F45', fontWeight: 800 }}>
                            {f.observed !== null && f.observed !== undefined ? String(f.observed) : 'N/A'}
                          </td>
                          <td style={{ padding: '0.85rem 0.6rem', fontFamily: "'JetBrains Mono', monospace", color: '#617064' }}>
                            {f.threshold !== null && f.threshold !== undefined ? String(f.threshold) : 'Observation'}
                          </td>
                          <td style={{ padding: '0.85rem 0.6rem' }}>
                            <span
                              className="badge"
                              style={{
                                background: isViolated ? '#FDF2F2' : isWarning ? '#FEFCE8' : '#EAF7EC',
                                color: isViolated ? '#E5484D' : isWarning ? '#D97706' : '#2E9F45',
                                borderColor: isViolated ? '#FCA5A5' : isWarning ? '#FCD34D' : 'rgba(46, 159, 69, 0.3)'
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
              <p style={{ color: '#617064', fontSize: '0.875rem', fontStyle: 'italic' }}>
                No comparison metrics recorded for this query.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3 — ACTIONS */}
      {activeTab === 'actions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <RecommendationsList recommendations={recommendations} />
        </div>
      )}

      {/* TAB 4 — AGENT TRACE */}
      {activeTab === 'trace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Agent Activity Pipeline Diagram */}
          <div className="card" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <h3 className="section-title">
                <Bot size={20} color="#2E9F45" />
                How the Agent Reached This Decision
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', padding: '1.15rem', background: '#F4FAF4', borderRadius: '14px', border: '1px solid #E2E8E2' }}>
              <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>01. USER GOAL</span>
              <span style={{ color: '#8A9A8D' }}>→</span>
              <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>02. GOAL PARSER</span>
              <span style={{ color: '#8A9A8D' }}>→</span>
              <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>03. DYNAMIC PLANNER</span>
              <span style={{ color: '#8A9A8D' }}>→</span>
              <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>04. TOOL REGISTRY</span>
              <span style={{ color: '#8A9A8D' }}>→</span>
              <span className="badge" style={{ background: '#FEFCE8', color: '#D97706', borderColor: '#FCD34D' }}>05. DECISION ENGINE</span>
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

