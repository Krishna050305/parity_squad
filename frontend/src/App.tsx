import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Navbar } from './components/Navbar';
import './styles/App.css'; 

const HomePage = () => (
  <div>
    <div className="hero-gradient">
      <h1 style={{ fontSize: '4.5rem', fontWeight: 800, margin: '0 0 1.5rem 0', lineHeight: 1.1, letterSpacing: '-1px' }}>
        <span style={{ color: '#1f2937' }}>Community-Powered</span><br />
        <span className="text-gradient">P2P Lending on Algorand</span>
      </h1>
      <p style={{ fontSize: '1.35rem', color: 'var(--muted)', maxWidth: '750px', margin: '0 0 3rem 0', lineHeight: 1.6 }}>
        Borrow based on your community reputation. Lend to peers you trust. All securely executed on the Algorand blockchain.
      </p>
      <Link to="/create">
        <button className="btn-green">Get Started</button>
      </Link>
    </div>

    <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: '#fafaf9' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem', color: '#1f2937' }}>Why LendPool?</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        
        <div className="feature-card">
          <div className="icon-wrapper">🛡️</div>
          <h3 style={{ margin: 0, color: 'var(--brand-green)', fontSize: '1.4rem' }}>Decentralized</h3>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">🔍</div>
          <h3 style={{ margin: 0, color: 'var(--brand-green)', fontSize: '1.4rem' }}>Transparent</h3>
        </div>

      </div>
    </div>
  </div>
);

const LoanDetailPage = () => <div style={{ padding: '2rem' }}><h1>Loan Detail</h1></div>;
const CreateLoanPage = () => <div style={{ padding: '2rem' }}><h1>Create Loan</h1></div>;

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: 'white', minHeight: '100vh', color: 'var(--text)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loan/:appId" element={<LoanDetailPage />} />
          <Route path="/create" element={<CreateLoanPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
