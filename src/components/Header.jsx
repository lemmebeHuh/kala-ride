import React, { useState } from 'react';
import { Menu, X, Home, Activity, Map as MapIconMenu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LogoSasa from '../assets/sasas.png';

export default function Header({ absolute = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const beaconId = searchParams.get('beacon');

  const headerStyle = absolute 
    ? { position: 'absolute', top: 0, left: 0, right: 0, background: 'transparent', borderBottom: 'none', zIndex: 9999 }
    : { 
        background: 'rgba(10, 10, 11, 0.5)', 
        borderBottom: '1px solid var(--bg-tertiary)', 
        backdropFilter: 'blur(10px)', 
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999 
      };

  return (
    <>
      <header className="app-header" style={headerStyle}>
        <button className="burger-btn" onClick={() => setIsMenuOpen(true)}>
          <Menu color="white" />
        </button>
        <Link to="/">
          <img src={LogoSasa} alt="Logo Sasa" className="header-logo" />
        </Link>
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
              <Link to="/" className="menu-link" onClick={() => setIsMenuOpen(false)}><Home size={20} /> Home</Link>
              {beaconId && (
                <a href={`https://www.strava.com/beacon/${beaconId}`} target="_blank" className="menu-link" rel="noreferrer"><Activity size={20} /> Open in Strava</a>
              )}
              <Link to="/setup" className="menu-link menu-btn" onClick={() => setIsMenuOpen(false)}><MapIconMenu size={20} /> Setup Baru</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
