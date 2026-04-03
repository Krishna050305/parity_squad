import React from 'react';
import { demoReceipts, getInitials, getAvatarColor, getTrustColor, getRiskColor, formatCurrency } from '../data';
import { addGuarantor } from '../api';

interface GuarantorNotificationProps {
  borrowerName: string;
  borrowerWallet: string;
  loanAmount: number;
  trustScore: number;
  riskScore: number;
  onApprove: () => void;
  onDecline: () => void;
}

export const GuarantorNotification: React.FC<GuarantorNotificationProps> = ({
  borrowerName,
  borrowerWallet,
  loanAmount,
  trustScore,
  riskScore,
  onApprove,
  onDecline,
}) => {
  const trustColor = getTrustColor(trustScore);
  const riskColor = getRiskColor(riskScore);

  return (
    <div className="guarantor-notif">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-gold-dark)', margin: 0, fontSize: '1.2rem' }}>
          Guarantor Request
        </h3>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div className="avatar avatar-lg" style={{ background: getAvatarColor(borrowerName) }}>
          {getInitials(borrowerName)}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lp-slate)' }}>{borrowerName}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', fontFamily: 'monospace' }}>{borrowerWallet}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--lp-slate)', marginTop: '4px' }}>
            Loan requested: <span style={{ color: 'var(--lp-green)' }}>{formatCurrency(loanAmount)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-xl)', textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: trustColor }}>
              {trustScore}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lp-slate-muted)' }}>Trust</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: riskColor }}>
              {riskScore}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--lp-slate-muted)' }}>Risk</div>
          </div>
        </div>
      </div>

      {/* Past Loan History */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lp-slate)', marginBottom: 'var(--space-sm)' }}>
          Past Loan History
        </div>
        {demoReceipts.slice(0, 2).map(receipt => (
          <div key={receipt.id} style={{
            background: 'var(--lp-surface-raised)', padding: 'var(--space-md)',
            borderRadius: 'var(--radius-sm)', marginBottom: '6px',
            fontSize: '0.82rem', color: 'var(--lp-slate-light)', lineHeight: 1.5,
          }}>
            {receipt.borrowerName} — {formatCurrency(receipt.amount)} for {receipt.purpose} ({receipt.date}).
            On-time: {receipt.onTime}/{receipt.totalInstallments}.
            <span className="pill pill-paid" style={{ marginLeft: '8px' }}>CLOSED ✓</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApprove}>
          Approve as Guarantor
        </button>
        <button className="btn btn-outline" style={{ flex: 1, borderColor: 'var(--lp-danger)', color: 'var(--lp-danger)' }} onClick={onDecline}>
          Decline
        </button>
      </div>
    </div>
  );
};
