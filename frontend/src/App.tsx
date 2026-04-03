import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoanDetailPage from './pages/LoanDetailPage';
import CreateLoanPage from './pages/CreateLoanPage';
import { reconnectWallet } from './wallet';

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    // Reconnect wallet on app mount
    reconnectWallet().then(addr => {
      if (addr) setWalletAddress(addr);
    });
  }, []);

  return (
    <BrowserRouter>
      <Navbar walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loan/:appId" element={<LoanDetailPage walletAddress={walletAddress} />} />
        <Route path="/create" element={<CreateLoanPage walletAddress={walletAddress} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
