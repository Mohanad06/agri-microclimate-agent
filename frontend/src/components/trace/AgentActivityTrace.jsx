import React from 'react';
import { Activity, CheckCircle2, XCircle, FileCode } from 'lucide-react';

/**
 * AgentActivityTrace component for rendering tool call sequence.
 *
 * @param {Object} props
 * @param {Array} [props.toolCalls=[]]
 * @param {Function} [props.onOpenAuditModal]
 */
export function AgentActivityTrace({ toolCalls = [], onOpenAuditModal }) {
  const hasCalls = Array.isArray(toolCalls) && toolCalls.length > 0;

  return (
    <div className="card glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Activity size={18} color="#94a3b8" />
          Agent Execution Log
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge">{hasCalls ? `${toolCalls.length} Tools Executed` : 'Idle'}</span>
          {onOpenAuditModal && (
            <button
              type="button"
              className="secondary-button"
              onClick={onOpenAuditModal}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              <FileCode size={12} />
              Audit Trace
            </button>
          )}
        </div>
      </div>

      {!hasCalls ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No agent tool executions logged yet. Submit a goal to see execution steps.
        </p>
      ) : (
        <div className="trace-container">
          {toolCalls.map((tc, idx) => {
            const isSuccess = tc.status === 'success';
            return (
              <div key={idx} className="trace-item">
                <span className="trace-tool-name">
                  {isSuccess ? (
                    <CheckCircle2 size={14} color="#10b981" />
                  ) : (
                    <XCircle size={14} color="#ef4444" />
                  )}
                  {tc.tool}
                </span>
                <span className="trace-source">
                  {tc.source || tc.reference || (isSuccess ? 'Executed' : tc.error)}
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
