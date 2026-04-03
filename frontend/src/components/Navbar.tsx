import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connectWallet, disconnectWallet } from '../wallet';

export const Navbar = () => {
    const [address, setAddress] = useState<string | null>(localStorage.getItem("connectedAddress"));

    const handleConnect = async () => {
        try {
            const addr = await connectWallet();
            setAddress(addr);
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    };

    const handleDisconnect = async () => {
        await disconnectWallet();
        setAddress(null);
    };

    return (
        <nav style={{ 
            background: 'var(--surface)', 
            padding: '1rem 4rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '20px',
                    height: '28px',
                    background: 'linear-gradient(to bottom, #60a5fa, #2563eb)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}></div>
                <h2 style={{ color: 'var(--brand-green)', margin: 0, fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>LendPool</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '2.5rem', fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Link to="/create" style={{ textDecoration: 'none', color: 'inherit' }}>Create Loan</Link>
            </div>

            <div>
                {address ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--muted)' }}>
                            {address.slice(0, 5)}...{address.slice(-4)}
                        </span>
                        <button onClick={handleDisconnect} className="btn-amber">
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button onClick={handleConnect} className="btn-amber">
                        Connect Wallet
                    </button>
                )}
            </div>
        </nav>
    );
};
