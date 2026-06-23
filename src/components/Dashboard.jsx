import React from 'react';
import { Activity, Battery, Clock, Map as MapIcon, Heart, CheckCircle, Bike, Mountain, Footprints, Coffee, Share2 } from 'lucide-react';
import ProfileImg from '../assets/ajipro50.png';

export default function Dashboard({ stats, likes, title, sportType, distancePerLike, donationUrl }) {
  // Convert meters to km
  const distanceKm = stats.distance ? (stats.distance / 1000).toFixed(2) : "0.00";
  
  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const movingTime = formatTime(stats.moving_time);
  
  // Challenge Math: Dynamic per like
  const targetDistanceMeters = (likes || 0) * (distancePerLike || 500);
  const targetDistanceKm = (targetDistanceMeters / 1000).toFixed(2);
  
  const currentDistance = stats.distance || 0;
  let progressPercentage = targetDistanceMeters > 0 
    ? (currentDistance / targetDistanceMeters) * 100 
    : 0;
    
  if (progressPercentage > 100) progressPercentage = 100;

  // Calculate Average Speed (km/h)
  let avgSpeed = "0.0";
  if (stats.distance > 0 && stats.moving_time > 0) {
    const hours = stats.moving_time / 3600;
    avgSpeed = ((stats.distance / 1000) / hours).toFixed(1);
  }

  const isCompleted = progressPercentage === 100 && targetDistanceMeters > 0;

  const handleShare = () => {
    const url = window.location.href;
    const shareData = {
      title: `${title} - LiveRide Tracker`,
      text: `Pantau progress live saya di LiveRide! Target: ${likes} Likes = ${(likes * distancePerLike / 1000).toFixed(1)} km.`,
      url: url
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url);
      alert('Link disalin ke clipboard!');
    }
  };

  return (
    <div className="sidebar">
      <div className="profile-card">
        <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={ProfileImg} alt="Kala" className="avatar" style={{ objectFit: 'cover' }} />
            <div className="profile-info">
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {sportType === 'run' ? <Footprints size={24} color="var(--text-primary)" /> : 
                 sportType === 'trail' ? <Mountain size={24} color="var(--text-primary)" /> : 
                 sportType === 'walk' ? <Footprints size={24} color="var(--text-primary)" /> : 
                 <Bike size={24} color="var(--text-primary)" />}
                {title || "Kala's Live Ride"}
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div className="live-badge" style={stats.status !== 1 ? { background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" } : {}}>
                  {stats.status === 1 && <div className="live-dot"></div>}
                  {stats.status === 1 ? "LIVE TRACKING" : "STOPPED / FINISHED"}
                </div>
                {stats.status !== 1 && stats.activity_id && (
                  <a href={`https://www.strava.com/activities/${stats.activity_id}`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                    Lihat Detail Aktivitas ↗
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleShare} 
            title="Share Live Link"
            style={{ 
              background: 'var(--bg-primary)', 
              border: '1px solid var(--bg-tertiary)', 
              padding: '10px', 
              borderRadius: '50%', 
              color: 'white', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="challenge-card" style={isCompleted ? { borderColor: "var(--success)" } : {}}>
        <div className="challenge-header">
          <div>
            <div className="challenge-title">Challenge Progress</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              1 Like = {distancePerLike || 500} meters
            </div>
          </div>
          <div className="challenge-target" style={isCompleted ? { color: "var(--success)" } : {}}>
            {distanceKm} / {targetDistanceKm} <span style={{fontSize: "16px"}}>km</span>
          </div>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${progressPercentage}%`,
              background: isCompleted ? "var(--success)" : "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))"
            }}
          ></div>
        </div>

        {isCompleted && (
          <div className="completion-banner">
            <CheckCircle size={20} color="var(--success)" />
            <div className="completion-text">
              <div className="completion-title">CHALLENGE COMPLETE</div>
              <div className="completion-desc">Target distance achieved.</div>
            </div>
          </div>
        )}
        
        <div className="likes-input" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <Heart size={20} color="var(--danger)" fill="var(--danger)" />
          <span style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>{likes}</span>
          <span style={{ color: 'var(--text-secondary)' }}>Likes Terkumpul</span>
        </div>
      </div>

      {donationUrl && (
        <a 
          href={donationUrl} 
          target="_blank" 
          rel="noreferrer" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            background: 'var(--accent-primary)', 
            color: 'white', 
            textDecoration: 'none', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            fontWeight: '600', 
            margin: '0 0 16px 0',
            boxShadow: '0 4px 15px rgba(252, 82, 0, 0.4)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Coffee size={20} />
          Support Rider
        </a>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <MapIcon size={16} /> Distance
          </div>
          <div className="stat-value">
            {distanceKm}<span className="stat-unit">km</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <Clock size={16} /> Moving Time
          </div>
          <div className="stat-value">
            {movingTime}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Activity size={16} /> Avg Speed
          </div>
          <div className="stat-value">
            {avgSpeed}<span className="stat-unit">km/h</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Battery size={16} /> Battery
          </div>
          <div className="stat-value">
            {stats.battery_level !== undefined ? stats.battery_level : "--"}<span className="stat-unit">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
