import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Setup() {
  const [inputUrl, setInputUrl] = useState('');
  const [inputLikes, setInputLikes] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputSport, setInputSport] = useState('ride');
  const [inputDistancePerLike, setInputDistancePerLike] = useState('');
  const [inputDonation, setInputDonation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalId = inputUrl.trim();
      if (finalId.includes('strava.com/beacon/')) {
        finalId = finalId.split('strava.com/beacon/')[1].split('?')[0].split('/')[0];
      }
      
      if (!finalId) {
        alert("Link Beacon tidak valid");
        setIsLoading(false);
        return;
      }

      const sessionData = {
        beaconId: finalId,
        title: inputTitle || "Kala's Live Ride",
        likes: parseInt(inputLikes) || 0,
        perlike: parseInt(inputDistancePerLike) || 500,
        sport: inputSport,
        donationUrl: inputDonation.trim(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "sessions"), sessionData);
      navigate(`/live?id=${docRef.id}`);
    } catch (error) {
      console.error("Error creating session: ", error);
      alert("Gagal membuat sesi live. Pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
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
                <label>Total Likes (Medsos)</label>
                <input 
                  type="number" 
                  className="form-control"
                  min="0"
                  placeholder="Contoh: 150" 
                  value={inputLikes}
                  onChange={(e) => setInputLikes(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Link Donasi / Support (Opsional)</label>
                <input 
                  type="url" 
                  className="form-control"
                  placeholder="https://saweria.co/..." 
                  value={inputDonation}
                  onChange={(e) => setInputDonation(e.target.value)}
                />
              </div>
              <button type="submit" className="start-btn" disabled={isLoading}>
                {isLoading ? "Menyiapkan..." : "Start Live Tracking"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
