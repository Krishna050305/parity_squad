import React from 'react';

export const TierBadge = ({ tier }: { tier: number }) => {
    let color = '';
    let bg = '';
    switch(tier) {
        case 1: color = '#0f766e'; bg = '#ccfbf1'; break; 
        case 2: color = '#4338ca'; bg = '#e0e7ff'; break; 
        case 3: color = '#7e22ce'; bg = '#f3e8ff'; break; 
        default: color = '#4b5563'; bg = '#f3f4f6'; break; 
    }
    
    return (
        <span style={{ 
            padding: '0.15rem 0.5rem', 
            borderRadius: '4px', 
            fontSize: '0.7rem', 
            fontWeight: 600, 
            backgroundColor: bg, 
            color: color,
            display: 'inline-block'
        }}>
            Tier {tier} Verified
        </span>
    );
};
