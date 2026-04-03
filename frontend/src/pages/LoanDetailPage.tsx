import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import algosdk from 'algosdk';
import { fetchLoanState, fetchLoanTxns, fundLoan, repayLoan, claimRepayment } from '../api';
import { signAndSendTxns } from '../wallet';
import { StatusBadge } from '../components/StatusBadge';
import { TierBadge } from '../components/TierBadge';
import { TxBadge } from '../components/TxBadge';

// Helper for parsing raw Algorand Indexer global state arrays
const parseGlobalState = (stateArray: any[]) => {
    const state: any = {};
    for (const item of stateArray) {
        const key = atob(item.key);
        if (item.value.type === 2) {
            state[key] = item.value.uint;
        } else if (item.value.type === 1 && item.value.bytes) {
            const rawBytes = Uint8Array.from(atob(item.value.bytes), c => c.charCodeAt(0));
            if (rawBytes.length === 32) {
                state[key] = algosdk.encodeAddress(rawBytes);
            } else {
                state[key] = atob(item.value.bytes);
            }
        }
    }
    return state;
};

export const LoanDetailPage = () => {
    const { appId } = useParams<{ appId: string }>();
    const application_id = parseInt(appId || '0');
    
    const [loan, setLoan] = useState<any>(null);
    const [txns, setTxns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [fundAmount, setFundAmount] = useState('');
    const [repayAmount, setRepayAmount] = useState('');
    
    const [actionLoading, setActionLoading] = useState(false);
    const [successfulTxId, setSuccessfulTxId] = useState<string | null>(null);

    const connectedAddress = localStorage.getItem("connectedAddress");

    const loadData = async () => {
        if (!application_id) return;
        try {
            setLoading(true);
            const stateRes = await fetchLoanState(application_id);
            const parsed = parseGlobalState(stateRes.state || []);
            
            setLoan({
                borrower: parsed.borrower || '',
                goal: parsed.goal_amount || 0,
                funded: parsed.funded_amount || 0,
                repaid: parsed.repaid_amount || 0,
                status: parsed.status || 1,
                tierRequired: parsed.tier_required || 0,
                deadline: parsed.deadline || 0
            });

            const txnsRes = await fetchLoanTxns(application_id);
            setTxns(txnsRes.transactions || []);
        } catch (err) {
            console.error("Load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [application_id]);

    const [error, setError] = useState<string | null>(null);

    const handleAction = async (actionFn: any, payload: any) => {
        setError(null);
        if (!connectedAddress) {
            setError("Connect wallet first!");
            return;
        }
        try {
            setActionLoading(true);
            const { txns: encodedTxns } = await actionFn(payload);
            const txId = await signAndSendTxns(encodedTxns);
            setSuccessfulTxId(txId);
            await loadData(); // Reload UI natively based on prompts
        } catch (err: any) {
            console.error(err);
            let msg = err.message || 'Action failed';
            if (msg.includes("Operation cancelled") || msg.includes("User Rejected")) {
                msg = "Transaction was rejected in the wallet.";
            } else if (msg.includes("overspend")) {
                msg = "Insufficient balance to complete this transaction.";
            }
            setError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Loan Details...</div>;
    }

    if (!loan) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loan not found</div>;
    }

    const isBorrower = connectedAddress === loan.borrower;
    const goalAlgo = loan.goal / 1e6;
    const fundedAlgo = loan.funded / 1e6;
    const pct = goalAlgo > 0 ? Math.min(100, Math.round((fundedAlgo / goalAlgo) * 100)) : 0;
    
    // Status mapping based on uint
    const statusMap: any = { 1: 'OPEN', 2: 'FUNDED', 3: 'REPAYING', 4: 'CLOSED', 5: 'DEFAULTED' };
    const statusStr = statusMap[loan.status] || 'UNKNOWN';

    const renderActionPanel = () => {
        if (statusStr === 'OPEN' && !isBorrower) {
            return (
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Fund this Loan</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input 
                            type="number" placeholder="Amount (ALGO)" 
                            value={fundAmount} onChange={e => setFundAmount(e.target.value)}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' }}
                        />
                        <button 
                            className="btn-green" onClick={() => handleAction(fundLoan, { lender_address: connectedAddress, app_id: application_id, amount_microalgos: parseInt(fundAmount) * 1e6 })}
                            disabled={actionLoading || !fundAmount}
                        >
                            {actionLoading ? 'Processing...' : 'Fund'}
                        </button>
                    </div>
                </div>
            );
        }

        if (statusStr === 'REPAYING' && isBorrower) {
            return (
                <div style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem' }}>
                    <h3 style={{ color: '#b45309', margin: '0 0 1rem 0' }}>Make Repayment</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input 
                            type="number" placeholder="Amount (ALGO)" 
                            value={repayAmount} onChange={e => setRepayAmount(e.target.value)}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #fcd34d', minWidth: '150px' }}
                        />
                        <button 
                            className="btn-amber" onClick={() => handleAction(repayLoan, { borrower_address: connectedAddress, app_id: application_id, amount_microalgos: parseInt(repayAmount) * 1e6 })}
                            disabled={actionLoading || !repayAmount}
                        >
                            {actionLoading ? 'Processing...' : 'Repay'}
                        </button>
                    </div>
                </div>
            );
        }

        if (statusStr === 'CLOSED') {
            return (
                <div style={{ background: '#fefce8', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Loan Closed</h3>
                    <button 
                        className="btn-green" onClick={() => handleAction(claimRepayment, { lender_address: connectedAddress, app_id: application_id })}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Claiming...' : 'Claim my share'}
                    </button>
                </div>
            );
        }

        return null; // Don't show confusing UI when nothing matches
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '3rem', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                {/* 1. Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                            Borrower: {loan.borrower.substring(0, 10)}...
                        </h1>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <TierBadge tier={loan.tierRequired} />
                            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                                Details masked on-chain
                            </span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <StatusBadge status={statusStr} />
                        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>
                            {Math.max(0, Math.ceil((loan.deadline - Date.now() / 1000) / 86400))} days remaining
                        </div>
                    </div>
                </div>

                {/* 2. Funding Progress */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--brand-green)' }}>{fundedAlgo} ALGO funded ({pct}%)</span>
                        <span style={{ color: 'var(--muted)' }}>{goalAlgo} ALGO Goal</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand-green)', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

                {successfulTxId && (
                    <div style={{ margin: '1rem 0' }}>
                        <TxBadge txId={successfulTxId} />
                    </div>
                )}

                {/* 3. Actions */}
                {renderActionPanel()}

                {/* 5. Explorer */}
                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
                    <a href={`https://testnet.explorer.perawallet.app/application/${application_id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>
                        View contract on Algorand Explorer ↗
                    </a>
                </div>
            </div>

            {/* 4. Transactions */}
            <h2 style={{ marginTop: '4rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Transaction History</h2>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                {txns.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No transactions yet.</div>
                ) : (
                    txns.map(tx => (
                        <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                                    {tx['tx-type'] === 'appl' ? 'Contract Call' : 'Payment'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                                    {new Date(tx['round-time'] * 1000).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {tx['tx-type'] === 'pay' && tx['payment-transaction'] && (
                                    <div style={{ fontWeight: 700, color: 'var(--brand-green)', marginBottom: '0.2rem' }}>
                                        {(tx['payment-transaction'].amount / 1e6).toFixed(2)} ALGO
                                    </div>
                                )}
                                <a href={`https://testnet.explorer.perawallet.app/tx/${tx.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', textDecoration: 'none' }}>
                                    {tx.id.substring(0,8)}... ↗
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
