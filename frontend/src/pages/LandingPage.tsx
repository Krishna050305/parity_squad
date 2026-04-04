import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connectWallet } from '../wallet';
import {
  categories, borrowerProfiles, testimonials,
  getInitials, getAvatarColor, getTrustColor, formatCurrency, getRiskColor,
  type Category, type BorrowerProfile,
} from '../data';

/* ── Particle Background ──────────────────────────────────────── */
const Particles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 6,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      opacity: 0.04 + Math.random() * 0.06,
    })), []);

  return (
    <div className="particles">
      {particles.map(p => (
        <span key={p.id} style={{
          left: p.left,
          width: p.size, height: p.size,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          opacity: p.opacity,
        }} />
      ))}
    </div>
  );
};

/* ── Borrower Card ────────────────────────────────────────────── */
interface BorrowerCardProps {
  profile: BorrowerProfile;
  onLendClick?: (profile: BorrowerProfile) => void;
}
const BorrowerCard = ({ profile, onLendClick }: BorrowerCardProps) => {
  const trustColor = getTrustColor(profile.trustScore);
  const trustClass = profile.trustScore >= 80 ? 'trust-badge--high' : profile.trustScore >= 60 ? 'trust-badge--mid' : 'trust-badge--low';

  return (
    <div className="borrower-card card-elevated" id={`borrower-${profile.id}`}>
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
        <span className="borrower-card__lenders">
          {profile.lenderCount} lender{profile.lenderCount !== 1 ? 's' : ''} contributed
        </span>
        {onLendClick ? (
          <button className="btn btn-primary btn-sm" onClick={() => onLendClick(profile)}>Lend Now →</button>
        ) : (
          <Link to={`/loan/${profile.id}`} style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary btn-sm">Lend Now →</button>
          </Link>
        )}
      </div>
    </div>
  );
};

/* ── Lend Now Modal ───────────────────────────────────────────── */
const LendNowModal = ({ 
  profile, 
  onClose, 
  onProceed 
}: { 
  profile: BorrowerProfile; 
  onClose: () => void;
  onProceed: (amount: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const neededAmount = Math.max(0, profile.amount - (profile.amount * profile.fundedPct / 100));
  
  // Tier limits mock (Tier 0 -> Tier 4 roughly)
  const maxLimit = Math.min(neededAmount, profile.trustScore >= 80 ? 50000 : 5000); 

  const isValid = amount > 0 && amount <= maxLimit;

  const handleNext = async () => {
    if (!isValid) return;
    try {
      setConnecting(true);
      setError(null);
      await connectWallet();
      onProceed(amount);
    } catch (err: any) {
      setError(err?.message || 'Wallet connection failed');
      setConnecting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card card-elevated" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'transparent',
          border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--lp-slate-muted)'
        }}>&times;</button>
        
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-green)', marginBottom: 'var(--space-md)' }}>Fund a Dream</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div className="avatar avatar-md" style={{ background: getAvatarColor(profile.name) }}>
            {getInitials(profile.name)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>{profile.reason}</div>
          </div>
        </div>

        <div style={{ background: 'var(--lp-surface-raised)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Requested</span>
            <strong style={{ color: 'var(--lp-slate)' }}>{formatCurrency(profile.amount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Remaining Needed</span>
            <strong style={{ color: 'var(--lp-green)' }}>{formatCurrency(neededAmount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Risk Tier</span>
            <span className={`trust-badge ${profile.trustScore >= 80 ? 'trust-badge--high' : 'trust-badge--mid'}`}>
              Trust: {profile.trustScore}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label className="form-label">Amount to Lend (ALGO)</label>
          <input 
            type="number" 
            className="form-input" 
            placeholder={`Max ${maxLimit} ALGO`}
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {amount > maxLimit && (
            <div style={{ color: 'var(--lp-danger)', fontSize: '0.8rem', marginTop: '4px' }}>
              Amount exceeds limit ({maxLimit} ALGO max)
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: 'var(--lp-danger)', fontSize: '0.85rem', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }} 
          disabled={!isValid || connecting}
          onClick={handleNext}
        >
          {connecting ? 'Connecting Pera Wallet...' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

/* ── Landing Page ─────────────────────────────────────────────── */
export const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('agriculture');
  const [activeLendProfile, setActiveLendProfile] = useState<BorrowerProfile | null>(null);
  const navigate = useNavigate();

  const filteredProfiles = borrowerProfiles.filter(p => p.category === activeCategory);

  const testimonialsDuped = [...testimonials, ...testimonials];

  return (
    <div>
      {/* ═══════ Hero Section ═══════ */}
      <section className="hero" id="hero">
        <Particles />
        <div className="hero__content">
          <h1 className="hero__tagline">
            Lend with <em>purpose</em>.<br />
            Borrow with <em>dignity</em>.
          </h1>
          <p className="hero__sub">
            Community-powered P2P lending on Algorand. Transparent, trust-based, and completely on-chain.
          </p>
          <div className="hero__ctas">
            <Link to="/auth?role=lender">
              <button className="btn btn-primary btn-lg">Start Lending →</button>
            </Link>
            <Link to="/auth?role=borrower">
              <button className="btn btn-outline btn-lg">I Need a Loan →</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ Trust Bar ═══════ */}
      <div className="trust-bar">
        <div className="trust-bar__inner container">
          <div className="trust-bar__item"><strong>₹2.4 Cr</strong> disbursed</div>
          <div className="trust-bar__dot" />
          <div className="trust-bar__item"><strong>847</strong> loans funded</div>
          <div className="trust-bar__dot" />
          <div className="trust-bar__item"><strong>94%</strong> repayment rate</div>
          <div className="trust-bar__dot" />
          <div className="trust-bar__item">Built on <strong>Algorand</strong></div>
        </div>
      </div>

      {/* ═══════ Impact Categories ═══════ */}
      <section className="section" id="categories">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', textAlign: 'center', marginBottom: 'var(--space-sm)', color: 'var(--lp-slate)' }}>
            Fund a Dream Today
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--lp-slate-muted)', fontSize: '1rem', marginBottom: 'var(--space-2xl)', maxWidth: '550px', margin: '0 auto var(--space-2xl) auto' }}>
            Browse borrowers by category and make a real impact
          </p>

          <div className="categories-row" style={{ marginBottom: 'var(--space-2xl)' }}>
            {categories.map(cat => (
              <div
                key={cat.key}
                className={`category-card ${activeCategory === cat.key ? 'category-card--active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                id={`cat-${cat.key}`}
              >
                <div className="category-card__icon">{cat.icon}</div>
                <div className="category-card__label">{cat.label}</div>
                <div className="category-card__count">{cat.count} borrowers</div>
              </div>
            ))}
          </div>

          {/* Borrower Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}>
            {filteredProfiles.map(profile => (
              <BorrowerCard 
                key={profile.id} 
                profile={profile} 
                onLendClick={(p) => setActiveLendProfile(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ How It Works ═══════ */}
      <section className="section" id="how-it-works" style={{ background: 'var(--lp-surface)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', textAlign: 'center', marginBottom: 'var(--space-3xl)', color: 'var(--lp-slate)' }}>
            How LendPool Works
          </h2>

          <div className="hiw-grid">
            {/* For Borrowers */}
            <div>
              <div className="hiw-column__title"> For Borrowers</div>
              {[
                { title: 'Verify Identity', desc: 'Complete KYC with Aadhaar/PAN to unlock your borrowing tier.' },
                { title: 'Choose Your Path', desc: 'Get vouched, add a guarantor, or start solo at Tier 0.' },
                { title: 'Get Funded', desc: 'Post your loan story and let the community rally behind you.' },
                { title: 'Repay in Installments', desc: 'Pay weekly/monthly installments and build your trust score.' },
              ].map((step, i) => (
                <div className="hiw-step" key={i}>
                  <div className="hiw-step__num">{i + 1}</div>
                  <div className="hiw-step__text">
                    <strong>{step.title}</strong>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* For Lenders */}
            <div>
              <div className="hiw-column__title"> For Lenders</div>
              {[
                { title: 'Browse Stories', desc: 'Explore verified borrower profiles and their loan purposes.' },
                { title: 'Fund Any Amount', desc: 'Lend as little or as much as you want to any active loan.' },
                { title: 'Track Repayments', desc: 'Monitor every repayment on-chain with full transparency.' },
                { title: 'Earn Goodwill', desc: "Build your lender reputation and support your community's growth." },
              ].map((step, i) => (
                <div className="hiw-step" key={i}>
                  <div className="hiw-step__num">{i + 1}</div>
                  <div className="hiw-step__text">
                    <strong>{step.title}</strong>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* On Algorand */}
            <div>
              <div className="hiw-column__title"> On Algorand</div>
              {[
                { title: 'Immutable Records', desc: 'Every transaction is permanently recorded on the blockchain.' },
                { title: 'Smart Contracts', desc: 'Escrow and distribution handled automatically, no middlemen.' },
                { title: 'Transparent History', desc: 'Anyone can verify any loan, payment, or trust score on-chain.' },
                { title: 'No Middlemen', desc: 'Peer-to-peer lending, executed trustlessly via smart contracts.' },
              ].map((step, i) => (
                <div className="hiw-step" key={i}>
                  <div className="hiw-step__num">{i + 1}</div>
                  <div className="hiw-step__text">
                    <strong>{step.title}</strong>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Testimonials Marquee ═══════ */}
      <section className="marquee-container">
        <div className="marquee-track">
          {testimonialsDuped.map((t, i) => (
            <div className="marquee-item" key={i}>
              {t.text}
              <span className="marquee-item__author">— {t.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="footer">
        <div className="container">
          <p style={{ marginBottom: '8px' }}>
            <strong style={{ color: 'var(--lp-gold)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>LendPool</strong>
          </p>
          <p>Community-powered P2P lending on Algorand. Built with trust, transparency, and purpose.</p>
          <p style={{ marginTop: '12px', opacity: 0.6 }}>© 2025 Parity Squad. All rights reserved.</p>
        </div>
      </footer>

      {activeLendProfile && (
        <LendNowModal 
          profile={activeLendProfile} 
          onClose={() => setActiveLendProfile(null)}
          onProceed={(amount) => {
            setActiveLendProfile(null);
            navigate(`/loan/${activeLendProfile.id}`, { state: { prefillAmount: amount } });
          }}
        />
      )}
    </div>
  );
};
