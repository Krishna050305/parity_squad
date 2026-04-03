import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem('lp_role'); // 'lender' | 'borrower' | null
  const isAuth = !!role;

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/#categories', label: 'Browse' },
    { to: '/#how-it-works', label: 'How It Works' },
  ];

  const lenderLinks = [
    { to: '/', label: 'Browse' },
    { to: '/lender/dashboard', label: 'My Portfolio' },
  ];

  const borrowerLinks = [
    { to: '/borrower/dashboard', label: 'My Loans' },
    { to: '/borrower/dashboard#trust', label: 'Trust Score' },
    { to: '/borrower/dashboard#payments', label: 'Payments' },
  ];

  const links = !isAuth ? publicLinks : role === 'lender' ? lenderLinks : borrowerLinks;

  const handleLogout = () => {
    localStorage.removeItem('lp_role');
    localStorage.removeItem('lp_user');
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/src/assets/lendpool_logo.png" alt="LendPool" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} />
            LendPool
          </Link>

          {/* Desktop Links */}
          <div className="navbar__links">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            {isAuth ? (
              <>
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--lp-slate-muted)',
                  fontWeight: 500,
                  padding: '4px 12px',
                  background: 'rgba(13,79,60,0.06)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {role === 'lender' ? 'Lender' : 'Borrower'}
                </span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth">
                <button className="btn btn-primary btn-sm">Login / Register</button>
              </Link>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav ${mobileOpen ? 'mobile-nav--open' : ''}`}>
        <button className="mobile-nav__close" onClick={() => setMobileOpen(false)}>×</button>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="mobile-nav__link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {isAuth ? (
          <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-outline">
            Logout
          </button>
        ) : (
          <Link to="/auth" onClick={() => setMobileOpen(false)}>
            <button className="btn btn-primary">Login / Register</button>
          </Link>
        )}
      </div>
    </>
  );
};
