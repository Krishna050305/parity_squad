import React from 'react';
import './LoraFab.css';

const LoraFab: React.FC = () => {
  // Check network configured in env to construct appropriate Lora URL
  const network = import.meta.env.VITE_NETWORK || 'localnet';
  
  let loraUrl = 'http://localhost:5173/'; // AlgoKit localnet explorer default port
  if (network === 'testnet') {
    loraUrl = 'https://lora.algokit.io/testnet';
  } else if (network === 'mainnet') {
    loraUrl = 'https://lora.algokit.io/mainnet';
  } else {
    // Standard explicit route for localnet on lora platform
    loraUrl = 'https://lora.algokit.io/localnet'; 
  }

  return (
    <a 
      href={loraUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="lora-fab"
      title="Open Algorand Explorer"
    >
      <span className="lora-icon">🔍</span>
      <span>View on Lora ↗</span>
    </a>
  );
};

export default LoraFab;
