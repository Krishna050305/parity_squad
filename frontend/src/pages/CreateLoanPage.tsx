import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLoan } from '../api';
import { signAndSendTxns } from '../wallet';

export const CreateLoanPage = () => {
    const navigate = useNavigate();
    const [goal, setGoal] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [tier, setTier] = useState<string>('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const borrower = localStorage.getItem("connectedAddress");
        if (!borrower) {
            setError("Please connect your wallet first.");
            return;
        }

        if (!goal || !duration) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            setLoading(true);
            const goalMicroAlgos = parseInt(goal) * 1_000_000;
            const durationDays = parseInt(duration);
            const tierRequired = parseInt(tier);

            // Fetch unsigned txns from the FastAPI backend
            const { txns } = await createLoan({
                borrower_address: borrower,
                goal_microalgos: goalMicroAlgos,
                duration_days: durationDays,
                tier_required: tierRequired
            });

            // Sign directly in the frontend using PeraWallet
            const txId = await signAndSendTxns(txns);
            
            navigate('/');
        } catch (err: any) {
            console.error("Failed to create loan:", err);
            setError(err.message || "An error occurred. Make sure your wallet is connected and active.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', backgroundColor: '#fafaf9', minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ background: 'white', padding: '3rem 2.5rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)', width: '100%', maxWidth: '480px', border: '1px solid #f3f4f6' }}>
                <h2 style={{ color: 'var(--brand-green)', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Create a New Loan Request</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                    Fill out the details below to open a loan on the LendPool contract.
                </p>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Goal Amount (ALGO)</label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="e.g. 100" 
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            style={{ 
                                padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', 
                                fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', 
                                borderColor: goal ? 'var(--brand-green)' : '#d1d5db' 
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Duration (Days)</label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="e.g. 30" 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Tier Badge Required from Lenders</label>
                        <select 
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="0">Tier 0 (Anyone)</option>
                            <option value="1">Tier 1 (Email verified)</option>
                            <option value="2">Tier 2 (Phone verified)</option>
                            <option value="3">Tier 3 (Govt ID hashed)</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            background: loading ? '#9ca3af' : 'var(--brand-green)',
                            color: 'white',
                            padding: '0.9rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '1rem',
                            transition: 'background-color 0.2s',
                            width: '100%'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Loan'}
                    </button>
                </form>
            </div>
        </div>
    );
};
