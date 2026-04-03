import React, { useState } from 'react';
import { fundLoan } from '../api';
import { signAndSendTxns } from '../wallet';
import TxBadge from './TxBadge';
import './Modal.css';

interface Props {
  appId: number;
  walletAddress: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FundModal: React.FC<Props> = ({ appId, walletAddress, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const params = {
        lender_address: walletAddress,
        app_id: appId,
        amount_microalgos: Math.floor(Number(amount) * 1_000_000),
      };
      
      const { txns } = await fundLoan(params);
      const confirmedTxId = await signAndSendTxns(txns);
      setTxId(confirmedTxId);
      
      // Wait a moment for indexer to catch up
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  if (txId) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Funding Successful! 🎉</h3>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ marginBottom: '1rem' }}>Thank you for funding this loan.</p>
            <TxBadge txId={txId} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Fund Loan</h3>
          <button className="modal-close" onClick={onClose} disabled={processing}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Amount (ALGO)</label>
            <input 
              type="number" 
              className="form-input" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="e.g. 10"
              disabled={processing}
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={processing}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={processing}>
            {processing ? 'Processing...' : 'Confirm Funding'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundModal;
