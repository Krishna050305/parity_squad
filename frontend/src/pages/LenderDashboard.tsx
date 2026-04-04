import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  categories, borrowerProfiles, demoLenderActivity,
  getInitials, getAvatarColor, getTrustColor, formatCurrency,
  type Category,
} from '../data';

import { getUserContributions } from '../api';

export const LenderDashboard = () => {
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterTrustMin, setFilterTrustMin] = useState(0);
  const [sortBy, setSortBy] = useState<'trust-high' | 'funding-low' | 'amount'>('trust-high');

  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<any[]>([]);
  const connectedAddress = localStorage.getItem('connectedAddress');

  useEffect(() => {
    if (connectedAddress) {
      getUserContributions(connectedAddress)
        .then(data => {
          setContributions(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [connectedAddress]);

  const filteredProfiles = useMemo(() => {
    let result = borrowerProfiles.filter(p => p.trustScore >= filterTrustMin);
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (sortBy === 'trust-high') result.sort((a, b) => b.trustScore - a.trustScore);
    else if (sortBy === 'funding-low') result.sort((a, b) => a.fundedPct - b.fundedPct);
    else result.sort((a, b) => b.amount - a.amount);
    return result;
  }, [filterCategory, filterTrustMin, sortBy]);

  // Derive portfolio from contributions
  const portfolio = useMemo(() => {
    const safeContribs = Array.isArray(contributions) ? contributions : [];
    const total = safeContribs.reduce((sum, c) => sum + (c.amount_microalgos || 0), 0) / 1e6;
    const active = safeContribs.filter(c => c.status !== 4).length; // status 4 is CLOSED
    return {
      totalLent: total * 100, // INR (approx)
      totalLentAlgo: total,
      activeLoans: active,
      expectedReturns: total * 1.08 * 100, // 8% interest mock
      repaidToDate: 0,
    };
  }, [contributions]);

  const fundedLoans = useMemo(() => {
    const safeContribs = Array.isArray(contributions) ? contributions : [];
    return safeContribs.map(c => ({
      borrower: c.borrower_name,
      amount: (c.amount_microalgos / 1e6) * 100, // INR
      amountAlgo: c.amount_microalgos / 1e6,
      date: new Date(c.contributed_at).toLocaleDateString(),
      status: c.status === 1 ? 'OPEN' : c.status === 2 ? 'FUNDED' : c.status === 3 ? 'REPAYING' : 'CLOSED',
      nextRepay: c.status === 3 ? 'Upcoming' : '—',
      expectedReturn: (c.amount_microalgos / 1e6) * 1.08 * 100,
    }));
  }, [contributions]);

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-xl)' }}>
          Lender Dashboard
        </h1>

        {/* ═══ Portfolio Overview ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div className="stat-card card-elevated">
            <div className="stat-card__value">{formatCurrency(portfolio.totalLent)}</div>
            <div className="stat-card__label">Total Lent</div>
          </div>
          <div className="stat-card card-elevated">
            <div className="stat-card__value">{portfolio.activeLoans}</div>
            <div className="stat-card__label">Active Loans</div>
          </div>
          <div className="stat-card card-elevated">
            <div className="stat-card__value">{formatCurrency(portfolio.expectedReturns)}</div>
            <div className="stat-card__label">Expected Returns</div>
          </div>
          <div className="stat-card card-elevated">
            <div className="stat-card__value">{formatCurrency(portfolio.repaidToDate)}</div>
            <div className="stat-card__label">Repaid to Date</div>
          </div>
        </div>

        {/* ═══ Browse Borrowers ═══ */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-md)' }}>
            Browse Borrowers
          </h2>

          {/* Filters */}
          <div className="filter-bar">
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)}>
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
              ))}
            </select>
            <select value={filterTrustMin} onChange={e => setFilterTrustMin(Number(e.target.value))}>
              <option value={0}>Any Trust Score</option>
              <option value={60}>Trust ≥ 60</option>
              <option value={70}>Trust ≥ 70</option>
              <option value={80}>Trust ≥ 80</option>
              <option value={90}>Trust ≥ 90</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="trust-high">Sort: Trust (High→Low)</option>
              <option value="funding-low">Sort: Most Needed</option>
              <option value="amount">Sort: Amount (High→Low)</option>
            </select>
            <span style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', marginLeft: 'auto' }}>
              {filteredProfiles.length} borrowers
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {filteredProfiles.map(profile => {
              const trustClass = profile.trustScore >= 80 ? 'trust-badge--high' : profile.trustScore >= 60 ? 'trust-badge--mid' : 'trust-badge--low';
              return (
                <div className="borrower-card card-elevated" key={profile.id}>
                  <div className="borrower-card__header">
                    <div className="avatar avatar-md" style={{ background: getAvatarColor(profile.name) }}>
                      {getInitials(profile.name)}
                    </div>
                    <div className="borrower-card__info">
                      <div className="borrower-card__name">{profile.name}</div>
                      <div className="borrower-card__location">{profile.state}</div>
                    </div>
                    <span className={`trust-badge ${trustClass}`}>
                      <span style={{ fontSize: '0.65rem' }}>⬣</span> {profile.trustScore}
                    </span>
                  </div>
                  <div className="borrower-card__amount">{formatCurrency(profile.amount)}</div>
                  <div className="borrower-card__reason">{profile.reason}</div>
                  <div className="borrower-card__meta">
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-bar__fill" style={{ width: `${profile.fundedPct}%` }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lp-green)', minWidth: '38px', textAlign: 'right' }}>{profile.fundedPct}%</span>
                  </div>
                  <div className="borrower-card__footer">
                    <span className="borrower-card__lenders">{profile.lenderCount} lenders</span>
                    <Link to={`/loan/${profile.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn btn-primary btn-sm">Lend Now →</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ My Funded Loans ═══ */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
            My Funded Loans
          </h2>
          <div className="card card-elevated table-wrapper" style={{ padding: 0 }}>
            <table className="lp-table">
              <thead>
                <tr>
                  <th>Borrower</th>
                  <th>Amount Lent</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Next Repayment</th>
                  <th>Expected Return</th>
                </tr>
              </thead>
              <tbody>
                {fundedLoans.map((loan, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{loan.borrower}</td>
                    <td style={{ color: 'var(--lp-green)', fontWeight: 600 }}>{formatCurrency(loan.amount)}</td>
                    <td>{loan.date}</td>
                    <td>
                      <span className={`pill ${loan.status === 'CLOSED' ? 'pill-paid' : loan.status === 'REPAYING' ? 'pill-upcoming' : 'pill-paid-late'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>{loan.nextRepay}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(loan.expectedReturn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ Repayment Timeline ═══ */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
            Repayment Timeline
          </h2>
          <div className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
            {[
              { date: 'May 15, 2025', from: 'Ramesh Patel', amount: 1800 },
              { date: 'May 22, 2025', from: 'Ananya Mishra', amount: 1080 },
              { date: 'Jun 05, 2025', from: 'Rohit Agarwal', amount: 2880 },
              { date: 'Jun 15, 2025', from: 'Ramesh Patel', amount: 1800 },
              { date: 'Jun 22, 2025', from: 'Ananya Mishra', amount: 1080 },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-md) 0',
                borderBottom: i < 4 ? '1px solid var(--lp-border-light)' : 'none',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--lp-green)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.date}</span>
                  <span style={{ color: 'var(--lp-slate-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>from {item.from}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--lp-green)', fontSize: '0.95rem' }}>+{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
