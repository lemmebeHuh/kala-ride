import React, { useState, useEffect } from 'react'
import { Menu, X, Home, Activity, Map as MapIconMenu } from 'lucide-react'
import Map from './components/Map'
import Dashboard from './components/Dashboard'
import { fetchStravaBeacon } from './services/strava'
import LogoSasa from './assets/sasas.png'
import Grainient from './components/Grainient'

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const urlBeacon = searchParams.get('beacon');
  const urlLikes = parseInt(searchParams.get('likes')) || 0;
  const urlTitle = searchParams.get('title') || "Kala's Live Ride";
  const urlSport = searchParams.get('sport') || 'ride';
  const urlDistancePerLike = parseInt(searchParams.get('perlike')) || 500;

  const [beaconId, setBeaconId] = useState(urlBeacon || '');
  const [likes, setLikes] = useState(urlLikes);
  const [title, setTitle] = useState(urlTitle);
  const [sportType, setSportType] = useState(urlSport);
  const [distancePerLike, setDistancePerLike] = useState(urlDistancePerLike);
  const [isTracking, setIsTracking] = useState(!!urlBeacon);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [inputUrl, setInputUrl] = useState('');
  const [inputLikes, setInputLikes] = useState(urlLikes || '');
  const [inputTitle, setInputTitle] = useState(urlTitle);
  const [inputSport, setInputSport] = useState(urlSport);
  const [inputDistancePerLike, setInputDistancePerLike] = useState(urlDistancePerLike);

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
      setTitle(inputTitle || "Kala's Live Ride");
      setSportType(inputSport);
      setDistancePerLike(parseInt(inputDistancePerLike) || 500);
      setIsTracking(true);
      // Update URL without reloading
      const titleEncoded = encodeURIComponent(inputTitle || "Kala's Live Ride");
      window.history.pushState({}, '', `?beacon=${finalId}&likes=${parseInt(inputLikes) || 0}&title=${titleEncoded}&sport=${inputSport}&perlike=${parseInt(inputDistancePerLike) || 500}`);
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
          status: data.status,
          activity_id: data.activity_id
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

      <div className="app-container">
        <header className="app-header">
          <button className="burger-btn" onClick={() => setIsMenuOpen(true)}>
            <Menu color="white" />
          </button>
          <img src={LogoSasa} alt="Logo Sasa" className="header-logo" />
          <div style={{ width: 24 }}></div>
        </header>
        
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
            <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
              <div className="menu-header">
                <img src={LogoSasa} alt="Logo" className="menu-logo" />
                <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
                  <X color="white" />
                </button>
              </div>
              <nav className="menu-nav">
                <a href="/" className="menu-link"><Home size={20} /> Home</a>
                {beaconId && (
                  <a href={`https://www.strava.com/beacon/${beaconId}`} target="_blank" className="menu-link" rel="noreferrer"><Activity size={20} /> Open in Strava</a>
                )}
                <button className="menu-link menu-btn" onClick={() => { setIsMenuOpen(false); setIsTracking(false); }}><MapIconMenu size={20} /> Setup Baru</button>
              </nav>
            </div>
          </div>
        )}

        <main className="main-content">
          {!isTracking ? (
            <div className="setup-container">
              <div className="setup-card">
                <h2>LiveRide Setup</h2>
                <p>Masukkan link Strava Beacon Anda untuk memulai tracking.</p>
                
                <form onSubmit={handleStart} className="setup-form">
                  <div className="form-group">
                    <label>Strava Beacon Link / ID</label>
                    <input 
                      type="text" 
                      className="form-control"
                      required
                      placeholder="https://www.strava.com/beacon/..." 
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                <label>Judul Aktivitas</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Kala's Live Ride" 
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Jenis Olahraga</label>
                  <select 
                    value={inputSport}
                    onChange={(e) => setInputSport(e.target.value)}
                    className="form-control"
                  >
                    <option value="ride">Sepeda</option>
                    <option value="run">Lari</option>
                    <option value="trail">Trail/Hike</option>
                    <option value="walk">Jalan</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Meters / Like</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-control"
                    placeholder="500" 
                    value={inputDistancePerLike}
                    onChange={(e) => setInputDistancePerLike(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Total Likes Awal</label>
                <input 
                  type="number" 
                  className="form-control"
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
            <>
              <Map coordinates={coordinates} />
              <Dashboard 
                stats={stats} 
                likes={likes} 
                title={title}
                sportType={sportType}
                distancePerLike={distancePerLike}
              />
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default App
