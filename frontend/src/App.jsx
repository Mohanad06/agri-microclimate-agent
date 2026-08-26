import React from 'react';
import useAgent from './hooks/useAgent.js';
import Header from './components/common/Header.jsx';
import AnalysisForm from './components/form/AnalysisForm.jsx';
import RiskBanner from './components/results/RiskBanner.jsx';
import FindingsGrid from './components/results/FindingsGrid.jsx';
import RecommendationsList from './components/results/RecommendationsList.jsx';
import SourcesList from './components/results/SourcesList.jsx';
import AgentActivityTrace from './components/trace/AgentActivityTrace.jsx';
import AuditTraceModal from './components/trace/AuditTraceModal.jsx';
import { Sparkles, Info, FileText } from 'lucide-react';
import './App.css';

/**
 * Main Agri Microclimate Agent Application Component.
 */
function App() {
  const {
    apiStatus,
    crops,
    formData,
    analysisResult,
    loading,
    error,
    auditModalOpen,
    setAuditModalOpen,
    handleFormChange,
    submitAnalysis,
  } = useAgent();

  return (
    <div className="app-shell">
      {/* Top Header with live API connection status */}
      <Header apiStatus={apiStatus} />

      {/* Main Page Layout */}
      <main className="page-container">
        {/* Hero Introduction Banner */}
        <div className="hero-banner">
          <div className="hero-header">
            <Sparkles size={22} color="#0ea5e9" />
            <h2 className="hero-title">
              Hyperlocal Climate Intelligence for Smarter Farming
            </h2>
          </div>
          <p className="hero-description">
            Transforming natural language agricultural goals into explainable, citation-backed decision support. Fusing FortyGuard hyperlocal thermal forecasting, NASA POWER satellite climatology, and vector RAG agronomic evidence.
          </p>
          <div className="hero-pills">
            <span className="hero-pill primary">FortyGuard Hyperlocal Thermal API</span>
            <span className="hero-pill accent">NASA POWER Climatology</span>
            <span className="hero-pill">Vector Agronomic RAG</span>
            <span className="hero-pill">Autonomous Agentic Orchestration</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column — Interactive Analysis Form & Map Pin Input */}
          <div className="left-column">
            <AnalysisForm
              formData={formData}
              onChange={handleFormChange}
              onSubmit={submitAnalysis}
              crops={crops}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column — Real Analysis Results / Empty Initial State */}
          <div className="right-column">
            {!analysisResult && !loading ? (
              <div className="card glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1rem' }}>
                  <Info size={32} color="#0ea5e9" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Ready for Microclimate Analysis
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
                  Enter your farm location, select your target crop, and submit an agricultural question to run autonomous microclimate risk assessment.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="badge">FortyGuard Hyperlocal Thermal API</span>
                  <span className="badge">NASA POWER</span>
                  <span className="badge">Agronomic RAG</span>
                </div>
              </div>
            ) : (
              <>
                {/* Risk Verdict Banner */}
                {analysisResult && (
                  <RiskBanner
                    level={analysisResult.risk_assessment?.level}
                    summary={analysisResult.risk_assessment?.reasoning}
                  />
                )}

                {/* Farmer Executive Summary Narrative */}
                {analysisResult?.narrative && (
                  <div className="card glass-card" style={{ borderLeft: '4px solid #0ea5e9' }}>
                    <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                      <h3 className="section-title">
                        <FileText size={18} color="#0ea5e9" />
                        Executive Summary & Narrative
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                      {analysisResult.narrative}
                    </p>
                  </div>
                )}

                {/* Microclimate Environmental Observations */}
                {analysisResult && <FindingsGrid findings={analysisResult.findings} />}

                {/* Agronomic Recommendations Action Plan */}
                {analysisResult && <RecommendationsList recommendations={analysisResult.recommendations} />}

                {/* Grounded Citation Sources */}
                {analysisResult && <SourcesList sources={analysisResult.sources} />}

                {/* Agent Execution Trace */}
                {analysisResult && (
                  <AgentActivityTrace
                    toolCalls={analysisResult.tool_calls}
                    onOpenAuditModal={() => setAuditModalOpen(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Full Audit Trace Modal */}
      {analysisResult && (
        <AuditTraceModal
          open={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
          trace={analysisResult.audit_trace}
        />
      )}
    </div>
  );
}

export default App;
