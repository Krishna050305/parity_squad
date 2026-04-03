import React from 'react';
import './TxBadge.css';

interface Props {
  txId: string;
}

const TxBadge: React.FC<Props> = ({ txId }) => {
  const truncated = `${txId.slice(0, 6)}...${txId.slice(-4)}`;
  const explorerUrl = `https://testnet.explorer.perawallet.app/tx/${txId}`;

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="tx-badge"
    >
      <span className="tx-check">✓</span>
      <span className="tx-text">Verified</span>
      <span className="tx-hash">{truncated}</span>
    </a>
  );
};

export default TxBadge;
