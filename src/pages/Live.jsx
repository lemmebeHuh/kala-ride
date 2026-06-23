import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Map from '../components/Map';
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import { fetchStravaBeacon } from '../services/strava';

export default function Live() {
  const [searchParams] = useSearchParams();
  const beaconId = searchParams.get('beacon');
  
  if (!beaconId) {
    return <Navigate to="/setup" replace />;
  }

  const likes = parseInt(searchParams.get('likes')) || 0;
  const title = searchParams.get('title') || "Kala's Live Ride";
  const sportType = searchParams.get('sport') || 'ride';
  const distancePerLike = parseInt(searchParams.get('perlike')) || 500;

  const [coordinates, setCoordinates] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    document.title = `${title} | LiveRide Tracker`;
    
    const pollData = async () => {
      const data = await fetchStravaBeacon(beaconId);
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
          activity_id: data.activity_id
        });
      }
    };

    pollData();
    const interval = setInterval(pollData, 5000);
    return () => clearInterval(interval);
  }, [beaconId]);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Map coordinates={coordinates} />
        <Dashboard 
          stats={stats} 
          likes={likes} 
          title={title}
          sportType={sportType}
          distancePerLike={distancePerLike}
        />
      </main>
    </div>
  );
}
