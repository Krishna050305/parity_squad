import React, { useState } from 'react';
import './Modal.css';
import './TrustPathModal.css';

interface Props {
  walletAddress: string;
  onClose: () => void;
}

const TrustPathModal: React.FC<Props> = ({ walletAddress, onClose }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [guarantorAddress, setGuarantorAddress] = useState('');
  
  const [tierAssigned, setTierAssigned] = useState<number | null>(null);
  const [borrowLimit, setBorrowLimit] = useState<number | null>(null);

  const getLimitForTier = (tier: number) => {
    switch(tier) {
      case 0: return 500;
      case 1: return 2000;
      case 2: return 5000;
      case 3: return 20000;
      case 4: return 50000;
      default: return 500;
    }
  };

  const handleSelectPath = (path: string) => {
    setSelectedPath(path);
    if (path === 'self') {
      setTierAssigned(0);
      setBorrowLimit(getLimitForTier(0));
    } else if (path === 'vouch') {
      // Mock: automatically assign Tier 2 for demo purposes
      console.log('Mocking vouching process...');
      localStorage.setItem(`lendpool_tier_${walletAddress}`, '2');
      setTierAssigned(2);
      setBorrowLimit(getLimitForTier(2));
    }
  };

  const handleGuarantorSubmit = () => {
    if (!guarantorAddress) {
      alert("Please enter an address");
      return;
    }
    // Save guarantor to local storage to be passed during loan creation
    localStorage.setItem(`lendpool_guarantor_${walletAddress}`, guarantorAddress);
    
    // Assign Tier 1 based on having a guarantor
    localStorage.setItem(`lendpool_tier_${walletAddress}`, '1');
    setTierAssigned(1);
    setBorrowLimit(getLimitForTier(1));
  };

  const completeOnboarding = () => {
    localStorage.setItem(`lendpool_onboarded_${walletAddress}`, 'true');
    onClose();
  };

  if (tierAssigned !== null && borrowLimit !== null) {
    return (
      <div className="modal-overlay trust-path-modal">
        <div className="modal-content">
          <div className="result-card">
            <h3>🎉 Access Unlocked!</h3>
            <p>Your current reputation tier is <strong>Tier {tierAssigned}</strong>.</p>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0', color: 'var(--text)' }}>
              Your borrow limit: <strong>{borrowLimit.toLocaleString()} ALGO</strong>
            </p>
            <button className="btn btn-primary btn-lg" onClick={completeOnboarding}>
              Got it! Let's Go
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay trust-path-modal">
      <div className="modal-content">
        <h2>Welcome to LendPool 🌱</h2>
        <p className="subtitle">You are currently <strong>Tier 0</strong>. Choose a path to establish trust and unlock borrowing.</p>

        <div className="path-grid">
          {/* Path A */}
          <div className={`path-card ${selectedPath === 'vouch' ? 'selected' : ''}`}>
            <h4>Path A: Vouch</h4>
            <p>Have 2 community members vouch for your trustworthiness. Unlocks Tier 2 limits instantly.</p>
            <button 
              className="btn btn-primary btn-path" 
              onClick={() => handleSelectPath('vouch')}
            >
              Get Vouched (Demo)
            </button>
          </div>

          {/* Path B */}
          <div className={`path-card ${selectedPath === 'guarantor' ? 'selected' : ''}`}>
            <h4>Path B: Guarantor</h4>
            <p>Nominate a trusted user. If you default, their reputation takes a hit. Unlocks Tier 1.</p>
            {selectedPath === 'guarantor' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Guarantor Algo Address" 
                  value={guarantorAddress}
                  onChange={e => setGuarantorAddress(e.target.value)}
                  style={{ fontSize: '0.8rem' }}
                />
                <button className="btn btn-amber btn-path" onClick={handleGuarantorSubmit}>
                  Confirm
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-secondary btn-path" 
                onClick={() => setSelectedPath('guarantor')}
              >
                Enter Guarantor
              </button>
            )}
          </div>

          {/* Path C */}
          <div className={`path-card ${selectedPath === 'self' ? 'selected' : ''}`}>
            <h4>Path C: Self-Raise</h4>
            <p>Prove yourself directly. Borrow up to 500 ALGO as Tier 0, and level up by repaying on time.</p>
            <button 
              className="btn btn-outline btn-path" 
              onClick={() => handleSelectPath('self')}
            >
              Continue as Tier 0
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TrustPathModal;
