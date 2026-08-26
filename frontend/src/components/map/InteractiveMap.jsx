import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon asset paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
  const center = hasCoordinates ? [latitude, longitude] : [33.4484, -112.0740]; // Default Phoenix AZ demo pin

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={false}
        className="leaflet-map-instance"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {hasCoordinates && <Marker position={[latitude, longitude]} />}
      </MapContainer>
      <div className="map-helper-text">
        <span>Click anywhere on the map to pin exact field coordinates.</span>
      </div>
    </div>
  );
}

export default InteractiveMap;
