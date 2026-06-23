import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Live from './pages/Live';
import Grainient from './components/Grainient';

// We need a wrapper to handle URL params for Live tracking backwards compatibility
function LiveOrSetup() {
  const [searchParams] = useSearchParams();
  const beaconId = searchParams.get('beacon');
  if (beaconId) {
    return <Live />;
  }
  return <Navigate to="/setup" replace />;
}

function App() {
  return (
    <BrowserRouter>
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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/live" element={<Live />} />
        {/* Backward compatibility for old links sharing ?beacon= on root or any unknown path */}
        <Route path="*" element={<LiveOrSetup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
