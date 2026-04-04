import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunityVouchers, submitVouchPayment, requestGuarantor } from '../api';
import { DEMO_VOUCHERS } from '../data/demoBorrowers';
import { signAndSendTxns, getConnectedAddress } from '../wallet';
import { useSnackbar } from 'notistack';

export const VouchSelectionPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch vouchers
    getCommunityVouchers()
      .then(data => {
        if (data && data.length > 0) setVouchers(data);
        else setVouchers(DEMO_VOUCHERS);
      })
      .catch((err) => {
        console.warn("Failed to fetch vouchers from API, falling back to DEMO_VOUCHERS", err);
        setVouchers(DEMO_VOUCHERS);
      });
  }, []);

  const toggleSelect = (id: string) => {
    if (paidIds.includes(id)) return; // Cannot deselect paid
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= 2) return prev; // Max 2
      return [...prev, id];
    });
  };

  const selectedVouchers = vouchers.filter(v => selectedIds.includes(v.id));

  const handlePay = async (voucher: any) => {
    setLoadingPaymentId(voucher.id);
    try {
      const borrowerAddr = getConnectedAddress();
      if (!borrowerAddr) throw new Error("Wallet not connected");

      // Build txn from backend
      const { txns } = await submitVouchPayment(borrowerAddr, voucher.wallet);
      
      // Sign and send via Pera
      await signAndSendTxns(txns);

      // Successfully paid!
      setPaidIds(prev => [...prev, voucher.id]);
      enqueueSnackbar(`Successfully paid vouch fee to ${voucher.name}`, { variant: 'success' });

      // Notify backend via requestGuarantor as instructed for linking
      try {
          await requestGuarantor(borrowerAddr, voucher.wallet, 0);
      } catch (e) {
          console.warn("Could not register vouch relationship fallback", e);
      }

    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || 'Payment failed', { variant: 'error' });
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const handleProceed = () => {
    const paidNames = vouchers.filter(v => paidIds.includes(v.id)).map(v => v.name);
    // Store localized loan setup context
    localStorage.setItem('lp_vouch_done', 'true');
    localStorage.setItem('lp_trust_path', 'vouch');
    localStorage.setItem('lp_vouchers', JSON.stringify(paidNames));
    
    navigate('/create-loan');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const getAvatarColor = (name: string) => {
    const colors = ['#0d4f3c', '#ca8a04', '#0f172a', '#3b82f6', '#8b5cf6'];
    const idx = name.length % colors.length;
    return colors[idx];
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)', paddingBottom: '160px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>
          Select Your Vouchers
        </h1>
        <p style={{ color: 'var(--lp-slate-muted)', marginBottom: 'var(--space-2xl)', fontSize: '0.95rem' }}>
          Choose up to 2 trusted community members to vouch for you. Each voucher receives ₹500 for auditing your request.
        </p>

        {/* Voucher Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 'var(--space-lg)'
        }}>
          {vouchers.map(v => {
            const isSelected = selectedIds.includes(v.id);
            const isPaid = paidIds.includes(v.id);
            const isMaxedOut = selectedIds.length >= 2;
            const isDimmed = !isSelected && isMaxedOut;
            const trustColor = v.trust_score >= 80 ? 'green' : 'var(--lp-gold)';

            return (
              <div
                key={v.id}
                style={{
                    background: 'white', border: isSelected ? '2px solid var(--lp-green)' : '1px solid var(--lp-border-light)',
                    borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', cursor: isPaid ? 'default' : 'pointer',
                    opacity: isDimmed ? 0.5 : 1, pointerEvents: isDimmed ? 'none' : 'auto',
                    position: 'relative', transition: 'all 0.2s', boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                }}
                onClick={() => !isPaid && toggleSelect(v.id)}
              >
                {isPaid && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--lp-green)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    PAID ✓
                  </div>
                )}
                {isSelected && !isPaid && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSelect(v.id); }}
                    style={{ position: 'absolute', top: 12, right: 12, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Deselect
                  </button>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="avatar avatar-lg" style={{ background: getAvatarColor(v.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', width: 48, height: 48, borderRadius: '50%' }}>
                    {getInitials(v.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--lp-slate)' }}>{v.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)' }}>{v.city || 'India'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: trustColor, fontWeight: 800, fontSize: '1.1rem' }}>{v.trust_score}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--lp-slate-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trust</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--lp-slate-light)', fontStyle: 'italic', marginBottom: 'var(--space-sm)', lineHeight: 1.5 }}>
                  "{v.tagline}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--lp-green)', fontWeight: 600 }}>{v.loans_backed} loans backed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Checkout Bar */}
        {selectedIds.length > 0 && (
            <div style={{
                position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                background: 'white', border: '1px solid var(--lp-border-light)', width: '90%', maxWidth: '900px',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg) var(--space-xl)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>
                        Selected: {selectedVouchers.map(v => v.name).join(', ')}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--lp-slate-muted)' }}>
                        Total: <strong style={{ color: 'var(--lp-green)' }}>₹{selectedIds.length * 500}</strong>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedVouchers.map(v => {
                        const paid = paidIds.includes(v.id);
                        const loading = loadingPaymentId === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => handlePay(v)}
                                disabled={paid || loading || loadingPaymentId !== null}
                                style={{
                                    flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
                                    background: paid ? 'var(--lp-border-light)' : 'var(--lp-green)',
                                    color: paid ? 'var(--lp-slate-muted)' : 'white',
                                    fontWeight: 600, cursor: (paid || loading) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {paid ? `Paid ✓` : loading ? 'Processing...' : `Pay ₹500 to ${v.name} →`}
                            </button>
                        );
                    })}
                    
                    <button
                        onClick={handleProceed}
                        disabled={paidIds.length !== 2}
                        style={{
                            flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
                            background: paidIds.length === 2 ? 'var(--lp-gold)' : 'var(--lp-border)',
                            color: paidIds.length === 2 ? 'white' : 'var(--lp-slate-muted)',
                            fontWeight: 600, cursor: paidIds.length === 2 ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Proceed to Loan Setup ↗
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
