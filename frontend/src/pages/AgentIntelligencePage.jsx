import React from 'react';
import { Bot, Cpu, Layers, ShieldCheck, Database, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * AgentIntelligencePage component illustrating agent architecture and safety gates.
 *
 * @param {Object} props
 * @param {Function} props.onNavigate
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
      role: 'Runtime Primary Thermal Authority',
      description: 'Supplies parcel-scale surface heatmaps, peak exceedances, and temperature persistence statistics.'
    },
    {
      source: 'NASA POWER Satellite Service',
      role: 'Environmental Climatology Context',
      description: 'Provides daily precipitation (PRECTOTCORR) and root-zone soil wetness index (GWETROOT).'
    },
    {
      source: 'Agronomic RAG Knowledge Base',
      role: 'Grounded Extension Reference',
      description: 'Vector embeddings of extension publications from UC Davis, TAMU, and USDA for crop temperature stress limits.'
    }
  ];

  return (
    <div className="agent-page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div className="card glass-card" style={{ marginBottom: '2rem' }}>
        <div className="section-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 className="hero-title" style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot size={24} color="#a855f7" />
              Autonomous Agentic Orchestration Architecture
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              How the Agri Microclimate Agent converts natural language goals into explainable, citation-backed agricultural decisions.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            System Architecture
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="card" style={{ background: '#090d16', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#a855f7', color: '#ffffff', fontWeight: 800 }}>
                  {step.num}
                </span>
                <span className="badge" style={{ color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                  {step.badge}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Authority & Non-Hallucination Gate */}
      <div className="card glass-card" style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <h3 className="section-title">
            <ShieldCheck size={20} color="#10b981" />
            Data Source Boundaries & Non-Hallucination Gate
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          The agent enforces strict separation between static RAG knowledge and dynamic environmental measurements. If no runtime observation is available to evaluate against retrieved thresholds, the <strong>Evidence Sufficiency Gate</strong> returns <code>INSUFFICIENT_EVIDENCE</code> rather than hallucinating speculative risk levels.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {dataBoundaries.map((b, idx) => (
            <div key={idx} style={{ padding: '1rem', background: '#090d16', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#f8fafc' }}>
                  {b.source}
                </span>
                <span className="badge" style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  {b.role}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="primary-button"
          onClick={() => onNavigate('/analyze')}
          style={{ width: 'auto', display: 'inline-flex', padding: '0.85rem 2rem' }}
        >
          Run Microclimate Analysis
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default AgentIntelligencePage;
