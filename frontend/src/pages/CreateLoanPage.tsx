import React, { useState } from 'react';
import './CreateLoanPage.css';

interface Props {
  walletAddress: string;
}

const CreateLoanPage: React.FC<Props> = ({ walletAddress }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [tier, setTier] = useState('0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    
    // Stub definition for create logic for next sprint
    const params = {
      borrower_address: walletAddress,
      goal_microalgos: parseFloat(goal) * 1_000_000,
      duration_days: parseInt(duration),
      tier_required: parseInt(tier)
    };
    
    console.log("Create Loan (Stub): ready to call API and signTxns", params);
    alert(`Loan creation stub recorded constraints:\nGoal: ${goal} ALGO\nDuration: ${duration} Days\nTier req: ${tier}`);
  };

  return (
    <div className="page-container create-loan-page">
      <div className="card create-card">
        <h2>Create a New Loan Request</h2>
        <p className="subtitle">Fill out the details below to open a loan on the LendPool contract.</p>
        
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label className="form-label">Goal Amount (ALGO)</label>
            <input 
              type="number" 
              className="form-input" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
              placeholder="e.g. 100"
              required 
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Days)</label>
            <input 
              type="number" 
              className="form-input" 
              value={duration} 
              onChange={e => setDuration(e.target.value)} 
              placeholder="e.g. 30"
              required 
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tier Badge Required from Lenders</label>
            <select 
              className="form-input" 
              value={tier} 
              onChange={e => setTier(e.target.value)}
            >
              <option value="0">Tier 0 (Anyone)</option>
              <option value="1">Tier 1 (Verified)</option>
              <option value="2">Tier 2 (Trusted)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Create Loan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanPage;
