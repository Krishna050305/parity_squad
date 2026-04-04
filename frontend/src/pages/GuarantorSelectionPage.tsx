import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestGuarantor, getNotifications } from '../api';
import { DEMO_VOUCHERS, RAVI_KUMAR_RECEIPTS } from '../data/demoBorrowers';
import { getConnectedAddress } from '../wallet';
import { useSnackbar } from 'notistack';

export const GuarantorSelectionPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const connectedAddress = getConnectedAddress();

    // Candidates: Ravi Kumar and Venkat Rao (is_guarantor: true folks)
    const guarantors = DEMO_VOUCHERS.filter(v => v.name === 'Ravi Kumar' || v.name === 'Venkat Rao');

    const [expandedReceipts, setExpandedReceipts] = useState<Record<string, boolean>>({});
    const [confirmModal, setConfirmModal] = useState<any | null>(null);
    const [pendingGuarantor, setPendingGuarantor] = useState<any | null>(() => {
        const stored = localStorage.getItem('lp_pending_guarantor');
        return stored ? JSON.parse(stored) : null;
    });
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'declined'>('pending');

    useEffect(() => {
        if (!pendingGuarantor || approvalStatus !== 'pending') return;

        const interval = setInterval(async () => {
            try {
                if (!connectedAddress) return;
                const notifs = await getNotifications(connectedAddress);
                const approved = notifs.find((n: any) => n.sender_wallet === pendingGuarantor.wallet && n.type === 'guarantor_approved');
                const declined = notifs.find((n: any) => n.sender_wallet === pendingGuarantor.wallet && n.type === 'guarantor_declined');

                if (approved) {
                    setApprovalStatus('approved');
                    localStorage.setItem('lp_trust_path_status', 'approved');
                    clearInterval(interval);
                } else if (declined) {
                    setApprovalStatus('declined');
                    localStorage.setItem('lp_trust_path_status', 'declined');
                    clearInterval(interval);
                }
            } catch (err) {
                console.warn("Polling failed", err);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [pendingGuarantor, approvalStatus, connectedAddress]);

    const handleRequest = async (g: any) => {
        try {
            if (!connectedAddress) throw new Error("Please connect your wallet first.");
            await requestGuarantor(connectedAddress, g.wallet, 0);
            setPendingGuarantor(g);
            setApprovalStatus('pending');
            localStorage.setItem('lp_pending_guarantor', JSON.stringify(g));
            localStorage.setItem('lp_trust_path', 'guarantor');
            localStorage.setItem('lp_trust_path_status', 'pending');
            setConfirmModal(null);
            enqueueSnackbar(`Request sent to ${g.name}`, { variant: 'info' });
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    };

    const handleProceed = () => {
        navigate('/create-loan');
    };

    const handleReset = () => {
        setPendingGuarantor(null);
        setApprovalStatus('pending');
        localStorage.removeItem('lp_pending_guarantor');
        localStorage.removeItem('lp_trust_path');
        localStorage.removeItem('lp_trust_path_status');
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--lp-slate)', marginBottom: '8px' }}>
                    Choose a Guarantor
                </h1>
                <p style={{ color: 'var(--lp-slate-muted)', marginBottom: 'var(--space-2xl)' }}>
                    A guarantor fully backs your loan. They must verify your intent and approve on-chain.
                </p>

                {pendingGuarantor ? (
                    <div className="card card-elevated" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                        {approvalStatus === 'pending' && (
                            <div style={{ padding: '20px' }}>
                                <div className="pulse-indicator" style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
                                <h3 style={{ marginBottom: '8px' }}>Request sent to {pendingGuarantor.name}</h3>
                                <p style={{ color: 'var(--lp-slate-muted)', marginBottom: '24px' }}>Waiting for their approval. We check every 10 seconds.</p>
                            </div>
                        )}
                        {approvalStatus === 'approved' && (
                            <div style={{ padding: '20px', background: 'rgba(13,79,60,0.05)', borderRadius: '12px', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--lp-green)', marginBottom: '8px' }}>{pendingGuarantor.name} has approved! ✅</h3>
                                <p>You can now proceed to finalize your loan settings.</p>
                            </div>
                        )}
                        {approvalStatus === 'declined' && (
                            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', marginBottom: '24px' }}>
                                <h3 style={{ color: 'var(--lp-danger)', marginBottom: '8px' }}>{pendingGuarantor.name} has declined. ❌</h3>
                                <p>Please choose a different guarantor to continue.</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button className="btn btn-outline" onClick={handleReset}>
                                {approvalStatus === 'declined' ? 'Choose Different Guarantor' : 'Cancel Request'}
                            </button>
                            {approvalStatus === 'approved' && (
                                <button className="btn btn-primary" onClick={handleProceed}>Proceed to Loan Setup →</button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {guarantors.map(g => (
                            <div key={g.id} className="card card-elevated" style={{ padding: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div className="avatar avatar-md" style={{ background: '#0f172a' }}>{getInitials(g.name)}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {g.name}
                                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--lp-gold)', color: 'white', borderRadius: '12px' }}>Tier 3</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>{g.city || 'India'}</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => setConfirmModal(g)}>Request as Guarantor</button>
                                </div>

                                <div style={{ display: 'flex', gap: '32px', margin: '16px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--lp-slate-muted)', textTransform: 'uppercase' }}>Trust Score</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lp-green)' }}>{g.trust_score}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--lp-slate-muted)', textTransform: 'uppercase' }}>Risk Score</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--lp-gold)' }}>{100 - g.trust_score}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--lp-slate-muted)', textTransform: 'uppercase' }}>Guaranteed</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{g.loans_backed} loans</div>
                                    </div>
                                </div>

                                <div>
                                    <button 
                                        style={{ background: 'none', border: 'none', color: 'var(--lp-green)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                        onClick={() => setExpandedReceipts(prev => ({...prev, [g.id]: !prev[g.id]}))}
                                    >
                                        {expandedReceipts[g.id] ? 'Hide Profile Details ▲' : 'View Past Performance ▼'}
                                    </button>
                                    {expandedReceipts[g.id] && (
                                        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--lp-slate)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <p style={{ fontStyle: 'italic', color: 'var(--lp-slate-muted)' }}>"{g.tagline}"</p>
                                            <div style={{ borderLeft: '3px solid var(--lp-border-light)', paddingLeft: '12px' }}>
                                                <strong>Recent Receipts:</strong>
                                                <div style={{ color: 'var(--lp-slate-muted)', fontWeight: 300, marginTop: '4px' }}>
                                                  {RAVI_KUMAR_RECEIPTS[0].narrative}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Confirm Request</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--lp-slate)', marginBottom: '24px', lineHeight: 1.5 }}>
                            You are requesting <strong>{confirmModal.name}</strong> to guarantee your loan. They will be notified and must approve before you can proceed. If they decline, you can choose someone else.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setConfirmModal(null)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleRequest(confirmModal)}>Yes, Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

