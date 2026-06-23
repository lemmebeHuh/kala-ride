import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { fetchStravaBeacon } from '../services/strava';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const dotIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: var(--accent-primary); width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(252, 82, 0, 0.5);'></div>",
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapUpdater({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [coordinates, map]);
  return null;
}

export default function LiveTracking() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Backward compatibility check
  const oldBeacon = searchParams.get('beacon');
  const sessionId = searchParams.get('id');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const initData = async () => {
      if (oldBeacon) {
        // Fallback for old URL format without Firebase
        setSession({
          beaconId: oldBeacon,
          likes: parseInt(searchParams.get('likes')) || 0,
          perlike: parseInt(searchParams.get('perlike')) || 500,
          title: searchParams.get('title') || "Kala's Live Ride",
          sport: searchParams.get('sport') || 'ride',
          donationUrl: ''
        });
        setLoading(false);
        return;
      }

      if (!sessionId) {
        setLoading(false);
        return; // Will trigger Navigate to setup
      }

      const docRef = doc(db, 'sessions', sessionId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setSession(docSnap.data());
        } else {
          alert('Sesi Live tidak ditemukan atau sudah kadaluarsa.');
        }
        setLoading(false);
      }, (err) => {
        console.error("Gagal memuat data dari Firebase", err);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    const unsub = initData();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [sessionId, oldBeacon]);

  useEffect(() => {
    if (!session?.beaconId) return;
    
    document.title = `${session?.title || "LiveRide"} | LiveRide Tracker`;
    
    const pollData = async () => {
      const data = await fetchStravaBeacon(session.beaconId);
      if (data) {
        if (data.streams && data.streams.latlng) {
          setCoordinates(data.streams.latlng);
        }
        setStats({
          distance: data.stats?.distance,
          moving_time: data.stats?.moving_time,
          elapsed_time: data.stats?.elapsed_time,
          battery_level: data.battery_level,
          status: data.status,
          activity_id: data.activity_id,
          speed: data.stats?.speed || 0
        });
      }
    };

    pollData();
    const interval = setInterval(pollData, 10000);
    return () => clearInterval(interval);
  }, [session?.beaconId, session?.title]);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Header />
        <div style={{ color: 'white', fontSize: '18px' }}>Memuat Sesi Live...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Dashboard 
          stats={stats} 
          likes={session.likes} 
          title={session.title} 
          sportType={session.sport} 
          distancePerLike={session.perlike} 
          donationUrl={session.donationUrl}
        />
        <div className="map-container">
          <MapContainer 
            center={[-6.905977, 107.613144]} 
            zoom={13} 
            style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {coordinates.length > 0 && (
              <>
                <Polyline 
                  positions={coordinates} 
                  color="var(--accent-primary)" 
                  weight={4} 
                  opacity={0.8} 
                />
                <Marker position={coordinates[coordinates.length - 1]} icon={dotIcon}>
                  <Popup>
                    <strong>Lokasi Saat Ini</strong><br/>
                    Kecepatan: {(stats.speed * 3.6).toFixed(1)} km/h
                  </Popup>
                </Marker>
                <MapUpdater coordinates={coordinates} />
              </>
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
