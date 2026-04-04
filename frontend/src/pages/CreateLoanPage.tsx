import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLoan, confirmLoanCreation } from '../api';
import { signAndSendTxns, connectWallet, getConnectedAddress } from '../wallet';
import { TxBadge } from '../components/TxBadge';
import { useSnackbar } from 'notistack';

export const CreateLoanPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const [goal, setGoal] = useState<string>('');
    const [duration, setDuration] = useState<string>('30');
    const [purpose, setPurpose] = useState<string>('');
    const [tier, setTier] = useState<string>(localStorage.getItem('lp_tier') || '0');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successTxId, setSuccessTxId] = useState<string | null>(null);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(getConnectedAddress());

    const handleConnect = async () => {
        const addr = await connectWallet();
        if (addr) setConnectedAddress(addr);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!connectedAddress) {
            setError("Please connect your wallet to broadcast to Algorand.");
            return;
        }

        if (!goal || !duration || !purpose) {
            setError("All fields are required to open a smart contract loan.");
            return;
        }

        try {
            setLoading(true);
            const goalMicroAlgos = parseInt(goal) * 1_000_000;
            const durationDays = parseInt(duration);
            const tierRequired = parseInt(tier);

            const { txns, loan_id } = await createLoan({
                borrower_address: connectedAddress,
                goal_microalgos: goalMicroAlgos,
                duration_days: durationDays,
                tier_required: tierRequired,
                purpose: purpose,
                category: 'Personal'
            });

            const { txId, appId } = await signAndSendTxns(txns);
            setSuccessTxId(txId);

            if (appId && loan_id) {
                await confirmLoanCreation(loan_id, appId);
            }

            enqueueSnackbar('Loan smart contract deployed!', { variant: 'success' });
        } catch (err: any) {
            enqueueSnackbar(err.message || "Deployment failed", { variant: 'error' });
            setError(err.message || "Failed to broadcast transaction.");
        } finally {
            setLoading(false);
        }
    };

    if (successTxId) {
        return (
            <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--lp-ivory)', minHeight: 'calc(100vh - 68px)' }}>
                <div className="card card-elevated" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--lp-green)', marginBottom: '1rem' }}>Your loan is live!</h2>
                    <p style={{ color: 'var(--lp-slate-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        The smart contract has been successfully deployed and initialized on the Algorand blockchain.
                    </p>
                    <div style={{ marginBottom: '2rem' }}>
                        <TxBadge txId={successTxId} />
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/borrower/dashboard')}>Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-md)' }}>
            <div className="container" style={{ maxWidth: '560px', margin: '0 auto' }}>
                <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--lp-green)', marginBottom: '8px' }}>
                        Final Step: Loan Setup
                    </h1>
                    <p style={{ color: 'var(--lp-slate-muted)', marginBottom: 'var(--space-2xl)' }}>
                        Configure your loan terms and deploy your request to the P2P network.
                    </p>

                    {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        <div>
                            <label className="form-label">Loan Purpose</label>
                            <textarea 
                                className="form-input" 
                                rows={3} 
                                value={purpose} 
                                onChange={e => setPurpose(e.target.value)}
                                placeholder="Describe why you need this loan (e.g. Health checkup, School fees)"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Amount (ALGO)</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    value={goal} 
                                    onChange={e => setGoal(e.target.value)}
                                    placeholder="e.g. 500"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Duration (Days)</label>
                                <input 
                                    className="form-input" 
                                    type="number" 
                                    value={duration} 
                                    onChange={e => setDuration(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Required Lender Tier</label>
                            <select className="form-input" value={tier} onChange={e => setTier(e.target.value)}>
                                <option value="0">Tier 0 (Unverified Ok)</option>
                                <option value="1">Tier 1 (Email Certified)</option>
                                <option value="2">Tier 2 (Phone Certified)</option>
                                <option value="3">Tier 3 (Gov ID Verified)</option>
                            </select>
                            <p style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)', marginTop: '4px' }}>
                                Lenders must have at least this Tier ASA badge to fund you.
                            </p>
                        </div>

                        {!connectedAddress ? (
                            <button type="button" className="btn btn-gold btn-lg" style={{ marginTop: 'var(--space-md)' }} onClick={handleConnect}>
                                Connect Wallet to Continue
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }} disabled={loading}>
                                {loading ? 'Deploying Contract...' : 'Create Loan Request →'}
                            </button>
                        )}
                        
                        {connectedAddress && (
                            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--lp-slate-muted)', marginTop: '8px' }}>
                                Broadcasting from: {connectedAddress.substring(0,8)}...{connectedAddress.slice(-4)}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

