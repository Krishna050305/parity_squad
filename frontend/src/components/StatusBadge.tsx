import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    let bg = '';
    switch(status) {
        case 'OPEN': color = '#15803d'; bg = '#dcfce7'; break; 
        case 'FUNDED': color = '#1d4ed8'; bg = '#dbeafe'; break; 
        case 'REPAYING': color = '#b45309'; bg = '#fef3c7'; break; 
        case 'DEFAULTED': color = '#b91c1c'; bg = '#fee2e2'; break; 
        default: color = '#374151'; bg = '#f3f4f6'; break; 
    }
    
    return (
        <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            backgroundColor: bg, 
            color: color 
        }}>
            {status}
        </span>
    );
};
