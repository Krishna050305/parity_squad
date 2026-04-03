import React, { useState } from 'react';
import { createLoan } from '../api';
import { signAndSendTxns } from '../wallet';
import TxBadge from '../components/TxBadge';
import './CreateLoanPage.css';

interface Props {
  walletAddress: string;
}

const CreateLoanPage: React.FC<Props> = ({ walletAddress }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('30');
  const [purpose, setPurpose] = useState('');
  const [tier, setTier] = useState('0');
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSuccessId, setTxSuccessId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setError("Please connect your wallet first.");
      return;
    }
    
    if (!goal || !Number(goal) || Number(goal) <= 0) {
      setError("Please enter a valid goal amount.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const params = {
        borrower_address: walletAddress,
        goal_microalgos: Math.floor(Number(goal) * 1_000_000),
        duration_days: parseInt(duration),
        tier_required: parseInt(tier),
        badge_asa_id: 0, // Assuming 0 implies no badge for Tier 0
      };
      
      const { txns } = await createLoan(params);
      const txId = await signAndSendTxns(txns);
      setTxSuccessId(txId);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create loan.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setGoal('');
    setDuration('30');
    setPurpose('');
    setTier('0');
    setError(null);
    setTxSuccessId(null);
    setProcessing(false);
  }

  if (txSuccessId) {
    return (
      <div className="page-container create-loan-page">
        <div className="card create-card success-state">
          <div className="success-icon">🎉</div>
          <h3>Your loan is live!</h3>
          <p>The contract has been deployed successfully to the Algorand network.</p>
          
          <div className="tx-container">
            <TxBadge txId={txSuccessId} />
          </div>
          
          <p className="subtitle" style={{ fontSize: '0.85rem' }}>
            Note: Your new application ID will soon appear in the indexer and on the Home page feed.
          </p>
          
          <button className="btn btn-secondary" onClick={handleReset}>
            Create Another Loan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container create-loan-page">
      <div className="card create-card">
        <h2>Create a New Loan Request</h2>
        <p className="subtitle">Fill out the details below to open a loan on the LendPool contract.</p>
        
        {error && (
          <div className="alert-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label className="form-label">Goal Amount (ALGO)</label>
            <input 
              type="number" 
              className="form-input" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
              placeholder="e.g. 100"
              disabled={processing}
              required 
              min="1"
              step="any"
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
              disabled={processing}
              required 
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Loan Purpose</label>
            <textarea 
              className="form-input" 
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Why do you need this loan? e.g., 'Starting a small baker business...'"
              disabled={processing}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tier Badge Required from Lenders</label>
            <select 
              className="form-input" 
              value={tier} 
              onChange={e => setTier(e.target.value)}
              disabled={processing}
            >
              <option value="0">Tier 0 (Anyone)</option>
              <option value="1">Tier 1 (Verified)</option>
              <option value="2">Tier 2 (Trusted)</option>
              <option value="3">Tier 3 (Established)</option>
              <option value="4">Tier 4 (Elite)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={processing || !walletAddress}>
            {processing ? 'Processing...' : (!walletAddress ? 'Connect Wallet First' : 'Create Loan')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanPage;
