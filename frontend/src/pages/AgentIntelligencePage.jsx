import React from 'react';
import { Bot, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * AgentIntelligencePage component illustrating agent architecture and safety gates.
 * Reverse-Engineered Light-First Commercial AgriTech visual language.
 */
export function AgentIntelligencePage({ onNavigate }) {
  const steps = [
    {
      num: '01',
      title: 'Goal Parsing',
      badge: 'GoalParser Module',
      description: 'Parses natural language agricultural questions into structured GoalParams (crop, crop_stage, location, coordinates, history flags).'
    },
    {
      num: '02',
      title: 'Dynamic Tool Sequencing',
      badge: 'Planner Module',
      description: 'Sequences only required tools dynamically based on parsed goal constraints (GeocodingTool, AgronomicEvidenceTool, FortyGuardTool, NasaPowerTool).'
    },
    {
      num: '03',
      title: 'Multi-Source Tool Execution',
      badge: 'ToolRegistry Module',
      description: 'Executes environmental APIs & vector searches in isolated, failure-safe execution blocks capturing structured operational traces.'
    },
    {
      num: '04',
      title: 'Agronomic Evidence Extraction',
      badge: 'EvidenceParser Module',
      description: 'Scans RAG vector chunks for quantitative thresholds (°C ranges, SWP limits, soil wetness boundaries) using regex parsers.'
    },
    {
      num: '05',
      title: 'Sufficiency Gate & Risk Evaluation',
      badge: 'DecisionLayer Module',
      description: 'Compares live environmental observations against parsed thresholds. Enforces Evidence Sufficiency Gate (returns INSUFFICIENT_EVIDENCE if no metrics match).'
    },
    {
      num: '06',
      title: 'Farmer Action Plan & Narrative',
      badge: 'Synthesis Engine',
      description: 'Generates scannable, multi-step mitigation action plans and a natural-language executive summary narrative grounded in citation sources.'
    }
  ];

  const dataBoundaries = [
    {
      source: 'FortyGuard Hyperlocal Thermal API',
      description: 'Serves as the runtime primary thermal authority, supplying parcel-scale surface heatmaps, peak exceedances, and temperature persistence statistics.'
    },
    {
      source: 'NASA POWER Satellite Service',
      description: 'Provides environmental climatology context, including daily precipitation (PRECTOTCORR) and root-zone soil wetness index (GWETROOT).'
    },
    {
      source: 'Agronomic RAG Knowledge Base',
      description: 'Serves as the grounded extension reference, containing vector embeddings of research publications from UC Davis, TAMU, and USDA for crop temperature stress limits.'
    }
  ];

  return (
    <div className="agent-page" style={{ maxWidth: '1020px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div className="section-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <h2 className="hero-title" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-primary)' }}>
              <Bot size={28} color="var(--primary-green)" />
              Autonomous Agentic Orchestration Architecture
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
              How the Agri Microclimate Agent converts natural language goals into explainable, citation-backed agricultural decisions.
            </p>
          </div>
          {/* <span className="badge">System Architecture</span> */}
        </div>

        {/* Visual Pipeline Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.35rem' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="card" style={{ background: 'var(--very-light-green)', padding: '1.35rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ background: 'var(--primary-green)', color: '#FFFFFF', fontWeight: 800 }}>
                  {step.num}
                </span>
                {/* <span className="badge" style={{ color: '#176B35', borderColor: 'rgba(46, 159, 69, 0.3)' }}>
                  {step.badge}
                </span> */}
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Authority & Non-Hallucination Gate */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h3 className="section-title">
            <ShieldCheck size={24} color="var(--primary-green)" />
            Data Source Boundaries & Non-Hallucination Gate
          </h3>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          The agent enforces strict separation between static RAG knowledge and dynamic environmental measurements. If no runtime observation is available to evaluate against retrieved thresholds, the <strong>Evidence Sufficiency Gate</strong> returns <code>INSUFFICIENT_EVIDENCE</code> rather than hallucinating speculative risk levels.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dataBoundaries.map((b, idx) => (
            <div key={idx} style={{ padding: '1.25rem', background: 'var(--very-light-green)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {b.source}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          className="primary-button"
          onClick={() => onNavigate('/analyze')}
          style={{ width: 'auto', display: 'inline-flex', padding: '0.95rem 2.5rem' }}
        >
          Run Microclimate Analysis
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default AgentIntelligencePage;

