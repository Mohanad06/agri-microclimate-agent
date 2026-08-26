import React, { useState } from 'react';
import { Cpu, MapPin, Layers, Activity, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import CropSelect from '../components/form/CropSelect.jsx';
import MapPinSelector from '../components/form/MapPinSelector.jsx';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

/**
 * AnalyzePage component for collecting user field location, crop, and goal.
 *
 * @param {Object} props
 * @param {Object} props.formData
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 * @param {Array} props.crops
 * @param {boolean} props.loading
 * @param {Object|null} props.error
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
    <div className="analyze-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card glass-card">
        <div className="section-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="hero-title" style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Cpu size={22} color="#0ea5e9" />
              New Agricultural Microclimate Risk Analysis
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Step-by-step decision console. The AI Agent will automatically select FortyGuard, NASA POWER, or RAG tools.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', borderColor: 'rgba(14, 165, 233, 0.3)' }}>
            Agent Console
          </span>
        </div>

        {error && <ErrorAlert error={error} />}

        <form onSubmit={handleSubmit}>
          {/* STEP 01 — FIELD LOCATION & MAP */}
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: '#090d16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge" style={{ background: '#0ea5e9', color: '#ffffff', fontWeight: 800 }}>STEP 01</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} color="#0ea5e9" />
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
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: '#090d16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge" style={{ background: '#10b981', color: '#ffffff', fontWeight: 800 }}>STEP 02</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="#10b981" />
                CROP & GROWTH STAGE
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: '#090d16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 800 }}>STEP 03</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={16} color="#f59e0b" />
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
          <div style={{ padding: '1.25rem', background: 'radial-gradient(circle at 0% 0%, rgba(14, 165, 233, 0.1) 0%, transparent 70%), #090d16', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
            <button className="primary-button" type="submit" disabled={loading} style={{ fontSize: '1rem', padding: '1rem' }}>
              {loading ? (
                <LoadingSpinner size={18} label="Agent Orchestrator Executing Tools..." />
              ) : (
                <>
                  Analyze Microclimate Risk
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>The agent will automatically sequence Geocoding, RAG, FortyGuard, and NASA POWER tools.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnalyzePage;
