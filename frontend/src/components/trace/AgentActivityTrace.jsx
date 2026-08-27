import React from 'react';
import { Activity, CheckCircle2, XCircle, FileCode } from 'lucide-react';

/**
 * AgentActivityTrace component for rendering tool call sequence.
 * Restyled for Light-First Commercial AgriTech system.
 */
export function AgentActivityTrace({ toolCalls = [], onOpenAuditModal }) {
  const hasCalls = Array.isArray(toolCalls) && toolCalls.length > 0;

  return (
    <div className="card" style={{ background: '#FFFFFF', padding: '1.75rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <h3 className="section-title">
          <Activity size={20} color="#2E9F45" />
          Agent Execution Log
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge" style={{ background: '#EAF7EC', color: '#176B35' }}>
            {hasCalls ? `${toolCalls.length} Tools Executed` : 'Idle'}
          </span>
          {onOpenAuditModal && (
            <button
              type="button"
              className="secondary-button"
              onClick={onOpenAuditModal}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            >
              <FileCode size={14} />
              Full Audit Trace
            </button>
          )}
        </div>
      </div>

      {!hasCalls ? (
        <p style={{ color: '#617064', fontSize: '0.875rem', fontStyle: 'italic' }}>
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
                  background: '#F4FAF4',
                  borderRadius: '12px',
                  border: '1px solid #E2E8E2',
                  fontSize: '0.9rem'
                }}
              >
                <span className="trace-tool-name" style={{ fontWeight: 700, color: '#17301F', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
                  {isSuccess ? (
                    <CheckCircle2 size={16} color="#2E9F45" />
                  ) : (
                    <XCircle size={16} color="#E5484D" />
                  )}
                  {tc.tool}
                </span>
                <span className="trace-source" style={{ fontSize: '0.825rem', color: '#617064' }}>
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

