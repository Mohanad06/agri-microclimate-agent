import React, { useState } from 'react';
import { Cpu, MapPin, Layers, Activity, BookOpen, ArrowRight } from 'lucide-react';
import CropSelect from './CropSelect.jsx';
import MapPinSelector from './MapPinSelector.jsx';
import ErrorAlert from '../common/ErrorAlert.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * Main AnalysisForm component.
 *
 * @param {Object} props
 * @param {Object} props.formData - { location, latitude, longitude, crop, crop_stage, question }
 * @param {Function} props.onChange - Handler (field, value)
 * @param {Function} props.onSubmit - Form submit handler
 * @param {string[]} [props.crops=[]] - Dynamic crops list
 * @param {boolean} [props.loading=false]
 * @param {Object|null} [props.error=null]
 * @param {string|null} [props.demoNotice=null]
 */
export function AnalysisForm({
  formData,
  onChange,
  onSubmit,
  crops = [],
  loading = false,
  error = null,
  demoNotice = null
}) {
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="card glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Cpu size={18} color="#0ea5e9" />
          Ask Field Goal
        </h3>
        <span className="badge">Phase 4.4</span>
      </div>

      {error && <ErrorAlert error={error} />}

      {demoNotice && (
        <div className="demo-notice-banner" role="status" aria-live="polite">
          <span>{demoNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Location Text Input */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} color="#94a3b8" />
            Location Name / Farm Label
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Phoenix, AZ or Custom Field 4"
            value={formData.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Map & Coordinates Pin Selector */}
        <div className="form-group">
          <label className="form-label">Optional Exact Field Coordinates</label>
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

        {/* Target Crop Select */}
        <div className="form-group">
          <label className="form-label">
            <Layers size={14} color="#94a3b8" />
            Target Crop
          </label>
          <CropSelect
            value={formData.crop || ''}
            crops={crops}
            onChange={(val) => onChange('crop', val)}
            disabled={loading}
          />
        </div>

        {/* Crop Growth Stage Select */}
        <div className="form-group">
          <label className="form-label">
            <Activity size={14} color="#94a3b8" />
            Growth Stage (Optional)
          </label>
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
          </select>
        </div>

        {/* Natural Language Question */}
        <div className="form-group">
          <label className="form-label">
            <BookOpen size={14} color="#94a3b8" />
            Agricultural Question / Goal
          </label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Assess heat risk for tomatoes during flowering."
            value={formData.question || ''}
            onChange={(e) => onChange('question', e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <LoadingSpinner size={16} label="Processing Analysis..." />
          ) : (
            <>
              Analyze Microclimate Risk
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AnalysisForm;
