import React from 'react';
import { useParams } from 'react-router-dom';
import './LoanDetailPage.css';

interface Props {
  walletAddress: string;
}

const LoanDetailPage: React.FC<Props> = () => {
  const { appId } = useParams<{ appId: string }>();

  const handleFund = () => {
    console.log("Fund loan stub");
    alert("Fund loan logic goes here");
  };

  const handleRepay = () => {
    console.log("Repay loan stub");
    alert("Repay loan logic goes here");
  };

  const handleClaim = () => {
    console.log("Claim loan stub");
    alert("Claim loan logic goes here");
  };

  return (
    <div className="page-container loan-detail-page">
      <div className="card detail-card">
        <div className="detail-header">
          <h2>Loan Application #{appId}</h2>
          <span className="badge badge-open">OPEN</span>
        </div>
        
        <div className="detail-body">
          <div className="info-group">
            <span className="info-label">Goal Amount</span>
            <span className="info-value">100 ALGO</span>
          </div>
          <div className="info-group">
            <span className="info-label">Duration</span>
            <span className="info-value">30 Days</span>
          </div>
          <div className="info-group">
            <span className="info-label">Tier Required</span>
            <span className="info-value">Tier 1</span>
          </div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={handleFund}>
            Fund Loan (Lender)
          </button>
          <button className="btn btn-secondary" onClick={handleRepay}>
            Repay Loan (Borrower)
          </button>
          <button className="btn btn-outline" onClick={handleClaim}>
            Claim Repayment (Lender)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailPage;
