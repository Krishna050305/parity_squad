import React from 'react';

export const LoraButton = () => {
    // Check if we are on testnet based on the environment or local storage (for demo purposes)
    // Actually, algokit configures TestNet in .env. We'll check the current host or logic.
    // If we're on localhost, algokit explore is typically available from localnet
    
    // Default to LocalNet Lora (algokit explore defaults to localhost)
    const isTestNet = process.env.VITE_ALGOD_SERVER?.includes('testnet');
    
    const loraUrl = isTestNet 
        ? "https://lora.algokit.io/testnet" 
        : "https://lora.algokit.io/localnet"; // Standard algokit explore link for localnet
        
    return (
        <a 
            href={loraUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: 'var(--brand-green)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '30px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s, background-color 0.2s',
                fontFamily: 'Inter, sans-serif'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = '#059669'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'var(--brand-green)'; }}
        >
            View on Lora ↗
        </a>
    );
};
