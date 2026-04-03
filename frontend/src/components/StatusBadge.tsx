import React from 'react';
import './StatusBadge.css';

interface Props {
  status: string;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const normalized = status.toUpperCase();
  return (
    <span className={`status-badge status-${normalized.toLowerCase()}`}>
      {normalized}
    </span>
  );
};

export default StatusBadge;
