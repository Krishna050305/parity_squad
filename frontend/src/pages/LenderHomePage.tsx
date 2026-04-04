import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  categories, borrowerProfiles, getInitials, getAvatarColor, formatCurrency, type Category 
} from '../data';
import { getUserContributions, getNotifications, approveGuarantorRequest, declineGuarantorRequest, fetchLoans as getLoans } from '../api';
import { useSnackbar } from 'notistack';
import { signAndSendTxns } from '../wallet';

export const LenderHomePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const connectedAddress = localStorage.getItem('connectedAddress');
  const storedUser = JSON.parse(localStorage.getItem('lp_user') || '{}');

  // State
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [trustMin, setTrustMin] = useState(0);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 50000]);
  const [onlyNeedsFunding, setOnlyNeedsFunding] = useState(false);
  const [sortBy, setSortBy] = useState<'urgent' | 'trust' | 'funding'>('urgent');

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [loansData, contribsData, notifsData] = await Promise.all([
                getLoans(),
                connectedAddress ? getUserContributions(connectedAddress) : Promise.resolve([]),
                connectedAddress ? getNotifications(connectedAddress) : Promise.resolve([])
            ]);
            setLoans(loansData);
            setContributions(contribsData);
            setNotifications(notifsData);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [connectedAddress]);

  // Merge Demo + Real Loans
  const allBorrowers = useMemo(() => {
     // Start with demo
     let list = [...borrowerProfiles];
     // Map real loans (this is a simplified merge)
     // In a real app we'd deduplicate or match IDs
     return list; 
  }, []);

  const filteredBorrowers = useMemo(() => {
    let result = allBorrowers;

    if (selectedCategories.length > 0) {
        result = result.filter(b => selectedCategories.includes(b.category));
    }

    result = result.filter(b => b.trustScore >= trustMin);
    result = result.filter(b => b.amount >= amountRange[0] && b.amount <= amountRange[1]);

    if (onlyNeedsFunding) {
        result = result.filter(b => b.fundedPct < 100);
    }

    if (sortBy === 'trust') result.sort((a, b) => b.trustScore - a.trustScore);
    else if (sortBy === 'funding') result.sort((a, b) => a.fundedPct - b.fundedPct);
    // 'urgent' logic simplified: days left ASC
    else result.sort((a, b) => (a as any).daysLeft - (b as any).daysLeft);

    return result;
  }, [allBorrowers, selectedCategories, trustMin, amountRange, onlyNeedsFunding, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = contributions.reduce((sum, c) => sum + (c.amount_microalgos || 0), 0) / 1e6;
    const active = contributions.filter(c => c.status !== 4).length;
    return {
        totalLent: total * 100, // INR
        activeLoans: active,
        repaidCount: contributions.filter(c => c.status === 4).length,
        avgRepayment: 100 // placeholder
    };
  }, [contributions]);

  const handleApproveGuarantor = async (notificationId: string) => {
    if (!connectedAddress) return;
    try {
        const res = await approveGuarantorRequest(notificationId, connectedAddress);
        if (res.txns && res.txns.length > 0) {
            await signAndSendTxns(res.txns);
            enqueueSnackbar('Guarantor added on-chain!', { variant: 'success' });
        } else {
            enqueueSnackbar('Request approved!', { variant: 'success' });
        }
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (e: any) {
        enqueueSnackbar(e.message || 'Approval failed', { variant: 'error' });
    }
  };

  return (
    <div className="lender-home" style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-2xl)', padding: 'var(--space-2xl) 0' }}>
        
        {/* SIDEBAR */}
        <aside className="lender-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Identity Card */}
            <div className="card card-elevated" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div className="avatar avatar-md" style={{ background: getAvatarColor(storedUser.name || 'Lender') }}>
                        {getInitials(storedUser.name || 'L')}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>{storedUser.name || 'Community Lender'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)', fontFamily: 'monospace' }}>
                            {connectedAddress?.slice(0, 8)}...{connectedAddress?.slice(-4)}
                        </div>
                    </div>
                </div>
                <div style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--lp-green)', color: 'white', borderRadius: '4px', display: 'inline-block', fontWeight: 600 }}>Role: Lender</div>
                <div style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                    <strong>Trust Score:</strong> <span style={{ color: 'var(--lp-green)', fontWeight: 700 }}>85</span>
                </div>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--lp-border-light)' }} />
                
                <h4 style={{ fontSize: '0.8rem', color: 'var(--lp-slate-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>My Impact Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Total Lent</span>
                        <strong>{formatCurrency(stats.totalLent)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Active Loans</span>
                        <strong>{stats.activeLoans}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Fully Repaid</span>
                        <strong>{stats.repaidCount}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Repayment Rate</span>
                        <strong style={{ color: 'var(--lp-green)' }}>{stats.avgRepayment}%</strong>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card card-elevated" style={{ padding: 'var(--space-lg)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Filters</h4>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-slate-muted)', display: 'block', marginBottom: '8px' }}>CATEGORIES</label>
                    {categories.map(cat => (
                        <label key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat.key)} 
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedCategories([...selectedCategories, cat.key]);
                                    else setSelectedCategories(selectedCategories.filter(c => c !== cat.key));
                                }}
                            />
                            {cat.label}
                        </label>
                    ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-slate-muted)', display: 'block', marginBottom: '8px' }}>MIN TRUST SCORE: {trustMin}</label>
                    <input type="range" min="0" max="100" value={trustMin} onChange={(e) => setTrustMin(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-slate-muted)', display: 'block', marginBottom: '8px' }}>AMOUNT: UP TO {formatCurrency(amountRange[1])}</label>
                    <input type="range" min="0" max="50000" step="1000" value={amountRange[1]} onChange={(e) => setAmountRange([0, Number(e.target.value)])} style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={onlyNeedsFunding} onChange={(e) => setOnlyNeedsFunding(e.target.checked)} />
                        Needs funding only
                    </label>
                </div>

                <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lp-slate-muted)', display: 'block', marginBottom: '8px' }}>SORT BY</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--lp-border)' }}>
                        <option value="urgent">Most Urgent</option>
                        <option value="trust">Highest Trust</option>
                        <option value="funding">Lowest Funded %</option>
                    </select>
                </div>
            </div>

            {/* Why be a lender Section */}
            <div className="card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--lp-border-light)', background: 'transparent' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--lp-slate)', marginBottom: '12px', borderBottom: '1px solid var(--lp-border-light)', paddingBottom: '8px' }}>What lenders get</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Principal returned</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>When borrower repays, you get back exactly what you lent.</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Community trust</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>Your lender score grows. Future features will unlock.</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Transparent chain</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>Every rupee tracked on Algorand. No hidden fees.</div>
                    </div>
                </div>
            </div>
        </aside>

        {/* MAIN AREA */}
        <main>
           <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>Browse Borrowers</h1>
                <p style={{ color: 'var(--lp-slate-muted)' }}>{filteredBorrowers.length} borrowers currently seeking funding</p>
           </div>

           {/* Notification Banner */}
           {notifications.filter(n => n.type === 'guarantor_request' && n.status === 'pending').map(notif => (
             <div key={notif.id} style={{ 
                background: 'white', border: '1px solid var(--lp-gold)', borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', boxShadow: '0 4px 6px rgba(202, 138, 4, 0.1)', borderLeft: '4px solid var(--lp-gold)'
             }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="avatar" style={{ background: '#fef3c7', color: '#92400e' }}>?</div>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>New guarantor request from {notif.sender_wallet.substring(0,8)}...</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>
                            Loan amount: ₹22,000 · Category: Medical · Trust Score: 74
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => declineGuarantorRequest(notif.id)}>Decline ✗</button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleApproveGuarantor(notif.id)}>Approve ✓</button>
                </div>
             </div>
           ))}

           {/* Grid */}
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
                {filteredBorrowers.map(b => {
                    const trustColor = b.trustScore >= 80 ? 'var(--lp-green)' : 'var(--lp-gold)';
                    return (
                        <div key={b.id} className="borrower-card card-elevated" style={{ padding: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: getAvatarColor(b.name) }}>{getInitials(b.name)}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{b.name}</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'white', background: 'var(--lp-green)', padding: '2px 6px', borderRadius: '4px' }}>{b.category}</div>
                            </div>
                            
                            <div style={{ fontSize: '0.85rem', height: '40px', overflow: 'hidden', color: 'var(--lp-slate)', marginBottom: '12px' }}>{b.reason}</div>
                            
                            <div style={{ margin: '12px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                                    <span>Funding Progress</span>
                                    <strong>{b.fundedPct}%</strong>
                                </div>
                                <div className="progress-bar"><div className="progress-bar__fill" style={{ width: `${b.fundedPct}%` }} /></div>
                                <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>{formatCurrency(b.amount)}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ flex: 1, textAlign: 'center', padding: '4px', background: '#f8fafc', borderRadius: '4px' }}>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--lp-slate-muted)' }}>TRUST</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: trustColor }}>{b.trustScore}</div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', padding: '4px', background: '#f8fafc', borderRadius: '4px' }}>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--lp-slate-muted)' }}>RISK</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lp-gold)' }}>{100 - b.trustScore}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--lp-slate-muted)' }}>
                                    {b.lenderCount} lenders
                                </div>
                                <Link to={`/loan/${b.id}`}>
                                    <button className="btn btn-primary btn-sm">View & Lend →</button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
           </div>
        </main>
      </div>
    </div>
  );
};
