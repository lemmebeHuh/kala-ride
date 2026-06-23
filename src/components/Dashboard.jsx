import React from 'react';
import { Activity, Battery, Clock, Map as MapIcon, Heart, CheckCircle } from 'lucide-react';
import ProfileImg from '../assets/ajipro50.png';

export default function Dashboard({ stats, likes, setLikes }) {
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
  
  // Challenge Math: 1 Like = 500 meters (0.5 km)
  const targetDistanceMeters = (likes || 0) * 500;
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

  return (
    <div className="sidebar">
      <div className="profile-card">
        <div className="profile-header">
          <img src={ProfileImg} alt="Kala" className="avatar" style={{ objectFit: 'cover' }} />
          <div className="profile-info">
            <h1>Kala's Live Ride</h1>
            <div className="live-badge" style={stats.status !== 1 ? { background: "rgba(16, 185, 129, 0.1)", color: "var(--success)" } : {}}>
              {stats.status === 1 && <div className="live-dot"></div>}
              {stats.status === 1 ? "LIVE TRACKING" : "STOPPED / FINISHED"}
            </div>
          </div>
        </div>
      </div>

      <div className="challenge-card" style={isCompleted ? { borderColor: "var(--success)" } : {}}>
        <div className="challenge-header">
          <div>
            <div className="challenge-title">Challenge Progress</div>
            <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              1 Like = 500 meters
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
        
        <div className="likes-input">
          <Heart size={20} color="var(--danger)" fill="var(--danger)" />
          <input 
            type="number" 
            min="0" 
            value={likes} 
            onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
            placeholder="Enter total likes..."
          />
          <span>Likes</span>
        </div>
      </div>

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
