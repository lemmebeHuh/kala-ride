import React, { useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import BlurText from '../components/BlurText';

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
  };

  // Auto-cycle options every 3 seconds for all devices
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % copyOptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page" onMouseMove={handleMouseMove}>
      <div className="hero-fullscreen">
        <Header absolute={true} />

        <div className="hero-corner bottom-left">Powered by Strava API</div>
        <div className="hero-corner bottom-right">Interactive Beacon Tracker</div>

        <div className="hero-center">
          <div className="hero-title">
            <BlurText
              key={`b1-${activeIndex}`}
              text={copyOptions[activeIndex].title1}
              delay={50}
              animateBy="letters"
              direction="top"
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontStyle: "italic", 
                fontWeight: 400,
                color: 'white',
                margin: 0,
                justifyContent: 'center'
              }}
            />
            <BlurText
              key={`b2-${activeIndex}`}
              text={copyOptions[activeIndex].title2}
              delay={100}
              animateBy="words"
              direction="bottom"
              className="interactive-title2"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-2px',
                color: 'white',
                margin: 0,
                justifyContent: 'center'
              }}
            />
          </div>
          <div className="hero-subtitle" style={{ transition: 'opacity 0.3s' }}>
            <BlurText
              key={`b3-${activeIndex}`}
              text={copyOptions[activeIndex].subtitle}
              delay={30}
              animateBy="words"
              direction="bottom"
              style={{ margin: 0, justifyContent: 'center' }}
            />
          </div>
          <button className="hero-cta" onClick={() => navigate('/setup')} style={{ marginTop: '24px' }}>
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
