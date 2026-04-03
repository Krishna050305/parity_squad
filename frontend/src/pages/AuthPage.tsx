import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/* ── AuthPage — /auth?role=lender|borrower ────────────────────── */
export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get('role') === 'borrower' ? 'borrower' : 'lender';
  const [role, setRole] = useState<'lender' | 'borrower'>(initialRole);

  // Lender state
  const [lenderName, setLenderName] = useState('');
  const [lenderPhone, setLenderPhone] = useState('');
  const [lenderOtp, setLenderOtp] = useState('');
  const [lenderOtpSent, setLenderOtpSent] = useState(false);

  // Borrower state
  const [borrowerMode, setBorrowerMode] = useState<'returning' | 'new'>('new');
  const [returnId, setReturnId] = useState('');
  const [returnPwd, setReturnPwd] = useState('');

  // New-borrower wizard
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [kycOtp, setKycOtp] = useState('');
  const [kycOtpSent, setKycOtpSent] = useState(false);
  const [verifiedTier, setVerifiedTier] = useState<number | null>(null);
  const [trustPath, setTrustPath] = useState<'vouch' | 'guarantor' | 'solo' | null>(null);
  const [guarantorAddr, setGuarantorAddr] = useState('');
  const [guarantorPending, setGuarantorPending] = useState(false);

  // Loan params
  const [loanAmount, setLoanAmount] = useState(10000);
  const [tenure, setTenure] = useState(6);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');

  const tierLimits: Record<number, number> = { 0: 41500, 1: 83000, 2: 415000, 3: 830000 };
  const currentTier = verifiedTier ?? 0;
  const maxAmount = tierLimits[currentTier] || 41500;

  const installmentCount = useMemo(() => {
    if (frequency === 'weekly') return tenure * 4;
    if (frequency === 'biweekly') return tenure * 2;
    return tenure;
  }, [tenure, frequency]);

  const installmentAmount = Math.ceil(loanAmount / installmentCount);
  const freqLabel = frequency === 'weekly' ? 'week' : frequency === 'biweekly' ? '2 weeks' : 'month';

  const handleLenderLogin = () => {
    if (!lenderName || !lenderOtp) return;
    localStorage.setItem('lp_role', 'lender');
    localStorage.setItem('lp_user', JSON.stringify({ name: lenderName }));
    navigate('/lender/dashboard');
  };

  const handleReturningBorrower = () => {
    if (!returnId || !returnPwd) return;
    localStorage.setItem('lp_role', 'borrower');
    localStorage.setItem('lp_user', JSON.stringify({ walletPrefix: returnId }));
    navigate('/borrower/dashboard');
  };

  const handleVerifyKyc = () => {
    // Mock verification
    let tier = 0;
    if (pan && pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) tier = 3;
    else if (aadhaar && aadhaar.length === 12) tier = 2;
    else tier = 1;
    setVerifiedTier(tier);
    // Auto-advance after a brief moment
    setTimeout(() => setStep(2), 800);
  };

  const handleTrustPathSelect = (path: 'vouch' | 'guarantor' | 'solo') => {
    setTrustPath(path);
    if (path === 'vouch') {
      navigate('/vouch-selection');
      return;
    }
    if (path === 'solo') {
      setStep(3);
      return;
    }
    // guarantor — show input
  };

  const handleGuarantorRequest = () => {
    if (!guarantorAddr) return;
    setGuarantorPending(true);
    // Mock pending state
    setTimeout(() => setStep(3), 1500);
  };

  const handleLoanConfirm = () => {
    localStorage.setItem('lp_role', 'borrower');
    localStorage.setItem('lp_user', JSON.stringify({
      name: 'New Borrower',
      tier: currentTier,
      trustPath,
      loan: { amount: loanAmount, tenure, frequency, installmentCount, installmentAmount }
    }));
    navigate('/borrower/dashboard');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Role Toggle */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="role-toggle">
            <button
              className={`role-toggle__btn ${role === 'lender' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('lender')}
            >
              💰 Lender
            </button>
            <button
              className={`role-toggle__btn ${role === 'borrower' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('borrower')}
            >
              🤝 Borrower
            </button>
          </div>
        </div>

        {/* ═══ Lender Auth ═══ */}
        {role === 'lender' && (
          <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-green)', marginBottom: '4px', fontSize: '1.6rem' }}>
              Welcome, Lender
            </h2>
            <p style={{ color: 'var(--lp-slate-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Start funding borrowers and building community trust.
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', fontStyle: 'italic', marginBottom: 'var(--space-lg)', background: 'rgba(13,79,60,0.04)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              ℹ️ Lenders do not need Aadhaar/PAN verification.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Enter your full name" value={lenderName} onChange={e => setLenderName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Mobile Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" placeholder="10-digit mobile" value={lenderPhone} onChange={e => setLenderPhone(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-outline btn-sm" onClick={() => setLenderOtpSent(true)} disabled={!lenderPhone || lenderPhone.length < 10}>
                    {lenderOtpSent ? '✓ Sent' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {lenderOtpSent && (
                <div>
                  <label className="form-label">OTP</label>
                  <input className="form-input" placeholder="Enter 4-digit OTP" value={lenderOtp} onChange={e => setLenderOtp(e.target.value)} maxLength={4} />
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)', width: '100%' }} onClick={handleLenderLogin} disabled={!lenderName || !lenderOtp}>
                Login as Lender →
              </button>
            </div>
          </div>
        )}

        {/* ═══ Borrower Auth ═══ */}
        {role === 'borrower' && (
          <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-green)', marginBottom: '4px', fontSize: '1.6rem' }}>
              Borrower Portal
            </h2>
            <p style={{ color: 'var(--lp-slate-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
              Access your loans or start a new application.
            </p>

            {/* Sub-toggle */}
            <div style={{ display: 'flex', marginBottom: 'var(--space-xl)', gap: '4px', background: 'var(--lp-border-light)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
              <button
                onClick={() => setBorrowerMode('returning')}
                style={{
                  flex: 1, border: 'none', padding: '8px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                  background: borrowerMode === 'returning' ? 'var(--lp-gold)' : 'transparent',
                  color: borrowerMode === 'returning' ? 'white' : 'var(--lp-slate-muted)',
                  transition: 'all 0.2s',
                }}
              >
                Returning Borrower
              </button>
              <button
                onClick={() => setBorrowerMode('new')}
                style={{
                  flex: 1, border: 'none', padding: '8px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                  background: borrowerMode === 'new' ? 'var(--lp-gold)' : 'transparent',
                  color: borrowerMode === 'new' ? 'white' : 'var(--lp-slate-muted)',
                  transition: 'all 0.2s',
                }}
              >
                New Borrower
              </button>
            </div>

            {/* Returning Borrower */}
            {borrowerMode === 'returning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <label className="form-label">User ID (Wallet Address Prefix)</label>
                  <input className="form-input" placeholder="e.g. RAVI...K4X2" value={returnId} onChange={e => setReturnId(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="Enter password" value={returnPwd} onChange={e => setReturnPwd(e.target.value)} />
                </div>
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--lp-gold)', fontWeight: 500 }}>Forgot password?</a>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleReturningBorrower} disabled={!returnId || !returnPwd}>
                  Login →
                </button>
              </div>
            )}

            {/* New Borrower Wizard */}
            {borrowerMode === 'new' && (
              <>
                {/* Step Indicator */}
                <div className="steps">
                  <div className={`step-dot ${step >= 1 ? (step === 1 ? 'step-dot--active' : 'step-dot--done') : ''}`} />
                  <div className={`step-dot ${step >= 2 ? (step === 2 ? 'step-dot--active' : 'step-dot--done') : ''}`} />
                  <div className={`step-dot ${step >= 3 ? (step === 3 ? 'step-dot--active' : 'step-dot--done') : ''}`} />
                </div>

                {/* Step 1: Identity Verification */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-slate)', fontSize: '1.2rem', marginBottom: '4px' }}>
                      Step 1 — Identity Verification
                    </h3>
                    <div>
                      <label className="form-label">Aadhaar Number</label>
                      <input className="form-input" placeholder="1234 5678 9012" value={aadhaar}
                        onChange={e => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        maxLength={12}
                        style={{ letterSpacing: '1px' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>12 digits, masked for privacy</span>
                    </div>
                    <div>
                      <label className="form-label">PAN Number</label>
                      <input className="form-input" placeholder="ABCDE1234F"
                        value={pan}
                        onChange={e => setPan(e.target.value.toUpperCase().slice(0, 10))}
                        maxLength={10}
                        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>Format: XXXXX0000X</span>
                    </div>

                    {!kycOtpSent ? (
                      <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => setKycOtpSent(true)} disabled={!aadhaar || aadhaar.length < 12}>
                        Verify with OTP
                      </button>
                    ) : (
                      <>
                        <div>
                          <label className="form-label">Enter OTP</label>
                          <input className="form-input" placeholder="1234" value={kycOtp} onChange={e => setKycOtp(e.target.value)} maxLength={4} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleVerifyKyc} disabled={kycOtp.length < 4}>
                          Verify & Continue →
                        </button>
                      </>
                    )}

                    {verifiedTier !== null && (
                      <div style={{
                        background: 'rgba(13,79,60,0.06)', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                        textAlign: 'center', fontWeight: 600, color: 'var(--lp-green)', fontSize: '0.9rem'
                      }}>
                        ✅ Tier {verifiedTier} Unlocked — Limit: ₹{tierLimits[verifiedTier]?.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Trust Path Selection */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-slate)', fontSize: '1.2rem', marginBottom: '4px' }}>
                      Step 2 — Choose Your Trust Path
                    </h3>

                    {/* Path A — Community Vouch */}
                    <div className="card" style={{ border: trustPath === 'vouch' ? '2px solid var(--lp-green)' : undefined }}>
                      <h4 style={{ color: 'var(--lp-green)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Path A — Community Vouch</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--lp-slate-light)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Get 2 existing LendPool members to vouch for you. You pay ₹500 to each voucher. This unlocks community credibility.
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--lp-gold-dark)', fontWeight: 600, marginBottom: '12px' }}>
                        2 × ₹500 = ₹1,000 total
                      </p>
                      <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => handleTrustPathSelect('vouch')}>
                        Browse & Select Vouchers →
                      </button>
                    </div>

                    {/* Path B — Guarantor */}
                    <div className="card" style={{ border: trustPath === 'guarantor' ? '2px solid var(--lp-green)' : undefined }}>
                      <h4 style={{ color: 'var(--lp-green)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Path B — Add Guarantor</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--lp-slate-light)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Nominate a trusted LendPool member as your guarantor. Their reputation backs your loan. They must approve.
                      </p>
                      {!guarantorPending ? (
                        <>
                          <input className="form-input" placeholder="Guarantor's Wallet Address" value={guarantorAddr}
                            onChange={e => setGuarantorAddr(e.target.value)} style={{ marginBottom: '8px' }} />
                          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => { setTrustPath('guarantor'); handleGuarantorRequest(); }} disabled={!guarantorAddr}>
                            Send Guarantor Request →
                          </button>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(200,151,43,0.08)', borderRadius: 'var(--radius-md)', color: 'var(--lp-gold-dark)', fontWeight: 600, fontSize: '0.85rem' }}>
                          ⏳ Guarantor request pending...
                        </div>
                      )}
                    </div>

                    {/* Path C — Solo Start */}
                    <div className="card" style={{ border: trustPath === 'solo' ? '2px solid var(--lp-green)' : undefined }}>
                      <h4 style={{ color: 'var(--lp-green)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Path C — Solo Start (Tier 0)</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--lp-slate-light)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Start borrowing on your own within your verified tier limits. Build trust over time.
                      </p>
                      <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', marginBottom: '12px', padding: '8px', background: 'var(--lp-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                        Tier 0 → ₹41,500 &nbsp;|&nbsp; Tier 1 → ₹83,000 &nbsp;|&nbsp; Tier 2 → ₹4,15,000 &nbsp;|&nbsp; Tier 3 → ₹8,30,000
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ width: '100%', border: '1.5px solid var(--lp-border)' }} onClick={() => handleTrustPathSelect('solo')}>
                        Start at my current Tier →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Loan Parameters */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-slate)', fontSize: '1.2rem', marginBottom: '4px' }}>
                      Step 3 — Set Loan Parameters
                    </h3>

                    <div>
                      <label className="form-label">Loan Amount — ₹{loanAmount.toLocaleString('en-IN')}</label>
                      <input type="range" min={1000} max={maxAmount} step={500} value={loanAmount}
                        onChange={e => setLoanAmount(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--lp-green)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>
                        <span>₹1,000</span>
                        <span>₹{maxAmount.toLocaleString('en-IN')} (Tier {currentTier} limit)</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Tenure</label>
                      <select className="form-input" value={tenure} onChange={e => setTenure(Number(e.target.value))}>
                        <option value={3}>3 months</option>
                        <option value={6}>6 months</option>
                        <option value={9}>9 months</option>
                        <option value={12}>12 months</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Installment Frequency</label>
                      <select className="form-input" value={frequency} onChange={e => setFrequency(e.target.value as any)}>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {/* Preview */}
                    <div style={{
                      background: 'rgba(13,79,60,0.04)', padding: '16px', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(13,79,60,0.1)',
                    }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-light)', marginBottom: '8px' }}>Repayment Preview</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-green)', fontWeight: 700, marginBottom: '4px' }}>
                        ₹{installmentAmount.toLocaleString('en-IN')} every {freqLabel}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>
                        {installmentCount} installments over {tenure} months
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--lp-gold-dark)', fontWeight: 500, background: 'rgba(200,151,43,0.06)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      ⚠️ Once submitted, dates and installment schedule cannot be changed.
                    </div>

                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleLoanConfirm}>
                      Confirm & Post to Blockchain →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
