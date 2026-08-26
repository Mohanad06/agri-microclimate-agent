import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon asset paths for Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Ensures Leaflet recalculates tile dimensions when toggled open.
 */
function MapResizeAndRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(center, map.getZoom());
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [center, map]);
  return null;
}

/**
 * Click handler sub-component for Leaflet map events.
 */
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        const lat = parseFloat(e.latlng.lat.toFixed(4));
        const lng = parseFloat(e.latlng.lng.toFixed(4));
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    },
  });
  return null;
}

/**
 * InteractiveMap component rendering Leaflet + OpenStreetMap tiles.
 *
 * @param {Object} props
 * @param {number|null} props.latitude
 * @param {number|null} props.longitude
 * @param {Function} props.onLocationSelect
 */
export function InteractiveMap({ latitude, longitude, onLocationSelect }) {
  const hasCoordinates = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);
  const center = hasCoordinates ? [latitude, longitude] : [33.4484, -112.0740]; // Default Phoenix AZ

  return (
    <div className="map-container-wrapper" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <div className="map-helper-text" style={{ padding: '0.65rem 0.85rem', background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
        📍 Click anywhere on the map to pin exact field coordinates.
      </div>

      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: '280px', width: '100%', borderRadius: '0 0 12px 12px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeAndRecenter center={center} />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {hasCoordinates && <Marker position={[latitude, longitude]} />}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
