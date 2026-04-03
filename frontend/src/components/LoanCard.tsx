import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import TierBadge from './TierBadge';
import ReputationBadge from './ReputationBadge';
import './LoanCard.css';

interface LoanCardProps {
  appId: number;
  borrower: string;
  goal: number;        // microAlgos
  funded: number;      // microAlgos
  repaid: number;      // microAlgos
  status: string;
  tierRequired: number;
  lenderCount: number;
}

/** Generate a deterministic HSL colour from an address string */
function addressToColor(addr: string): string {
  let hash = 0;
  for (let i = 0; i < addr.length; i++) {
    hash = addr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 55%)`;
}

function microToAlgo(micro: number): string {
  return (micro / 1_000_000).toFixed(2);
}

const LoanCard: React.FC<LoanCardProps> = ({
  appId,
  borrower,
  goal,
  funded,
  repaid,
  status,
  tierRequired,
  lenderCount,
}) => {
  const navigate = useNavigate();
  const percentage = goal > 0 ? Math.min((funded / goal) * 100, 100) : 0;
  const truncatedAddr = borrower
    ? `${borrower.slice(0, 4)}...${borrower.slice(-4)}`
    : '????';
  const avatarChars = borrower ? borrower.slice(0, 4).toUpperCase() : '????';
  const avatarColor = addressToColor(borrower || '');

  const explorerUrl = `https://testnet.explorer.perawallet.app/application/${appId}`;

  return (
    <div className="loan-card card" onClick={() => navigate(`/loan/${appId}`)}>
      {/* Header */}
      <div className="loan-card-header">
        <div className="loan-card-identity">
          <div
            className="loan-avatar"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarChars}
          </div>
          <div className="loan-card-borrower-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="loan-card-address">{truncatedAddr}</span>
              <ReputationBadge address={borrower} />
            </div>
            <TierBadge tier={tierRequired} />
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress */}
      <div className="loan-card-progress">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="progress-text">
          <span className="progress-funded">
            <strong>{microToAlgo(funded)}</strong> ALGO funded
          </span>
          <span className="progress-goal">of {microToAlgo(goal)} ALGO goal</span>
        </div>
      </div>

      {/* Stats */}
      <div className="loan-card-stats">
        {lenderCount > 0 && (
          <span className="lender-count">
            👥 {lenderCount} lender{lenderCount !== 1 ? 's' : ''}
          </span>
        )}
        {repaid > 0 && (
          <span className="repaid-info">
            💰 {microToAlgo(repaid)} ALGO repaid
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="loan-card-footer">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="explorer-link"
          onClick={(e) => e.stopPropagation()}
        >
          View on Algorand ↗
        </a>
      </div>
    </div>
  );
};

export default LoanCard;
