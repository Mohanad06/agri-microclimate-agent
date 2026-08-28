import React from 'react';
import { Activity, CheckCircle2, XCircle, FileCode } from 'lucide-react';

/**
 * AgentActivityTrace component for rendering tool call sequence.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function AgentActivityTrace({ toolCalls = [], onOpenAuditModal }) {
  const hasCalls = Array.isArray(toolCalls) && toolCalls.length > 0;

  return (
    <div className="card" style={{ background: 'var(--surface-card, linear-gradient(135deg, rgba(20, 56, 45, 0.88) 0%, rgba(10, 32, 25, 0.92) 100%))', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title" style={{ color: '#FFFFFF' }}>
          <Activity size={20} color="#34D399" />
          Agent Execution Log
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.16)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {hasCalls ? `${toolCalls.length} Tools Executed` : 'Idle'}
          </span>
          {onOpenAuditModal && (
            <button
              type="button"
              className="secondary-button"
              onClick={onOpenAuditModal}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.825rem',
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.22)',
                color: '#34D399',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                borderRadius: '9999px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
              }}
            >
              <FileCode size={14} color="#34D399" />
              Full Audit Trace
            </button>
          )}
        </div>
      </div>

      {!hasCalls ? (
        <p style={{ color: 'var(--text-muted, #94A3B8)', fontSize: '0.875rem', fontStyle: 'italic' }}>
          No agent tool executions logged yet. Submit a goal to see execution steps.
        </p>
      ) : (
        <div className="trace-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {toolCalls.map((tc, idx) => {
            const isSuccess = tc.status === 'success';
            return (
              <div
                key={idx}
                className="trace-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.15rem',
                  background: 'rgba(12, 40, 32, 0.75)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.9rem'
                }}
              >
                <span className="trace-tool-name" style={{ fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  {isSuccess ? (
                    <CheckCircle2 size={16} color="#34D399" />
                  ) : (
                    <XCircle size={16} color="#EF4444" />
                  )}
                  {tc.tool}
                </span>
                <span className="trace-source" style={{ fontSize: '0.825rem', color: '#CBD5E1' }}>
                  {tc.source || tc.reference || (isSuccess ? 'Executed cleanly' : tc.error)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AgentActivityTrace;

