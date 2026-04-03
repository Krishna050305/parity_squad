import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Community-Powered <br/><span className="text-gradient">P2P Lending on Algorand</span></h1>
          <p className="hero-subtitle">
            Borrow based on your community reputation. Lend to peers you trust. 
            All securely executed on the Algorand blockchain.
          </p>
          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary btn-lg">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="features page-container">
        <h2 className="section-title">Why LendPool?</h2>
        <div className="feature-grid">
          <div className="card feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Decentralized</h3>
            <p>No middlemen. Smart contracts securely hold funds and enforce logic automatically.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Transparent</h3>
            <p>Every loan state and transaction is public on the ledger, fostering a trustless environment.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🏅</div>
            <h3>Community-Based</h3>
            <p>Reputation matters. Higher community tiers unlock better borrowing limits and terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
