import React from 'react';
import './TierBadge.css';

interface Props {
  tier: number;
}

const TIER_LABELS: Record<number, string> = {
  0: 'Anyone',
  1: 'Verified',
  2: 'Trusted',
  3: 'Established',
  4: 'Elite',
};

const TierBadge: React.FC<Props> = ({ tier }) => {
  const label = TIER_LABELS[tier] ?? `Tier ${tier}`;
  return (
    <span className={`tier-badge tier-${tier}`}>
      Tier {tier} · {label}
    </span>
  );
};

export default TierBadge;
