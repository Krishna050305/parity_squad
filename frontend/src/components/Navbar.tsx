import React from 'react';
import { Link } from 'react-router-dom';
import { connectWallet, disconnectWallet } from '../wallet';
import ReputationBadge from './ReputationBadge';
import './Navbar.css';

interface NavbarProps {
  walletAddress: string;
  onWalletConnect: (addr: string) => void;
  onWalletDisconnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ walletAddress, onWalletConnect, onWalletDisconnect }) => {
  const handleConnect = async () => {
    const addr = await connectWallet();
    if (addr) onWalletConnect(addr);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onWalletDisconnect();
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💧</span> LendPool
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link">Create Loan</Link>
        </div>
        <div className="navbar-wallet">
          {walletAddress ? (
            <div className="wallet-connected">
              <ReputationBadge address={walletAddress} />
              <span className="wallet-address">{truncateAddress(walletAddress)}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn btn-amber" onClick={handleConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
