import React from 'react';
import { Thermometer, Globe, BookOpen, Bot, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';

/**
 * DashboardPage component for landing & product overview.
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Function (path) to switch route
 */
export function DashboardPage({ onNavigate }) {
  const capabilities = [
    {
      icon: Thermometer,
      iconColor: '#0ea5e9',
      title: 'FortyGuard Thermal',
      badge: 'Hyperlocal API',
      description: '30-mile urban & agricultural thermal surface grids, measuring peak exceedance and heat persistence at parcel scale.'
    },
    {
      icon: Globe,
      iconColor: '#10b981',
      title: 'NASA POWER Climatology',
      badge: 'Satellite Reanalysis',
      description: 'Daily precipitation (PRECTOTCORR) and root-zone soil wetness index (GWETROOT) for deep moisture context.'
    },
    {
      icon: BookOpen,
      iconColor: '#f59e0b',
      title: 'Agronomic RAG Evidence',
      badge: 'Extension Verified',
      description: 'Vector-indexed extension research from UC Davis, TAMU, and USDA for 5 major US crop stress thresholds.'
    },
    {
      icon: Bot,
      iconColor: '#a855f7',
      title: 'Agentic Intelligence',
      badge: 'Autonomous Planning',
      description: 'Goal-driven agent that dynamically sequences geocoding, RAG, thermal, and satellite tools with audit safety.'
    }
  ];

  const crops = [
    {
      name: 'Tomato',
      stage: 'Flowering & Germination',
      threshold: '32°C Daytime / 15°C Soil',
      source: 'UC ANR & UC Davis Extension'
    },
    {
      name: 'Almond',
      stage: 'Irrigation & Deficit Strategy',
      threshold: '-1.4 to -1.8 MPa SWP / 0.20 GWETROOT',
      source: 'UC Davis Water Management'
    },
    {
      name: 'Corn',
      stage: 'Silking & Tassel Heat Stress',
      threshold: '35°C Heat Limit / 0.30 Soil Moisture',
      source: 'USDA Agricultural Research Service'
    },
    {
      name: 'Grape',
      stage: 'Veraison & Bloom Boundary',
      threshold: '35°C Berry Stress / 0.25 Wetness',
      source: 'UC Davis Viticulture Extension'
    },
    {
      name: 'Cotton',
      stage: 'Square Shedding & Boll Fill',
      threshold: '36°C Pollen Limit / 0.35 Wetness',
      source: 'Texas A&M AgriLife Extension'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <div className="hero-banner">
        <div className="hero-header">
          <Sprout size={24} color="#10b981" />
          <h2 className="hero-title">
            Hyperlocal Climate Intelligence for Smarter Farming
          </h2>
        </div>
        <p className="hero-description">
          Agri Microclimate Agent translates natural language agricultural goals into citation-backed microclimate decisions. Fusing FortyGuard hyperlocal thermal forecasting, NASA POWER satellite climatology, and vector RAG extension evidence.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
          <button
            className="primary-button"
            onClick={() => onNavigate('/analyze')}
            style={{ width: 'auto', padding: '0.85rem 1.75rem' }}
          >
            Start New Analysis
            <ArrowRight size={18} />
          </button>
          <button
            className="secondary-button"
            onClick={() => onNavigate('/agent')}
            style={{ padding: '0.85rem 1.25rem' }}
          >
            <Bot size={16} />
            How Agent Works
          </button>
        </div>
      </div>

      {/* Capability Cards Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-header">
          <h3 className="section-title">
            <ShieldCheck size={20} color="#0ea5e9" />
            Core Platform Capabilities
          </h3>
          <span className="badge">Multi-Source Fusion</span>
        </div>

        <div className="metrics-grid">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="card glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.6rem', borderRadius: '10px', background: `${cap.iconColor}15`, display: 'inline-flex' }}>
                    <Icon size={22} color={cap.iconColor} />
                  </div>
                  <span className="badge" style={{ color: cap.iconColor, borderColor: `${cap.iconColor}40` }}>
                    {cap.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  {cap.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Crops Section */}
      <div>
        <div className="section-header">
          <h3 className="section-title">
            <Sprout size={20} color="#10b981" />
            Indexed Crop Knowledge Bases (5 Major Crops)
          </h3>
          <span className="badge">Vector Grounded</span>
        </div>

        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {crops.map((crop, idx) => (
            <div key={idx} className="card" style={{ padding: '1.25rem', background: '#090d16' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem' }}>
                {crop.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                {crop.stage}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>
                {crop.threshold}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.4rem' }}>
                {crop.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
