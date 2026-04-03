import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { TierBadge } from './TierBadge';

export const LoanCard = ({ appId, borrower, goal, funded, repaid, status, tierRequired, lenderCount }: any) => {
    const navigate = useNavigate();
    const pct = goal > 0 ? Math.min(100, Math.round((funded / goal) * 100)) : 0;
    
    // Status mapping based on global state uint
    const statusMap: any = { 1: 'OPEN', 2: 'FUNDED', 3: 'REPAYING', 4: 'CLOSED', 5: 'DEFAULTED' };
    const statusStr = statusMap[status] || 'UNKNOWN';

    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #eee',
            cursor: 'pointer', transition: 'transform 0.2s'
        }} onClick={() => navigate(`/loan/${appId}`)} className="loan-card-hover">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                        width: '45px', height: '45px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-green))', 
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontWeight: 'bold', fontSize: '1.1rem' 
                    }}>
                        {borrower ? borrower.substring(0, 4) : '?!'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>
                            {borrower ? `${borrower.substring(0, 5)}...${borrower.substring(borrower.length - 4)}` : 'Unknown User'}
                        </div>
                        <TierBadge tier={tierRequired} />
                    </div>
                </div>
                <StatusBadge status={statusStr} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--brand-green)' }}>{(funded / 1e6).toFixed(2)} ALGO funded</span>
                    <span style={{ color: 'var(--muted)' }}>Goal: {(goal / 1e6).toFixed(2)} ALGO</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand-green)' }}></div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>
                    {lenderCount} lender{lenderCount !== 1 ? 's' : ''} • {pct}%
                </div>
            </div>

            <div style={{ fontSize: '0.85rem', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <a href={`https://testnet.explorer.perawallet.app/application/${appId}`} target="_blank" rel="noreferrer" 
                   style={{ color: 'var(--brand-blue)', textDecoration: 'none', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                    View on Algorand ↗
                </a>
            </div>
        </div>
    );
};
