import React from 'react';
import { Thermometer, Globe, BookOpen, Bot, ArrowRight, ShieldCheck, Sprout, CheckCircle2 } from 'lucide-react';

/**
 * DashboardPage component for landing & product overview.
 * Reverse-Engineered Light-First Agricultural SaaS visual language.
 */
export function DashboardPage({ onNavigate }) {
  const capabilities = [
    {
      icon: Thermometer,
      iconColor: '#2E9F45',
      title: 'FortyGuard Thermal',
      badge: 'Hyperlocal API',
      description: '30-mile urban & agricultural thermal surface grids, measuring peak exceedance and heat persistence at parcel scale.'
    },
    {
      icon: Globe,
      iconColor: '#176B35',
      title: 'NASA POWER Climatology',
      badge: 'Satellite Reanalysis',
      description: 'Daily precipitation (PRECTOTCORR) and root-zone soil wetness index (GWETROOT) for deep moisture context.'
    },
    {
      icon: BookOpen,
      iconColor: '#D97706',
      title: 'Agronomic RAG Evidence',
      badge: 'Extension Verified',
      description: 'Vector-indexed extension research from UC Davis, TAMU, and USDA for 5 major US crop stress thresholds.'
    },
    {
      icon: Bot,
      iconColor: '#2563EB',
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
      source: 'UC ANR & UC Davis Extension',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Almond',
      stage: 'Irrigation & Deficit Strategy',
      threshold: '-1.4 to -1.8 MPa SWP / 0.20 GWETROOT',
      source: 'UC Davis Water Management',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Corn',
      stage: 'Silking & Tassel Heat Stress',
      threshold: '35°C Heat Limit / 0.30 Soil Moisture',
      source: 'USDA Agricultural Research Service',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Grape',
      stage: 'Veraison & Bloom Boundary',
      threshold: '35°C Berry Stress / 0.25 Wetness',
      source: 'UC Davis Viticulture Extension',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cotton',
      stage: 'Square Shedding & Boll Fill',
      threshold: '36°C Pollen Limit / 0.35 Wetness',
      source: 'Texas A&M AgriLife Extension',
      image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Editorial Agricultural Hero Section */}
      <div className="hero-banner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'center' }}>
        <div>
          <div className="hero-header">
            <Sprout size={32} color="#2E9F45" />
            <h2 className="hero-title">
              Hyperlocal Climate Intelligence for Smarter Farming
            </h2>
          </div>
          <p className="hero-description">
            Combine parcel-scale thermal surface grids, satellite environmental observations, and grounded agronomic RAG research to protect yields and manage microclimate risk.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              className="primary-button"
              onClick={() => onNavigate('/analyze')}
              style={{ width: 'auto', padding: '0.9rem 1.85rem' }}
            >
              Start New Analysis
              <ArrowRight size={18} />
            </button>
            <button
              className="secondary-button"
              onClick={() => onNavigate('/agent')}
              style={{ padding: '0.85rem 1.5rem' }}
            >
              <Bot size={16} color="#2E9F45" />
              How Agent Works
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', marginTop: '1.75rem', fontSize: '0.825rem', color: '#617064', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#2E9F45" />
              FortyGuard API Connected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#2E9F45" />
              NASA POWER Live
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#2E9F45" />
              5 Crop Knowledge Bases
            </span>
          </div>
        </div>

        {/* Hero Agricultural Image */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '280px', boxShadow: '0 12px 32px rgba(23, 107, 53, 0.12)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
            alt="Agricultural Crop Landscape"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Capability Cards Section */}
      <div style={{ marginBottom: '2.75rem' }}>
        <div className="section-header">
          <h3 className="section-title">
            <ShieldCheck size={24} color="#2E9F45" />
            Core Platform Capabilities
          </h3>
          <span className="badge">Multi-Source Data Fusion</span>
        </div>

        <div className="metrics-grid">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="card" style={{ padding: '1.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.7rem', borderRadius: '14px', background: 'var(--light-green)', display: 'inline-flex' }}>
                    <Icon size={24} color={cap.iconColor} />
                  </div>
                  <span className="badge" style={{ color: cap.iconColor, borderColor: `${cap.iconColor}35` }}>
                    {cap.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.075rem', fontWeight: 800, color: '#17301F', marginBottom: '0.45rem' }}>
                  {cap.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#617064', lineHeight: 1.6, margin: 0 }}>
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Crops Section with Crop Photography */}
      <div>
        <div className="section-header">
          <h3 className="section-title">
            <Sprout size={24} color="#2E9F45" />
            Indexed Crop Knowledge Bases (5 Major Crops)
          </h3>
          <span className="badge">Extension Vector RAG</span>
        </div>

        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {crops.map((crop, idx) => (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-img-wrapper" style={{ height: '135px' }}>
                <img
                  src={crop.image}
                  alt={crop.name}
                />
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {crop.name}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--primary-green)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {crop.stage}
                </div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.65rem', background: '#F4FAF4', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #E2E8E2' }}>
                  {crop.threshold}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-color)', paddingTop: '0.55rem' }}>
                  {crop.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

