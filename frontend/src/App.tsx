import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { VouchSelectionPage } from './pages/VouchSelectionPage';
import { BorrowerDashboard } from './pages/BorrowerDashboard';
import { LenderDashboard } from './pages/LenderDashboard';
import { LoanDetailPage } from './pages/LoanDetailPage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import './styles/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/vouch-selection" element={<VouchSelectionPage />} />
          <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
          <Route path="/loan/:appId" element={<LoanDetailPage />} />
          <Route path="/create" element={<CreateLoanPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
