import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLoanState, fetchLoanTxns, claimRepayment } from '../api';
import { signAndSendTxns } from '../wallet';
import TierBadge from '../components/TierBadge';
import StatusBadge from '../components/StatusBadge';
import FundModal from '../components/FundModal';
import RepayModal from '../components/RepayModal';
import TxBadge from '../components/TxBadge';
import './LoanDetailPage.css';

interface Props {
  walletAddress: string;
}

const LoanDetailPage: React.FC<Props> = ({ walletAddress }) => {
  const { appId } = useParams<{ appId: string }>();
  const id = Number(appId);

  const [loanState, setLoanState] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFundModal, setShowFundModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [processingClaim, setProcessingClaim] = useState(false);
  const [claimTxId, setClaimTxId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stateData, txnsData] = await Promise.all([
        fetchLoanState(id),
        fetchLoanTxns(id).catch(() => ({ transactions: [] })) // don't fail if indexer has no txns yet
      ]);
      setLoanState(stateData);
      setTxns(txnsData.transactions || []);
    } catch (err: any) {
      setError(err.message || "Failed to load loan data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleClaim = async () => {
    if (!walletAddress) return;
    setProcessingClaim(true);
    try {
      const { txns: unsignedTxns } = await claimRepayment(id, walletAddress);
      const txId = await signAndSendTxns(unsignedTxns);
      setClaimTxId(txId);
      setTimeout(loadData, 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Claim failed');
    } finally {
      setProcessingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container loan-detail-page">
        <div className="loading-state">
          <h2>Loading Loan #{id}...</h2>
          <p>Fetching data from the Algorand blockchain.</p>
        </div>
      </div>
    );
  }

  if (error || !loanState) {
    return (
      <div className="page-container loan-detail-page">
        <div className="error-state alert-box">
          <h3>Error</h3>
          <p>{error || "Loan not found"}</p>
          <button className="btn btn-secondary mt-4" onClick={loadData}>Try Again</button>
        </div>
      </div>
    );
  }

  const {
    borrower = '',
    goal_amount = 0,
    funded_amount = 0,
    repaid_amount = 0,
    status_label = 'UNKNOWN',
    tier_required = 0,
    deadline = 0
  } = loanState;

  const percentage = goal_amount > 0 ? Math.min((funded_amount / goal_amount) * 100, 100) : 0;
  
  // Format avatar
  const avatarChars = borrower ? borrower.slice(0, 4).toUpperCase() : '????';
  let hash = 0;
  for (let i = 0; i < borrower.length; i++) hash = borrower.charCodeAt(i) + ((hash << 5) - hash);
  const avatarColor = `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;

  // Calculate deadline days
  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = deadline - now;
  const daysRemaining = Math.ceil(remainingSeconds / 86400);

  const microToAlgo = (micro: number) => (micro / 1_000_000).toFixed(2);

  // Determine which actions to show
  const isBorrower = walletAddress === borrower;
  const showFund = status_label === 'OPEN' && !isBorrower && walletAddress;
  const showRepay = status_label === 'REPAYING' && isBorrower;
  const showClaim = status_label === 'CLOSED' && walletAddress && !isBorrower; 
  // Note: a more robust check for `showClaim` would verify if `walletAddress` actually contributed via local state.

  return (
    <div className="page-container loan-detail-page">
      <div className="detail-layout">
        
        {/* Main Card */}
        <div className="card detail-header-card">
          
          {/* Header Row */}
          <div className="detail-top-row">
            <div className="borrower-section">
              <div className="borrower-avatar" style={{ backgroundColor: avatarColor }}>
                {avatarChars}
              </div>
              <div className="borrower-info">
                <span className="borrower-address">{borrower}</span>
                <div>
                  <TierBadge tier={tier_required} />
                </div>
              </div>
            </div>
            
            <div className="status-section">
              <StatusBadge status={status_label} />
              {status_label === 'OPEN' && daysRemaining > 0 && (
                <span className="deadline-info">⏳ {daysRemaining} days remaining</span>
              )}
              {status_label === 'OPEN' && daysRemaining <= 0 && (
                <span className="deadline-info" style={{ color: 'var(--brand-red)' }}>⚠️ Deadline passed</span>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-track-lg">
              <div className="progress-fill-lg" style={{ width: `${percentage}%` }} />
            </div>
            <div className="progress-stats-row">
              <div className="primary-stat">
                <strong>{microToAlgo(funded_amount)}</strong> of {microToAlgo(goal_amount)} ALGO funded
              </div>
              <div className="secondary-stat">
                {percentage.toFixed(1)}%
              </div>
            </div>
            {repaid_amount > 0 && (
              <div className="repaid-stat">
                💰 {microToAlgo(repaid_amount)} ALGO repaid to lenders
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="action-section">
            {!walletAddress && (
              <div className="action-msg">Connect your wallet to interact with this loan.</div>
            )}

            {showFund && (
              <button className="btn btn-primary btn-large" onClick={() => setShowFundModal(true)}>
                Fund this Loan
              </button>
            )}

            {showRepay && (
              <button className="btn btn-amber btn-large" onClick={() => setShowRepayModal(true)}>
                Repay Loan
              </button>
            )}

            {showClaim && (
              <button 
                className="btn btn-outline btn-large" 
                onClick={handleClaim}
                disabled={processingClaim || !!claimTxId}
              >
                {processingClaim ? 'Processing...' : claimTxId ? 'Claimed' : 'Claim my share'}
              </button>
            )}
            
            {claimTxId && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <TxBadge txId={claimTxId} />
              </div>
            )}
          </div>
        </div>

        {/* Transaction History Card */}
        <div className="card history-card">
          <h3>Transaction History</h3>
          {txns.length === 0 ? (
            <div className="history-empty">No transactions found for this application.</div>
          ) : (
            <div className="txn-list">
              {txns.map((t, idx) => {
                const isAppCall = t['tx-type'] === 'appl';
                const isPayment = t['tx-type'] === 'pay';
                const amt = isPayment ? t['payment-transaction']?.amount : 0;
                
                let typeLabel = t['tx-type'];
                if (isAppCall) typeLabel = 'App Call';
                if (isPayment) typeLabel = 'Payment';

                const date = t['round-time'] 
                  ? new Date(t['round-time'] * 1000).toLocaleString() 
                  : 'Unknown Date';

                return (
                  <div className="txn-item" key={t.id || idx}>
                    <div className="txn-info">
                      <span className="txn-type">{typeLabel}</span>
                      <span className="txn-time">{date}</span>
                    </div>
                    <div className="txn-amount-link">
                      {amt > 0 && <span className="txn-amount">{microToAlgo(amt)} ALGO</span>}
                      <a 
                        href={`https://testnet.explorer.perawallet.app/tx/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {t.id?.slice(0,8)}...↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="detail-footer">
          <a
            href={`https://testnet.explorer.perawallet.app/application/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View Contract on Algorand Explorer ↗
          </a>
        </div>

      </div>

      {showFundModal && (
        <FundModal 
          appId={id} 
          walletAddress={walletAddress} 
          onClose={() => setShowFundModal(false)}
          onSuccess={loadData}
        />
      )}

      {showRepayModal && (
        <RepayModal 
          appId={id} 
          walletAddress={walletAddress} 
          onClose={() => setShowRepayModal(false)}
          onSuccess={loadData}
        />
      )}

    </div>
  );
};

export default LoanDetailPage;
