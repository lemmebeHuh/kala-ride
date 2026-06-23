import React, { useState, useEffect } from 'react'
import Map from './components/Map'
import Dashboard from './components/Dashboard'
import { fetchStravaBeacon } from './services/strava'
import LogoSasa from './assets/sasas.png'
import Grainient from './components/Grainient'

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const urlBeacon = searchParams.get('beacon');
  const urlLikes = parseInt(searchParams.get('likes')) || 0;

  const [beaconId, setBeaconId] = useState(urlBeacon || '');
  const [likes, setLikes] = useState(urlLikes);
  const [isTracking, setIsTracking] = useState(!!urlBeacon);
  
  const [inputUrl, setInputUrl] = useState('');
  const [inputLikes, setInputLikes] = useState(urlLikes || '');

  const [coordinates, setCoordinates] = useState([]);
  const [stats, setStats] = useState({});

  const handleStart = (e) => {
    e.preventDefault();
    // Extract ID from URL if user pastes full link (e.g. https://www.strava.com/beacon/Ulm7qtM5dR2)
    let finalId = inputUrl.trim();
    if (finalId.includes('strava.com/beacon/')) {
      finalId = finalId.split('strava.com/beacon/')[1].split('?')[0].split('/')[0];
    }
    
    if (finalId) {
      setBeaconId(finalId);
      setLikes(parseInt(inputLikes) || 0);
      setIsTracking(true);
      // Update URL without reloading
      window.history.pushState({}, '', `?beacon=${finalId}&likes=${parseInt(inputLikes) || 0}`);
    }
  };

  useEffect(() => {
    if (!isTracking || !beaconId) return;

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
          status: data.status
        });
      }
    };

    pollData();
    const interval = setInterval(pollData, 5000);
    return () => clearInterval(interval);
  }, [isTracking, beaconId]);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <Grainient
          color1="#fc5200"
          color2="#161618"
          color3="#0a0a0b"
          timeSpeed={0.2}
          colorBalance={0.1}
          warpStrength={1.5}
          warpFrequency={3.0}
          warpSpeed={1.5}
          warpAmplitude={30.0}
          blendAngle={45.0}
          blendSoftness={0.1}
          rotationAmount={300.0}
          noiseScale={1.5}
          grainAmount={0.08}
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.2}
          gamma={1.0}
          saturation={1.2}
          zoom={1.0}
        />
      </div>

      {!isTracking ? (
        <div className="setup-container">
          <div className="setup-card">
            <img src={LogoSasa} alt="Logo" className="setup-logo" />
            <h2>LiveRide Setup</h2>
            <p>Masukkan link Strava Beacon Anda untuk memulai tracking.</p>
            
            <form onSubmit={handleStart} className="setup-form">
              <div className="form-group">
                <label>Strava Beacon Link / ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="https://www.strava.com/beacon/..." 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Total Likes Awal (Opsional)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Contoh: 150" 
                  value={inputLikes}
                  onChange={(e) => setInputLikes(e.target.value)}
                />
              </div>
              <button type="submit" className="start-btn">Start Live Tracking</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="app-container">
          <header className="app-header">
            <img src={LogoSasa} alt="Logo Sasa" className="header-logo" />
          </header>
          <main className="main-content">
            <Map coordinates={coordinates} />
            <Dashboard stats={stats} likes={likes} setLikes={setLikes} />
          </main>
        </div>
      )}
    </>
  )
}

export default App
