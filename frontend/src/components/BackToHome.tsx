import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const BackToHome = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <div style={{ padding: '12px 24px', background: 'var(--lp-surface)', borderBottom: '1px solid var(--lp-border-light)' }}>
      <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.9rem', padding: '6px 12px', textDecoration: 'none' }}>
        ← Back to Home
      </Link>
    </div>
  );
};
