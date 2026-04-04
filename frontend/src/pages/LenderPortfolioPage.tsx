import React, { useState, useMemo, useEffect } from 'react';
import { getUserContributions, getNotifications } from '../api';
import { formatCurrency } from '../data';

export const LenderPortfolioPage = () => {
    const connectedAddress = localStorage.getItem('connectedAddress');
    const [loading, setLoading] = useState(true);
    const [contributions, setContributions] = useState<any[]>([]);

    useEffect(() => {
        if (connectedAddress) {
            getUserContributions(connectedAddress)
            .then(data => setContributions(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
        }
    }, [connectedAddress]);

    const portfolio = useMemo(() => {
        const total = contributions.reduce((sum, c) => sum + (c.amount_microalgos || 0), 0) / 1e6;
        const active = contributions.filter(c => c.status !== 4).length; 
        return {
          totalLent: total * 100, // INR (approx)
          activeLoans: active,
          expectedReturns: total * 1.08 * 100, // 8% interest mock
          repaidToDate: 0,
        };
    }, [contributions]);

    const fundedLoans = useMemo(() => {
        return contributions.map(c => ({
          borrower: c.borrower_name || 'Borrower',
          amount: (c.amount_microalgos / 1e6) * 100, // INR
          date: new Date(c.contributed_at).toLocaleDateString(),
          status: c.status === 1 ? 'OPEN' : c.status === 2 ? 'FUNDED' : c.status === 3 ? 'REPAYING' : 'CLOSED',
          nextRepay: c.status === 3 ? 'Upcoming' : '—',
          expectedReturn: (c.amount_microalgos / 1e6) * 1.08 * 100,
        }));
    }, [contributions]);

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-xl)' }}>
              My Portfolio
            </h1>

            {/* Total Stats */}
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
                    <div className="stat-card__value">{formatCurrency(portfolio.repaidToDate)}</div>
                    <div className="stat-card__label">Repaid to Date</div>
                </div>
                <div className="stat-card card-elevated">
                    <div className="stat-card__value">{formatCurrency(portfolio.expectedReturns)}</div>
                    <div className="stat-card__label">Outstanding</div>
                </div>
            </div>

            {/* Loans Table */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
              Lent Loans
            </h2>
            <div className="card card-elevated table-wrapper" style={{ padding: 0, marginBottom: 'var(--space-2xl)' }}>
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

            {/* Repayment calendar simplified */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
              Repayment Timeline
            </h2>
            <div className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                    <div style={{ fontSize: '2rem' }}>🗓️</div>
                    <p>Coming Soon: Dynamic Repayment Calendar View</p>
                </div>
            </div>
          </div>
        </div>
    );
};
