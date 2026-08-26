import React from 'react';
import { Map, MapPin, X } from 'lucide-react';
import InteractiveMap from '../map/InteractiveMap.jsx';

/**
 * MapPinSelector component for field location coordinate selection.
 *
 * @param {Object} props
 * @param {number|null} props.latitude
 * @param {number|null} props.longitude
 * @param {Function} props.onLocationSelect
 * @param {boolean} props.showMap
 * @param {Function} props.onToggleMap
 */
export function MapPinSelector({ latitude, longitude, onLocationSelect, showMap, onToggleMap }) {
  return (
    <div className="map-pin-selector-container">
      <div className="coord-inputs-row">
        <div className="coord-field">
          <label className="form-label-sm">Latitude</label>
          <input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            className="form-input-sm"
            placeholder="e.g. 33.4484"
            value={latitude !== null && latitude !== undefined ? latitude : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              onLocationSelect({ latitude: val, longitude });
            }}
          />
        </div>

        <div className="coord-field">
          <label className="form-label-sm">Longitude</label>
          <input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            className="form-input-sm"
            placeholder="e.g. -112.0740"
            value={longitude !== null && longitude !== undefined ? longitude : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : parseFloat(e.target.value);
              onLocationSelect({ latitude, longitude: val });
            }}
          />
        </div>

        <button
          type="button"
          className="secondary-button toggle-map-btn"
          onClick={onToggleMap}
        >
          {showMap ? <X size={14} /> : <Map size={14} />}
          {showMap ? 'Hide Map' : 'Pin on Map'}
        </button>
      </div>

      {showMap && (
        <div className="map-embed-card">
          <InteractiveMap
            latitude={latitude}
            longitude={longitude}
            onLocationSelect={onLocationSelect}
          />
        </div>
      )}
    </div>
  );
}

export default MapPinSelector;
