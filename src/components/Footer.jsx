import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '14px', position: 'relative', zIndex: 10 }}>
      <p style={{ marginBottom: '8px' }}>LiveRide © 2024</p>
      <p style={{ fontSize: '12px', opacity: 0.7 }}>Powered by Strava API. Built for the community.</p>
    </footer>
  );
}
