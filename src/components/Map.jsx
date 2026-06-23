import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pulsing marker icon
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div class="pulse-marker"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function Map({ coordinates }) {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // When coordinates update, pan the map to the latest coordinate
    if (coordinates && coordinates.length > 0 && mapRef.current) {
      const latestCoord = coordinates[coordinates.length - 1];
      const map = mapRef.current;
      // Fly to the latest location without changing zoom if already zoomed
      map.flyTo(latestCoord, map.getZoom() || 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [coordinates]);

  if (!coordinates || coordinates.length === 0) {
    return (
      <div className="map-container">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Waiting for GPS signal...</p>
        </div>
      </div>
    );
  }

  const latestCoord = coordinates[coordinates.length - 1];

  return (
    <div className="map-container">
      <MapContainer 
        center={latestCoord} 
        zoom={15} 
        ref={mapRef}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw the route path */}
        <Polyline 
          positions={coordinates} 
          pathOptions={{ color: '#fc5200', weight: 4, opacity: 0.8 }} 
        />
        
        {/* Current position marker */}
        <Marker position={latestCoord} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
