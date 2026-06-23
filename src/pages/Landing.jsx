import React, { useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';

const copyOptions = [
  {
    title1: "Elevate",
    title2: "Your Ride",
    subtitle: "Track every meter, share every moment in real-time.",
    color: "#fc5200", // Strava Orange
    font: "'Playfair Display', serif"
  },
  {
    title1: "Beyond",
    title2: "Limits",
    subtitle: "Transform your journey into an interactive experience.",
    color: "#10b981", // Emerald
    font: "'Playfair Display', serif"
  },
  {
    title1: "Pedal",
    title2: "With Purpose",
    subtitle: "Connect your Beacon and let supporters drive you.",
    color: "#8b5cf6", // Purple
    font: "'Playfair Display', serif"
  }
];

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect to live if beacon is in URL
  if (searchParams.get('beacon')) {
    return <Navigate to={`/live?${searchParams.toString()}`} replace />;
  }

  const handleMouseMove = (e) => {
    const width = window.innerWidth;
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });

    // Desktop only tracking for active index
    if (width > 768) {
      if (x < width / 3) setActiveIndex(0);
      else if (x < (2 * width) / 3) setActiveIndex(1);
      else setActiveIndex(2);
    }
  };

  // For mobile, cycle options automatically every 3 seconds
  React.useEffect(() => {
    if (window.innerWidth <= 768) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % copyOptions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="landing-page" onMouseMove={handleMouseMove}>
      <div className="hero-fullscreen">
        <Header absolute={true} />

        <div className="hero-corner bottom-left">Powered by Strava API</div>
        <div className="hero-corner bottom-right">Interactive Beacon Tracker</div>

        <div className="hero-center">
          <h1 className="hero-title">
            <span style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontStyle: "italic", 
              fontWeight: 400,
              color: copyOptions[activeIndex].color,
              transition: 'color 0.5s ease',
              display: 'block'
            }}>
              {copyOptions[activeIndex].title1}
            </span>
            <span style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              display: 'block'
            }}>
              {copyOptions[activeIndex].title2}
            </span>
          </h1>
          <p className="hero-subtitle" style={{ transition: 'opacity 0.3s' }}>
            {copyOptions[activeIndex].subtitle}
          </p>
          <button className="hero-cta" onClick={() => navigate('/setup')}>
            Launch App &#8594;
          </button>
        </div>

        {/* Cursor Reactive Background Glow */}
        <div 
          className="cursor-glow" 
          style={{ 
            background: copyOptions[activeIndex].color,
            left: mousePos.x,
            top: mousePos.y
          }} 
        />
      </div>
    </div>
  );
}
