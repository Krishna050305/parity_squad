import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoanDetailPage from './pages/LoanDetailPage';
import CreateLoanPage from './pages/CreateLoanPage';
import TrustPathModal from './components/TrustPathModal';
import LoraFab from './components/LoraFab';
import { reconnectWallet } from './wallet';

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showTrustModal, setShowTrustModal] = useState<boolean>(false);

  useEffect(() => {
    // Reconnect wallet on app mount
    reconnectWallet().then(addr => {
      if (addr) {
        setWalletAddress(addr);
        if (!localStorage.getItem(`lendpool_onboarded_${addr}`)) {
          setShowTrustModal(true);
        }
      }
    });
  }, []);

  const handleWalletConnect = (addr: string) => {
    setWalletAddress(addr);
    if (!localStorage.getItem(`lendpool_onboarded_${addr}`)) {
      setShowTrustModal(true);
    }
  };

  return (
    <BrowserRouter>
      <Navbar walletAddress={walletAddress} onWalletConnect={handleWalletConnect} onWalletDisconnect={() => setWalletAddress('')} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loan/:appId" element={<LoanDetailPage walletAddress={walletAddress} />} />
        <Route path="/create" element={<CreateLoanPage walletAddress={walletAddress} />} />
      </Routes>
      <LoraFab />
      {showTrustModal && (
        <TrustPathModal 
          walletAddress={walletAddress} 
          onClose={() => setShowTrustModal(false)} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;
