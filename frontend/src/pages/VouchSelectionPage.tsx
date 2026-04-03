import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voucherCandidates, getInitials, getAvatarColor, getTrustColor } from '../data';

export const VouchSelectionPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= 2) return prev; // Max 2
      return [...prev, id];
    });
  };

  const totalPayment = selected.length * 500;

  const handleConfirm = () => {
    // Mock: store vouch completion and navigate back to auth wizard step 3
    localStorage.setItem('lp_vouch_done', 'true');
    localStorage.setItem('lp_role', 'borrower');
    localStorage.setItem('lp_user', JSON.stringify({ name: 'New Borrower', tier: 2, trustPath: 'vouch' }));
    navigate('/borrower/dashboard');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>
          Select Your Vouchers
        </h1>
        <p style={{ color: 'var(--lp-slate-muted)', marginBottom: 'var(--space-2xl)', fontSize: '0.95rem' }}>
          Choose up to 2 trusted community members to vouch for you. Each voucher receives ₹500.
        </p>

        {/* Voucher Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {voucherCandidates.map(v => {
            const isSelected = selected.includes(v.id);
            const trustColor = getTrustColor(v.trustScore);
            const trustClass = v.trustScore >= 80 ? 'trust-badge--high' : v.trustScore >= 60 ? 'trust-badge--mid' : 'trust-badge--low';

            return (
              <div
                key={v.id}
                className={`voucher-card ${isSelected ? 'voucher-card--selected' : ''}`}
                onClick={() => toggleSelect(v.id)}
                id={`voucher-${v.id}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="avatar avatar-lg" style={{ background: getAvatarColor(v.name), position: 'relative' }}>
                    {getInitials(v.name)}
                    {isSelected && (
                      <div style={{
                        position: 'absolute', bottom: -2, right: -2,
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: 'var(--lp-green)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', border: '2px solid white',
                      }}>✓</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--lp-slate)' }}>{v.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)' }}>{v.city}</div>
                  </div>
                  <span className={`trust-badge ${trustClass}`}>
                    <span style={{ fontSize: '0.65rem' }}>⬣</span> {v.trustScore}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--lp-slate-light)', fontStyle: 'italic', marginBottom: 'var(--space-sm)', lineHeight: 1.5 }}>
                  "{v.tagline}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--lp-slate-muted)' }}>{v.loansBacked} loans backed</span>
                  <span style={{ color: 'var(--lp-slate-muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{v.walletPrefix}</span>
                </div>

                {isSelected && (
                  <div style={{
                    marginTop: 'var(--space-md)', padding: '8px 12px',
                    background: 'rgba(13,79,60,0.04)', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem', color: 'var(--lp-green)', fontWeight: 600,
                  }}>
                    Pay ₹500 to {v.name} — {v.walletPrefix}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: 'var(--lp-surface)', border: '1px solid var(--lp-border-light)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg) var(--space-xl)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--lp-slate)', fontSize: '1rem' }}>
              Selected: {selected.length}/2
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>
              Total Payment: ₹{totalPayment.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleConfirm}
            disabled={selected.length < 2}
          >
            Pay & Confirm →
          </button>
        </div>
      </div>
    </div>
  );
};
