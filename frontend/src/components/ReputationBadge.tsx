import React from 'react';
import './ReputationBadge.css';

interface Props {
  address: string;
}

// Deterministically generate a mock reputation score between 30 and 99 for demo
const mockScore = (addr: string) => {
  if (!addr) return 0;
  let hash = 0;
  for (let i = 0; i < addr.length; i++) hash = (hash << 5) - hash + addr.charCodeAt(i);
  // Ensure we get a consistent number 30-99
  return 30 + (Math.abs(hash) % 70);
};

const ReputationBadge: React.FC<Props> = ({ address }) => {
  if (!address) return null;
  
  // Real implementation would query Indexer for CLOSED loans vs Total Loans
  let score = mockScore(address);
  
  // Custom case for testing/demo presentation specifically:
  // If we've interacted locally, let's just make it look good for the demo presenter
  const locallyStoredTier = localStorage.getItem(`lendpool_tier_${address}`);
  if (locallyStoredTier && parseInt(locallyStoredTier) > 0) {
     score = Math.max(score, 85); // bump up score if they got vouched/guarantor
  }

  let colorClass = 'rep-red';
  if (score >= 70) colorClass = 'rep-green';
  else if (score >= 40) colorClass = 'rep-amber';

  return (
    <div className="reputation-badge" title="Community Reputation Score based on repayment history">
      <div className={`rep-dot ${colorClass}`} />
      <span>Rep: {score}%</span>
    </div>
  );
};

export default ReputationBadge;
