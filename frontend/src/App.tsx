import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CreateLoanPage } from './pages/CreateLoanPage';
import './styles/App.css'; 

const LoanDetailPage = () => <div style={{ padding: '2rem' }}><h1>Loan Detail</h1></div>;

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
