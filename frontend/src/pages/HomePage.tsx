import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLoans } from '../api';
import LoanCard from '../components/LoanCard';
import './HomePage.css';

interface LoanData {
  appId: number;
  borrower: string;
  goal: number;
  funded: number;
  repaid: number;
  status: string;
  tierRequired: number;
  lenderCount: number;
}

const HomePage = () => {
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLoans();
      const loanList: LoanData[] = (data.loans || [])
        .filter((l: any) => l.state && !l.error)
        .map((loan: any) => ({
          appId: loan.app_id,
          borrower: loan.state?.borrower || loan.creator || '',
          goal: loan.state?.goal_amount || 0,
          funded: loan.state?.funded_amount || 0,
          repaid: loan.state?.repaid_amount || 0,
          status: loan.state?.status_label || 'UNKNOWN',
          tierRequired: loan.state?.tier_required || 0,
          lenderCount: 0, // not tracked on-chain in global state
        }));
      setLoans(loanList);
    } catch (err: any) {
      setError(err.message || 'Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Community-Powered <br />
            <span className="text-gradient">P2P Lending on Algorand</span>
          </h1>
          <p className="hero-subtitle">
            Borrow based on your community reputation. Lend to peers you trust.
            All securely executed on the Algorand blockchain.
          </p>
          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary btn-lg">
              Create a Loan
            </Link>
          </div>
        </div>
      </section>

      {/* Community Feed */}
      <section className="community-feed page-container">
        <h2 className="section-title">🌱 Community Feed</h2>
        <p className="section-subtitle">Active loans from community members looking for support</p>

        {/* Loading Skeletons */}
        {loading && (
          <div className="loan-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card card">
                <div className="skeleton-header">
                  <div className="skeleton-avatar skeleton-shimmer" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }} />
                    <div className="skeleton-line skeleton-shimmer" style={{ width: '40%' }} />
                  </div>
                </div>
                <div className="skeleton-bar skeleton-shimmer" />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '50%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="feed-state error-state">
            <div className="state-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadLoans}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && loans.length === 0 && (
          <div className="feed-state empty-state">
            <div className="state-icon">🌿</div>
            <h3>No active loans yet</h3>
            <p>Be the first to post a loan and grow the community!</p>
            <Link to="/create" className="btn btn-primary">
              Create a Loan
            </Link>
          </div>
        )}

        {/* Loan Grid */}
        {!loading && !error && loans.length > 0 && (
          <div className="loan-grid">
            {loans.map((loan) => (
              <LoanCard
                key={loan.appId}
                appId={loan.appId}
                borrower={loan.borrower}
                goal={loan.goal}
                funded={loan.funded}
                repaid={loan.repaid}
                status={loan.status}
                tierRequired={loan.tierRequired}
                lenderCount={loan.lenderCount}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features page-container">
        <h2 className="section-title">Why LendPool?</h2>
        <div className="feature-grid">
          <div className="card feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Decentralized</h3>
            <p>No middlemen. Smart contracts securely hold funds and enforce logic automatically.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Transparent</h3>
            <p>Every loan state and transaction is public on the ledger, fostering a trustless environment.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🏅</div>
            <h3>Community-Based</h3>
            <p>Reputation matters. Higher community tiers unlock better borrowing limits and terms.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
