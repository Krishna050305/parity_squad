import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connectWallet, disconnectWallet } from '../wallet';
import { calculateReputation } from '../api';
import { TrustPathModal } from './TrustPathModal';

export const Navbar = () => {
    const [address, setAddress] = useState<string | null>(localStorage.getItem("connectedAddress"));
    const [reputation, setReputation] = useState<number | null>(null);

    useEffect(() => {
        if (address) {
            calculateReputation(address).then(setReputation);
        } else {
            setReputation(null);
        }
    }, [address]);

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

    const getRepColor = (rep: number | null) => {
        if (rep === null) return '#ccc';
        if (rep > 70) return '#10b981'; // green
        if (rep >= 40) return '#fbbf24'; // amber
        return '#ef4444'; // red
    };

    return (
        <>
        <TrustPathModal address={address} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {reputation !== null && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getRepColor(reputation) }}></div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Rep: {reputation}%</span>
                            </div>
                        )}
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
        </>
    );
};
