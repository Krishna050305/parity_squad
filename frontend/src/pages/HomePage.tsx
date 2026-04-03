import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLoans } from '../api';
import { LoanCard } from '../components/LoanCard';
import algosdk from 'algosdk';

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

export const HomePage = () => {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchLoans();
                if (res.applications) {
                    const parsed = res.applications.map((app: any) => {
                       const state = parseGlobalState(app.params['global-state'] || []);
                       return {
                           appId: app.id,
                           borrower: state.borrower || "Unknown",
                           goal: state.goal_amount || 0,
                           funded: state.funded_amount || 0,
                           repaid: state.repaid_amount || 0,
                           status: state.status || 1,
                           tierRequired: state.tier_required || 0,
                           lenderCount: 0 // Mock parameter
                       };
                    });
                    
                    // Filter loans strictly by the expected goal format existing
                    setLoans(parsed.filter((p: any) => p.goal > 0));
                }
            } catch (err) {
                console.error("Failed to load loans:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <div className="hero-gradient">
              <h1 style={{ fontSize: '4.5rem', fontWeight: 800, margin: '0 0 1.5rem 0', lineHeight: 1.1, letterSpacing: '-1px' }}>
                <span style={{ color: '#1f2937' }}>Community-Powered</span><br />
                <span className="text-gradient">P2P Lending on Algorand</span>
              </h1>
              <p style={{ fontSize: '1.35rem', color: 'var(--muted)', maxWidth: '750px', margin: '0 0 3rem 0', lineHeight: 1.6 }}>
                Borrow based on your community reputation. Lend to peers you trust. All securely executed on the Algorand blockchain.
              </p>
              <Link to="/create">
                <button className="btn-green">Get Started</button>
              </Link>
            </div>

            <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: '#fafaf9' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem', color: '#1f2937' }}>Why LendPool?</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                
                <div className="feature-card">
                  <div className="icon-wrapper">🛡️</div>
                  <h3 style={{ margin: 0, color: 'var(--brand-green)', fontSize: '1.4rem' }}>Decentralized</h3>
                </div>

                <div className="feature-card">
                  <div className="icon-wrapper">🔍</div>
                  <h3 style={{ margin: 0, color: 'var(--brand-green)', fontSize: '1.4rem' }}>Transparent</h3>
                </div>

              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '6rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Community Feed</h2>
                        <Link to="/create" style={{ textDecoration: 'none', color: 'var(--brand-green)', fontWeight: 600 }}>
                            + Post a Loan
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {[1,2,3].map(i => (
                                <div key={i} style={{ background: '#f9fafb', height: '240px', borderRadius: '16px', animation: 'pulse 1.5s infinite', border: '1px solid #eee' }}></div>
                            ))}
                        </div>
                    ) : loans.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
                            <h3 style={{ color: 'var(--text)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No active loans</h3>
                            <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Be the first to post your story to the community!</p>
                            <Link to="/create"><button className="btn-amber">Create Loan</button></Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {loans.map(loan => (
                                <LoanCard key={loan.appId} {...loan} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
