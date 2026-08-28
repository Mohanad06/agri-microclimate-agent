import React from 'react';
import { Thermometer, Globe, BookOpen, Bot, ArrowRight, ShieldCheck, Sprout, RotateCw } from 'lucide-react';

/**
 * DashboardPage component for landing & product overview.
 * Reverse-Engineered Light-First Agricultural SaaS visual language.
 */
export function DashboardPage({ onNavigate }) {
  const [flippedCardIndex, setFlippedCardIndex] = React.useState(null);

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
      symptom: 'Flower Drop & Reduced Fruit Set',
      strategy: 'Shade cloths & pulse irrigation cooling',
      source: 'UC ANR & UC Davis Extension',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Almond',
      stage: 'Irrigation & Deficit Strategy',
      threshold: '-1.4 to -1.8 MPa SWP / 0.20 GWETROOT',
      symptom: 'Leaf Scorching & Kernel Deficit',
      strategy: 'Regulated Deficit Irrigation (RDI)',
      source: 'UC Davis Water Management',
      image: '/almond.png'
    },
    {
      name: 'Corn',
      stage: 'Silking & Tassel Heat Stress',
      threshold: '35°C Heat Limit / 0.30 Soil Moisture',
      symptom: 'Pollen Desiccation & Poor Kernel Fill',
      strategy: 'Morning overhead misting & soil moisture lock',
      source: 'USDA Agricultural Research Service',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Grape',
      stage: 'Veraison & Bloom Boundary',
      threshold: '35°C Berry Stress / 0.25 Wetness',
      symptom: 'Berry Sunburn & Acidity Degradation',
      strategy: 'Canopy leaf management & kaolin clay cover',
      source: 'UC Davis Viticulture Extension',
      image: '/grape.png'
    },
    {
      name: 'Cotton',
      stage: 'Square Shedding & Boll Fill',
      threshold: '36°C Pollen Limit / 0.35 Wetness',
      symptom: 'Square Abscission & Reduced Fiber Quality',
      strategy: 'Targeted night irrigation & Pix regulator',
      source: 'Texas A&M AgriLife Extension',
      image: '/cotton.png'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Editorial Agricultural Hero Section */}
      <div className="hero-banner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'center' }}>
        <div>
          <div className="hero-header">
            <Sprout size={32} color="var(--primary-green)" />
            <h2 className="hero-title">
              Hyperlocal Climate Intelligence for Smarter Farming
            </h2>
          </div>
          <p className="hero-description">
            Combine parcel-scale thermal surface grids, satellite environmental observations, and grounded agronomic RAG research to protect yields and manage microclimate risk.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <button
              className="primary-button"
              onClick={() => onNavigate('/analyze')}
            >
              Start New Analysis
              <ArrowRight size={18} />
            </button>
            <button
              className="secondary-button"
              onClick={() => onNavigate('/agent')}
              style={{ padding: '0.85rem 1.5rem' }}
            >
              <Bot size={16} color="var(--primary-green)" />
              How Agent Works
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', marginTop: '1.75rem', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', display: 'inline-block', flexShrink: 0 }} />
              FortyGuard API Connected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', display: 'inline-block', flexShrink: 0 }} />
              NASA POWER Live
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', display: 'inline-block', flexShrink: 0 }} />
              5 Crop Knowledge Bases
            </span>
          </div>
        </div>

        {/* Hero Agricultural Image */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '280px', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-color)' }}>
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
            <ShieldCheck size={24} color="var(--primary-green)" />
            Core Platform Capabilities
          </h3>
        </div>

        <div className="metrics-grid">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="card" style={{ padding: '1.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.7rem', borderRadius: '14px', background: 'var(--light-green)', display: 'inline-flex' }}>
                    <Icon size={24} color="var(--primary-green)" />
                  </div>
                </div>
                <h4 style={{ fontSize: '1.075rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                  {cap.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Crops Section with 3D Flip Cards */}
      <div>
        <div className="section-header">
          <h3 className="section-title">
            <Sprout size={24} color="var(--primary-green)" />
            Indexed Crop Knowledge Bases
          </h3>
          {/* <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <RotateCw size={13} />
            Hover to Flip 3D
          </span> */}
        </div>

        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {crops.map((crop, idx) => {
            const isFlipped = flippedCardIndex === idx;
            return (
              <div
                key={idx}
                className={`flip-card-container ${isFlipped ? 'is-flipped' : ''}`}
                onMouseEnter={() => setFlippedCardIndex(idx)}
                onMouseLeave={() => setFlippedCardIndex(null)}
                onClick={() => setFlippedCardIndex(isFlipped ? null : idx)}
              >
                <div className="flip-card-inner">
                  {/* FRONT SIDE — Image Only + Sleek Crop Label Overlay */}
                  <div className="flip-card-front" style={{ position: 'relative' }}>
                    <div className="card-img-wrapper" style={{ height: '100%', width: '100%' }}>
                      <img src={crop.image} alt={crop.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Gradient Overlay for Crop Title & Flip Prompt */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1.25rem 1rem 1rem 1rem',
                        background: 'linear-gradient(to top, rgba(2, 44, 34, 0.95) 0%, rgba(2, 44, 34, 0.5) 60%, transparent 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                        {crop.name}
                      </div>

                      {/* <span
                      className="flip-hint-tag"
                      style={{
                        background: 'rgba(0, 230, 118, 0.2)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(0, 230, 118, 0.4)',
                        color: '#34D399',
                        fontSize: '0.725rem',
                      }}
                    >
                      <RotateCw size={12} />
                      View Details
                    </span> */}
                    </div>
                  </div>

                  {/* BACK SIDE — All Crop Details & Analysis Action */}
                  <div className="flip-card-back">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Sprout size={18} color="var(--primary-green)" />
                          {crop.name}
                        </div>
                        {/* <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--light-green)', color: 'var(--primary-green)', padding: '0.15rem 0.5rem' }}>
                          RAG Verified
                        </span> */}
                      </div>

                      <div>
                        <span style={{ color: 'var(--primary-green)', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Growth Stage</span>
                        <span style={{ color: '#F0FDF4', fontSize: '0.825rem', fontWeight: 600 }}>{crop.stage}</span>
                      </div>

                      <div>
                        <span style={{ color: 'var(--primary-green)', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Critical Threshold</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F0FDF4', fontSize: '0.775rem', background: 'var(--very-light-green)', padding: '0.2rem 0.45rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.15rem' }}>
                          {crop.threshold}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: '#FCA5A5', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stress Risk Impact</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.775rem', lineHeight: 1.4, display: 'block' }}>{crop.symptom}</span>
                      </div>

                      <div>
                        <span style={{ color: '#34D399', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Agronomic Strategy</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.4, display: 'block' }}>{crop.strategy}</span>
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                        Source: {crop.source}
                      </div>
                    </div>

                    {/* <button
                      type="button"
                      className="primary-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('/analyze');
                      }}
                      style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem 0.85rem', marginTop: '0.75rem' }}
                    >
                      Analyze {crop.name} Risk
                      <ArrowRight size={14} />
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
