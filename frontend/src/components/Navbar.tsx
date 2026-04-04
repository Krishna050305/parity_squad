import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getConnectedAddress } from '../wallet';
import { getInitials, getAvatarColor } from '../data';
import { getNotifications } from '../api';

export const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const location = useLocation();
    const connectedAddress = getConnectedAddress();
    const role = localStorage.getItem('lp_role'); // 'lender' | 'borrower' | null 
    const storedUser = JSON.parse(localStorage.getItem('lp_user') || '{}');
    const isAuth = !!role && !!connectedAddress;

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        if (isAuth && connectedAddress) {
            getNotifications(connectedAddress)
            .then(data => setNotifications(data.filter((n: any) => n.status === 'pending')))
            .catch(err => console.warn("Nav notifications failed", err));
        }
    }, [isAuth, connectedAddress]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const publicLinks = [
        { to: '/', label: 'Home' },
        { to: '/#categories', label: 'Browse' },
        { to: '/#how-it-works', label: 'How It Works' },
    ];

    const lenderLinks = [
        { to: '/lender/home', label: 'Home' },
        { to: '/lender/home#browse', label: 'Browse' },
        { to: '/lender/portfolio', label: 'My Portfolio' },
    ];

    const borrowerLinks = [
        { to: '/borrower/dashboard', label: 'My Loans' },
        { to: '/borrower/dashboard#payments', label: 'Make Payment' },
    ];

    const links = !isAuth ? publicLinks : role === 'lender' ? lenderLinks : borrowerLinks;

    return (
        <>
            <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--lp-border-light)' }}>
                <div className="navbar__inner container">
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
                        {isAuth && (
                            <Link to={role === 'lender' ? '/lender/home' : '/borrower/dashboard'} className="navbar__link">
                                Notifications {notifications.length > 0 && <span className="badge" style={{ background: 'var(--lp-danger)', color: 'white', padding: '1px 5px', borderRadius: '50%', fontSize: '0.65rem', marginLeft: '4px' }}>{notifications.length}</span>}
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="navbar__actions">
                        {isAuth ? (
                            <div style={{ position: 'relative' }}>
                                <div 
                                    className="avatar avatar-sm" 
                                    style={{ background: getAvatarColor(storedUser.name || 'User'), cursor: 'pointer' }}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {getInitials(storedUser.name || 'U')}
                                </div>
                                {dropdownOpen && (
                                    <div className="card" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', padding: '8px 0', width: '160px', zIndex: 1100 }}>
                                        <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--lp-slate-muted)', borderBottom: '1px solid var(--lp-border-light)' }}>
                                            {storedUser.name || 'Account'}
                                        </div>
                                        <Link to="/settings" className="dropdown-item" style={{ padding: '8px 16px', display: 'block', fontSize: '0.85rem' }}>Settings</Link>
                                        <button onClick={handleLogout} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', fontSize: '0.85rem', color: 'var(--lp-danger)', cursor: 'pointer' }}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/auth">
                                <button className="btn btn-primary btn-sm">Login / Register</button>
                            </Link>
                        )}
                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>☰</button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <div className={`mobile-nav ${mobileOpen ? 'mobile-nav--open' : ''}`}>
                <button className="mobile-nav__close" onClick={() => setMobileOpen(false)}>×</button>
                {links.map(link => (
                    <Link key={link.to} to={link.to} className="mobile-nav__link" onClick={() => setMobileOpen(false)}>{link.label}</Link>
                ))}
                {isAuth ? (
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-outline" style={{ marginTop: '20px' }}>Logout</button>
                ) : (
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }}>Login / Register</button>
                    </Link>
                )}
            </div>
        </>
    );
};

