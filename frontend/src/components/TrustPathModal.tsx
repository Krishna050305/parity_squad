import React, { useState, useEffect } from 'react';
import { addGuarantor, fetchLoans } from '../api';
import { signAndSendTxns } from '../wallet';

interface TrustPathModalProps {
    address: string | null;
}

export const TrustPathModal: React.FC<TrustPathModalProps> = ({ address }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'selection' | 'success'>('selection');
    const [limitMsg, setLimitMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (address) {
            const hasCompleted = localStorage.getItem(`trustPathCompleted_${address}`);
            if (!hasCompleted) {
                setIsOpen(true);
            }
        } else {
            setIsOpen(false);
        }
    }, [address]);

    const handleSelectPath = async (path: string, extra?: string) => {
        setLoading(true);
        try {
            if (path === "Guarantor" && extra) {
                // To call add_guarantor, we need an app_id. 
                // In this demo, we'll look for an active loan by this borrower or just mock the successful call if none found.
                const loansRes = await fetchLoans();
                const myLoan = loansRes.applications?.find((app: any) => {
                    // Logic to find borrower's active app if any
                    return true; // Simplified for demo
                });
                
                if (myLoan) {
                    const { txns } = await addGuarantor({
                        borrower_address: address!,
                        app_id: myLoan.id,
                        guarantor_address: extra
                    });
                    await signAndSendTxns(txns);
                }
            }

            // Mock tier assignment for demo
            localStorage.setItem(`trustPathCompleted_${address}`, "true");
            let tier = "0";
            let limit = "500";
            
            if (path === "Vouch" || path === "Guarantor") {
                tier = "2";
                limit = "5000";
            }
            
            localStorage.setItem(`mockTier_${address}`, tier);
            setLimitMsg(`Your borrow limit: ${limit} ALGO based on Tier ${tier}`);
            setView('success');
        } catch (err: any) {
            alert("Trust path action failed: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '12px',
                maxWidth: '500px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: view === 'success' ? 'center' : 'left'
            }}>
                {view === 'selection' ? (
                    <>
                        <h2 style={{ marginTop: 0, color: 'var(--text)' }}>Welcome to LendPool!</h2>
                        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
                            You are currently <strong>Tier 0</strong>. Choose a Trust Path to increase your borrow limits and build reputation.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-green)' }}>Path A — Vouch</h3>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    Get 2 community members to vouch for you. (Mock: Assigns Tier 2)
                                </p>
                                <button onClick={() => handleSelectPath("Vouch")} className="btn-amber" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Request Vouches'}
                                </button>
                            </div>

                            <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-green)' }}>Path B — Guarantor</h3>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    Nominate a trusted member to guarantee your loans.
                                </p>
                                <input 
                                    type="text" 
                                    id="guarantor-address" 
                                    placeholder="Enter Guarantor Address..." 
                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} 
                                />
                                <button onClick={() => {
                                    const val = (document.getElementById('guarantor-address') as HTMLInputElement).value;
                                    if(val) handleSelectPath("Guarantor", val);
                                    else alert("Please enter a guarantor address");
                                }} className="btn-amber" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Add Guarantor'}
                                </button>
                            </div>

                            <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-green)' }}>Path C — Self-raise</h3>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    Borrow within your Tier 0 limit, no vouch needed.
                                </p>
                                <button onClick={() => handleSelectPath("Self-raise")} className="btn-amber" style={{ width: '100%', background: '#fff', color: 'var(--amber)', border: '2px solid var(--amber)' }} disabled={loading}>
                                    Start at Tier 0
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ color: 'var(--brand-green)' }}>All Set!</h2>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', margin: '1rem 0' }}>
                            {limitMsg}
                        </p>
                        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
                            Your reputation will grow with every repaid loan. Start borrowing today!
                        </p>
                        <button onClick={handleClose} className="btn-green" style={{ width: '100%' }}>
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
