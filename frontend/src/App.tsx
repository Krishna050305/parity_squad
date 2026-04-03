import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import { LoanDetailPage } from './pages/LoanDetailPage';
import { VerifyPage } from './pages/VerifyPage';
import { LoraButton } from './components/LoraButton';
import './styles/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: 'white', minHeight: '100vh', color: 'var(--text)', position: 'relative' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loan/:appId" element={<LoanDetailPage />} />
          <Route path="/create" element={<CreateLoanPage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
        <LoraButton />
      </div>
    </BrowserRouter>
  );
}

