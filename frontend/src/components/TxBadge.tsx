import React from 'react';

export const TxBadge = ({ txId }: { txId: string }) => {
    if (!txId) return null;
    return (
        <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.35rem 0.75rem', borderRadius: '9999px', 
            fontSize: '0.8rem', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #10b981' 
        }}>
            ✓ <a href={`https://testnet.explorer.perawallet.app/tx/${txId}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Verified on Algorand</a> ({txId.substring(0, 6)}...)
        </span>
    );
};
