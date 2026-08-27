import React, { useState } from 'react';
import { Cpu, MapPin, Layers, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import CropSelect from '../components/form/CropSelect.jsx';
import MapPinSelector from '../components/form/MapPinSelector.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * AnalyzePage component for collecting field location, crop, and goal.
 * Restyled for Light-First Commercial AgriTech Decision Console.
 */
export function AnalyzePage({
  formData,
  onChange,
  onSubmit,
  crops = [],
  loading = false,
  error = null,
}) {
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="analyze-page" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div className="section-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <h2 className="hero-title" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-primary)' }}>
              <Cpu size={26} color="var(--primary-green)" />
              New Agricultural Microclimate Risk Analysis
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
              Step-by-step decision console. The AI Agent will automatically sequence FortyGuard, NASA POWER, and RAG tools.
            </p>
          </div>
          {/* <span className="badge">Agent Decision Console</span> */}
        </div>

        {error && <ErrorAlert error={error} />}

        <form onSubmit={handleSubmit}>
          {/* STEP 01 — FIELD LOCATION & MAP */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--very-light-green)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span className="badge" style={{ background: 'var(--primary-green)', color: '#FFFFFF', fontWeight: 800 }}>STEP 01</span>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MapPin size={18} color="var(--primary-green)" />
                FIELD LOCATION & COORDINATES
              </h4>
            </div>

            <div className="form-group">
              <label className="form-label">Location Name / Farm Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Phoenix, AZ or Fresno Field 4"
                value={formData.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Optional Field Pin Coordinates</label>
              <MapPinSelector
                latitude={formData.latitude ?? null}
                longitude={formData.longitude ?? null}
                onLocationSelect={({ latitude, longitude }) => {
                  onChange('latitude', latitude);
                  onChange('longitude', longitude);
                }}
                showMap={showMap}
                onToggleMap={() => setShowMap(!showMap)}
              />
            </div>
          </div>

          {/* STEP 02 — CROP & GROWTH STAGE */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--very-light-green)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span className="badge" style={{ background: 'var(--primary-green)', color: '#FFFFFF', fontWeight: 800 }}>STEP 02</span>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={18} color="var(--primary-green)" />
                CROP & GROWTH STAGE
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Target Crop</label>
                <CropSelect
                  value={formData.crop || ''}
                  crops={crops}
                  onChange={(val) => onChange('crop', val)}
                  disabled={loading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Growth Stage (Optional)</label>
                <select
                  className="form-select"
                  value={formData.crop_stage || ''}
                  onChange={(e) => onChange('crop_stage', e.target.value)}
                  disabled={loading}
                >
                  <option value="">(None / General)</option>
                  <option value="flowering">flowering</option>
                  <option value="planting">planting</option>
                  <option value="irrigation">irrigation</option>
                  <option value="silking">silking</option>
                  <option value="veraison">veraison</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 03 — AGRICULTURAL GOAL / QUESTION */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--very-light-green)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span className="badge" style={{ background: '#D97706', color: '#FFFFFF', fontWeight: 800 }}>STEP 03</span>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <BookOpen size={18} color="#D97706" />
                AGRICULTURAL GOAL / QUESTION
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <textarea
                className="form-textarea"
                placeholder="e.g. Assess heat risk for tomatoes during flowering."
                value={formData.question || ''}
                onChange={(e) => onChange('question', e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* STEP 04 — EXECUTE ANALYSIS */}
          <button className="primary-button" type="submit" disabled={loading} style={{ fontSize: '1.05rem', padding: '1.15rem', width: '100%', marginTop: '1rem' }}>
            {loading ? (
              <LoadingSpinner size={20} label="Agent Orchestrator Executing Tools..." />
            ) : (
              <>
                Analyze Microclimate Risk
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnalyzePage;

