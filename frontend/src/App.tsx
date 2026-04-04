import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { VouchSelectionPage } from './pages/VouchSelectionPage';
import { GuarantorSelectionPage } from './pages/GuarantorSelectionPage';
import { BorrowerDashboard } from './pages/BorrowerDashboard';
import { LenderHomePage } from './pages/LenderHomePage';
import { LenderPortfolioPage } from './pages/LenderPortfolioPage';
import { LoanDetailPage } from './pages/LoanDetailPage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import { AuthGuard } from './components/AuthGuard';
import { Navigate } from 'react-router-dom';
import './styles/App.css';

import { BackToHome } from './components/BackToHome';

import { SnackbarProvider } from 'notistack';

const RootRedirect = () => {
    const role = localStorage.getItem('lp_role');
    const address = localStorage.getItem('connectedAddress');
    
    // If authenticated, go to dashboard
    if (role === 'lender' && address) return <Navigate to="/lender/home" replace />;
    if (role === 'borrower' && address) return <Navigate to="/borrower/dashboard" replace />;
    
    // Otherwise show landing
    return <LandingPage />;
};

export default function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <div style={{ minHeight: '100vh' }}>
          <Navbar />
          <BackToHome />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Borrower Routes */}
            <Route path="/borrower/dashboard" element={<AuthGuard role="borrower"><BorrowerDashboard /></AuthGuard>} />
            <Route path="/vouch-selection" element={<AuthGuard role="borrower"><VouchSelectionPage /></AuthGuard>} />
            <Route path="/choose-guarantor" element={<AuthGuard role="borrower"><GuarantorSelectionPage /></AuthGuard>} />
            <Route path="/create-loan" element={<AuthGuard role="borrower"><CreateLoanPage /></AuthGuard>} />
            
            {/* Lender Routes */}
            <Route path="/lender/home" element={<AuthGuard role="lender"><LenderHomePage /></AuthGuard>} />
            <Route path="/lender/portfolio" element={<AuthGuard role="lender"><LenderPortfolioPage /></AuthGuard>} />
            
            {/* Mixed/Shared */}
            <Route path="/loan/:appId" element={<LoanDetailPage />} />
            
            {/* Fallback */}
            <Route path="/create" element={<Navigate to="/create-loan" replace />} />
          </Routes>
        </div>
      </SnackbarProvider>
    </BrowserRouter>
  );
}
