import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { connectWallet, getConnectedAddress, signAndSendTxns } from '../wallet';
import { createLoan, confirmLoanCreation } from '../api';
import { TxBadge } from '../components/TxBadge';
import { processOCR, loadFaceModels, detectFace } from '../ekyc';
import { useSnackbar } from 'notistack';

const TIERS = [
  { level: 0, title: 'Tier 0: Basic', req: 'Basic Profile', limit: 500, icon: '[W]' },
  { level: 1, title: 'Tier 1: Verified Email', req: 'Email OTP', limit: 2000, icon: '[@]' },
  { level: 2, title: 'Tier 2: Verified Phone', req: 'Mobile OTP', limit: 5000, icon: '[#]' },
  { level: 3, title: 'Tier 3: Identity', req: 'Gov ID (Aadhaar/PAN)', limit: 20000, icon: '[ID]' },
  { level: 4, title: 'Tier 4: Trusted', req: '2+ Members Vouch', limit: 50000, icon: '[+]' },
];

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get('role') === 'borrower' ? 'borrower' : 'lender';
  const [role, setRole] = useState<'lender' | 'borrower'>(initialRole);

  // ---------- LENDER STATE ----------
  const [lenderName, setLenderName] = useState('');
  const [lenderPhone, setLenderPhone] = useState('');
  const [lenderOtp, setLenderOtp] = useState('');
  const [lenderOtpSent, setLenderOtpSent] = useState(false);

  // ---------- BORROWER STATE ----------
  const [borrowerMode, setBorrowerMode] = useState<'returning' | 'new'>('new');
  const [returnId, setReturnId] = useState('');
  const [returnPwd, setReturnPwd] = useState('');

  // ---------- MASTER FLOW (NEW BORROWER) ----------
  const [masterStep, setMasterStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Tier Selection
  const [targetTier, setTargetTier] = useState<number | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [verifiedTier, setVerifiedTier] = useState<number>(-1);
  const [processing, setProcessing] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  // Step 2: Path
  type LoanPath = 'A' | 'B' | 'C' | null;
  const [selectedPath, setSelectedPath] = useState<LoanPath>(null);

  // Step 3: Form
  const [loanAmount, setLoanAmount] = useState<number | ''>('');
  const [duration, setDuration] = useState('30');
  
  // Specific Form Details
  const [pathAName, setPathAName] = useState('');
  const [pathAPurpose, setPathAPurpose] = useState('');
  const [pathBName, setPathBName] = useState('');
  const [pathBType, setPathBType] = useState('');
  const [pathBRevenue, setPathBRevenue] = useState('');
  const [pathCCommunity, setPathCCommunity] = useState('');
  const [pathCVoucher1, setPathCVoucher1] = useState('');
  const [pathCVoucher2, setPathCVoucher2] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  // Step 4 & 5: Wallet & Submit
  const [walletAddress, setWalletAddress] = useState<string | null>(getConnectedAddress());
  const [walletError, setWalletError] = useState<string | null>(null);
  const [submittingLoan, setSubmittingLoan] = useState(false);
  const [successTxId, setSuccessTxId] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  // e-KYC EXTRA STATE
  const [ocrStatus, setOcrStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [faceMatchScore, setFaceMatchScore] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Helper
  const activeLimit = targetTier !== null ? TIERS[targetTier].limit : 500;

  // LENDER / RETURNING BORROWER HANDLERS
  const handleLenderLogin = async () => {
    if (!lenderName || !lenderOtp) return;
    setProcessing(true);
    try {
      if (lenderOtp !== '1234') throw new Error('Invalid OTP');
      
      // Force Pera Wallet connection for Lenders
      await connectWallet();
      const addr = localStorage.getItem('connectedAddress');
      if (!addr) throw new Error('Wallet connection failed');

      localStorage.setItem('lp_role', 'lender');
      localStorage.setItem('lp_user', JSON.stringify({ name: lenderName, mobile: lenderPhone, address: addr }));
      enqueueSnackbar('Lender logged in successfully!', { variant: 'success' });
      navigate('/lender/dashboard');
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Login failed', { variant: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleReturningBorrower = () => {
    if (!returnId || !returnPwd) return;
    try {
        localStorage.setItem('lp_role', 'borrower');
        localStorage.setItem('lp_user', JSON.stringify({ walletPrefix: returnId }));
        enqueueSnackbar('Logged in successfully!', { variant: 'success' });
        navigate('/borrower/dashboard');
    } catch (err: any) {
        enqueueSnackbar(err.message || 'Login failed', { variant: 'error' });
    }
  };

  // STEP 1 HANDLERS
  const handleSelectTier = (tierIndex: number) => {
    setTargetTier(tierIndex);
    setOnboardingStep(0);
    setVerifiedTier(-1);
  };

  const handleNextTierStep = async () => {
    setProcessing(true);
    try {
      if (onboardingStep === 0) {
        await new Promise(r => setTimeout(r, 800)); // Simulating
        setVerifiedTier(0);
      } else if (onboardingStep === 1) {
        if (!email.includes('@')) throw new Error('Invalid email');
        await new Promise(r => setTimeout(r, 1000)); 
        setVerifiedTier(1);
      } else if (onboardingStep === 2) {
        if (phone.length < 10) throw new Error('Invalid phone');
        await new Promise(r => setTimeout(r, 1000));
        setVerifiedTier(2);
      } else if (onboardingStep === 3) {
        // Step 1.3: Gov ID (Real OCR)
        if (!aadhaar || !pan) throw new Error('Please complete OCR for both documents');
        setVerifiedTier(3);
      } else if (onboardingStep === 4) {
        // Step 1.4: Liveness (Face Detect)
        if (faceMatchScore < 80) throw new Error('Face match confidence too low. Please try again.');
        setIsCameraActive(false);
        setVerifiedTier(4);
      }

      setProcessing(false);
      if (targetTier !== null && onboardingStep < targetTier) {
        setOnboardingStep(prev => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setProcessing(false);
      enqueueSnackbar(err.message || 'Verification failed. Check inputs.', { variant: 'error' });
    }
  };

  const handleFileUpload = async (file: File, type: 'AADHAAR' | 'PAN') => {
    setOcrStatus('PROCESSING');
    try {
      const result = await processOCR(file, type);
      if (result.isValid && result.foundValue) {
        if (type === 'AADHAAR') setAadhaar(result.foundValue);
        else setPan(result.foundValue);
        setOcrStatus('SUCCESS');
      } else {
        throw new Error(`Could not extract valid ${type} number`);
      }
    } catch (err: any) {
      setOcrError(err.message);
      setOcrStatus('ERROR');
    }
  };

  const startLiveness = async () => {
    setIsCameraActive(true);
    setProcessing(true);
    try {
      await loadFaceModels();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        const interval = setInterval(async () => {
          if (!videoRef.current) {
            clearInterval(interval);
            return;
          }
          const score = await detectFace(videoRef.current);
          setFaceMatchScore(score);
          if (score > 90) {
            // Auto-trigger verify if score is very high for 1s? 
            // For now just let user click when they see green
          }
        }, 200);
      }
    } catch (err) {
      console.error("Camera error:", err);
      enqueueSnackbar("Could not start camera", { variant: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  // STEP 3 HANDLER
  const handlePathSubmit = () => {
    setFormError(null);
    if (!loanAmount || typeof loanAmount !== 'number' || loanAmount <= 0) {
      setFormError("Please enter a valid loan amount.");
      return;
    }
    if (loanAmount > activeLimit) {
      setFormError(`Amount exceeds your Tier limit of ${activeLimit} ALGO. Reduce amount or go back to upgrade tier.`);
      return;
    }
    if (targetTier === 4) {
      setMasterStep(4);
    } else {
      setMasterStep(5);
    }
  };

  // STEP 4 HANDLER
  const handlePerformWalletConnect = async () => {
    setWalletError(null);
    setProcessing(true);
    try {
        const addr = await connectWallet();
        await new Promise(r => setTimeout(r, 1200)); // Simulating on-chain ASA check
        setWalletAddress(addr);
        enqueueSnackbar('Wallet connected!', { variant: 'success' });
        setMasterStep(5);
    } catch (err: any) {
        enqueueSnackbar(err.message || 'Wallet connection failed', { variant: 'error' });
        setWalletError(err.message || 'Connection failed.');
    } finally {
        setProcessing(false);
    }
  };

  // STEP 5 HANDLER
  const handleFinalSubmit = async () => {
      if (!walletAddress) {
          setWalletError("No wallet connected.");
          return;
      }
      setSubmittingLoan(true);
      try {
          const goalMicroAlgos = Number(loanAmount) * 1_000_000;
          const durationDays = parseInt(duration);
          
          let purposeText = "";
          if (selectedPath === 'A') purposeText = `Vouch: ${pathAPurpose}`;
          if (selectedPath === 'B') purposeText = `Guarantor: ${pathAPurpose}`;
          if (selectedPath === 'C') purposeText = `Self-raise: ${pathAPurpose}`;

          const { txns, loan_id } = await createLoan({
              borrower_address: walletAddress,
              goal_microalgos: goalMicroAlgos,
              duration_days: durationDays,
              tier_required: targetTier || 0,
              purpose: purposeText,
              category: 'other' // Default for now
          });

          const { txId, appId } = await signAndSendTxns(txns);
          setSuccessTxId(txId);

          enqueueSnackbar('Loan request broadcasted successfully!', { 
            variant: 'success',
            action: (key) => (
              <a 
                href={`https://testnet.explorer.perawallet.app/tx/${txId}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'white', textDecoration: 'underline', marginLeft: '10px', fontSize: '0.8rem' }}
              >
                View on Explorer
              </a>
            )
          });

          // Update DB with real app_id
          if (appId && loan_id) {
              await confirmLoanCreation(loan_id, appId);
          }
      } catch(err: any) {
          console.error(err);
          enqueueSnackbar(err.message || "Failed to deploy smart contract.", { variant: 'error' });
          setWalletError(err.message || "Failed to deploy smart contract.");
      } finally {
          setSubmittingLoan(false);
      }
  };


  // ------------------------------------------------------------------------------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------------------------------------------------------------------------------

  if (successTxId) {
    return (
        <div style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: '#fafaf9', minHeight: 'calc(100vh - 80px)' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '4rem 2rem', border: '1px solid #eee', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--lp-green)', marginBottom: '1rem' }}>Loan Request Submitted!</h2>
                <p style={{ color: 'var(--lp-slate-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    The loan contract is live and broadcasting to the P2P network.
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
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Role Toggle (Only show if new borrower haven't started tier flow) */}
        {!(borrowerMode === 'new' && targetTier !== null && role === 'borrower') && (
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="role-toggle">
                <button
                className={`role-toggle__btn ${role === 'lender' ? 'role-toggle__btn--active' : ''}`}
                onClick={() => setRole('lender')}
                >
                Lender
                </button>
                <button
                className={`role-toggle__btn ${role === 'borrower' ? 'role-toggle__btn--active' : ''}`}
                onClick={() => setRole('borrower')}
                >
                Borrower
                </button>
            </div>
            </div>
        )}

        {/* ═══ Lender Auth ═══ */}
        {role === 'lender' && (
          <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-green)', marginBottom: '4px', fontSize: '1.6rem' }}>
              Welcome, Lender
            </h2>
            <p style={{ color: 'var(--lp-slate-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Start funding borrowers and building community trust.
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
                    {lenderOtpSent ? 'Sent' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {lenderOtpSent && (
                <div>
                  <label className="form-label">OTP</label>
                  <input className="form-input" placeholder="Enter 4-digit OTP" value={lenderOtp} onChange={e => setLenderOtp(e.target.value)} maxLength={4} />
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }} onClick={handleLenderLogin} disabled={!lenderName || !lenderOtp}>
                Login as Lender →
              </button>
            </div>
          </div>
        )}

        {/* ═══ Borrower Auth ═══ */}
        {role === 'borrower' && (
          <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
            
            {/* Header logic */}
            {targetTier === null ? (
                <>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-green)', marginBottom: '4px', fontSize: '1.6rem' }}>
                    Borrower Portal
                </h2>
                <p style={{ color: 'var(--lp-slate-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
                    Access your loans or start a new application.
                </p>
                <div style={{ display: 'flex', marginBottom: 'var(--space-xl)', gap: '4px', background: 'var(--lp-border-light)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
                    <button
                        onClick={() => setBorrowerMode('returning')}
                        style={{ flex: 1, border: 'none', padding: '8px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', background: borrowerMode === 'returning' ? 'var(--lp-gold)' : 'transparent', color: borrowerMode === 'returning' ? 'white' : 'var(--lp-slate-muted)' }}
                    >Returning</button>
                    <button
                        onClick={() => setBorrowerMode('new')}
                        style={{ flex: 1, border: 'none', padding: '8px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', background: borrowerMode === 'new' ? 'var(--lp-gold)' : 'transparent', color: borrowerMode === 'new' ? 'white' : 'var(--lp-slate-muted)' }}
                    >New Borrower</button>
                </div>
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--lp-border-light)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--lp-slate)', margin: 0 }}>Onboarding</h2>
                    <div style={{ background: 'var(--lp-green)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                        Borrow Limit: {activeLimit.toLocaleString()} ALGO
                    </div>
                </div>
            )}

            {/* Returning Borrower */}
            {borrowerMode === 'returning' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div><label className="form-label">User ID (Wallet Address)</label><input className="form-input" value={returnId} onChange={e => setReturnId(e.target.value)} /></div>
                <div><label className="form-label">Password</label><input className="form-input" type="password" value={returnPwd} onChange={e => setReturnPwd(e.target.value)} /></div>
                <button className="btn btn-primary btn-lg" onClick={handleReturningBorrower} disabled={!returnId || !returnPwd}>Login →</button>
              </div>
            )}

            {/* New Borrower Flow */}
            {borrowerMode === 'new' && (
                <>

                {/* MASTER STEP 1: Tier Selection */}
                {masterStep === 1 && targetTier === null && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--lp-slate)', marginBottom: '8px' }}>Step 1: Select Target Tier</h3>
                        {TIERS.map((t) => (
                        <div key={t.level} className="card" style={{ padding: '12px', cursor: 'pointer', border: '1px solid var(--lp-border-light)' }} onClick={() => handleSelectTier(t.level)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lp-green)' }}>{t.icon}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: 'var(--lp-slate)' }}>{t.title}</div><div style={{ fontSize: '0.8rem', color: 'var(--lp-slate-muted)' }}>Req: {t.req}</div></div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--lp-green)', fontWeight: 600 }}>{t.limit.toLocaleString()} ALGO</div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                {masterStep === 1 && targetTier !== null && (
                    <div>
                        <div className="steps" style={{ marginBottom: 'var(--space-lg)' }}>
                            {Array.from({ length: targetTier + 1 }).map((_, i) => (
                                <div key={i} className={`step-dot ${onboardingStep >= i ? (onboardingStep === i ? 'step-dot--active' : 'step-dot--done') : ''}`} />
                            ))}
                        </div>

                        {onboardingStep === targetTier && verifiedTier === targetTier ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                                <h3 style={{ color: 'var(--lp-green)', marginBottom: '8px' }}>Tier {targetTier} ASA Minted!</h3>
                                <p style={{ color: 'var(--lp-slate-muted)' }}>You successfully proved your identity for Tier {targetTier}.</p>
                                <button className="btn btn-primary btn-lg" style={{ marginTop: '24px', width: '100%' }} onClick={() => {
                                    localStorage.setItem('lp_tier', targetTier.toString());
                                    setMasterStep(2);
                                }}>
                                    Continue to Loan Path →
                                </button>
                            </div>
                        ) : (
                            <>
                                <div style={{ background: 'var(--lp-surface-raised)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                                    <h4 style={{ color: 'var(--lp-slate)', marginBottom: '12px' }}>Step 1.{onboardingStep}: {TIERS[onboardingStep].req}</h4>
                                    {onboardingStep === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--lp-slate-light)' }}>Simulated setup sequence for wallet identification.</p>}
                                    {onboardingStep === 1 && <input className="form-input" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />}
                                    {onboardingStep === 2 && <input className="form-input" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} />}
                                    {onboardingStep === 3 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className="ekyc-drop-zone" onClick={() => document.getElementById('aadhaar-file')?.click()}>
                                                <div className="ekyc-drop-zone__icon">🪪</div>
                                                <div className="ekyc-drop-zone__text">Upload Aadhaar Front Image</div>
                                                <input id="aadhaar-file" type="file" hidden onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'AADHAAR')} />
                                                {aadhaar && <div className="ocr-status ocr-status--success">Aadhaar: {aadhaar}</div>}
                                            </div>

                                            <div className="ekyc-drop-zone" onClick={() => document.getElementById('pan-file')?.click()}>
                                                <div className="ekyc-drop-zone__icon">💳</div>
                                                <div className="ekyc-drop-zone__text">Upload PAN Card Image</div>
                                                <input id="pan-file" type="file" hidden onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'PAN')} />
                                                {pan && <div className="ocr-status ocr-status--success">PAN: {pan}</div>}
                                            </div>

                                            {ocrStatus === 'PROCESSING' && <div className="ocr-status ocr-status--pending">AI Scanning Documents...</div>}
                                            {ocrError && <div className="ocr-status ocr-status--error">{ocrError}</div>}
                                        </div>
                                    )}
                                    {onboardingStep === 4 && (
                                        <div style={{ textAlign: 'center' }}>
                                            {!isCameraActive ? (
                                                <div style={{ padding: '2rem', border: '2px dashed var(--lp-border)', borderRadius: 'var(--radius-lg)' }}>
                                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤳</div>
                                                    <p style={{ marginBottom: '1.5rem', color: 'var(--lp-slate-muted)' }}>Face Verification required for Tier 4.</p>
                                                    <button className="btn btn-outline" onClick={startLiveness}>Start Camera</button>
                                                </div>
                                            ) : (
                                                <div className="camera-container">
                                                    <video ref={videoRef} className="camera-video" muted playsInline />
                                                    <div className="match-score-badge" style={{ color: faceMatchScore > 80 ? '#4ade80' : 'white' }}>
                                                        Detecting: {faceMatchScore}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button className="btn btn-gold" style={{ width: '100%' }} onClick={handleNextTierStep} disabled={processing}>
                                    {processing ? 'Processing...' : `Complete Verification`}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* MASTER STEP 2: Choose Path */}
                {masterStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--lp-slate)', marginBottom: '16px' }}>Step 2: Choose Your Path</h3>
                        
                        <div className="card" style={{ padding: '16px', border: selectedPath === 'A' ? '2px solid var(--lp-green)' : '1px solid var(--lp-border-light)', cursor: 'pointer' }} onClick={() => setSelectedPath('A')}>
                            <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>Path A: Vouch</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Get 2 community members to vouch for you.</div>
                        </div>

                        <div className="card" style={{ padding: '16px', border: selectedPath === 'B' ? '2px solid var(--lp-green)' : '1px solid var(--lp-border-light)', cursor: 'pointer' }} onClick={() => setSelectedPath('B')}>
                            <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>Path B: Guarantor</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Nominate a trusted member to guarantee your loans.</div>
                        </div>

                        <div className="card" style={{ padding: '16px', border: selectedPath === 'C' ? '2px solid var(--lp-green)' : '1px solid var(--lp-border-light)', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setSelectedPath('C')}>
                            <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>Path C: Self-raise</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)' }}>Borrow within your Tier limit, no vouch needed.</div>
                        </div>

                        <button className="btn btn-primary" disabled={!selectedPath} onClick={() => {
                            if (selectedPath === 'A') {
                                navigate('/vouch-selection');
                            } else if (selectedPath === 'B') {
                                navigate('/choose-guarantor');
                            } else {
                                navigate('/create-loan');
                            }
                        }}>Next Step →</button>
                    </div>
                )}

                {/* MASTER STEP 3: Form */}
                {masterStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--lp-slate)', marginBottom: '8px' }}>Step 3: Loan Details (Path {selectedPath})</h3>
                        
                        {formError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>{formError}</div>}

                        <div><label className="form-label">Full Name</label><input className="form-input" value={pathAName} onChange={e => setPathAName(e.target.value)} /></div>
                        <div><label className="form-label">Loan Purpose</label><input className="form-input" value={pathAPurpose} onChange={e => setPathAPurpose(e.target.value)} /></div>
                        <div><label className="form-label">Duration (Days)</label><input type="number" className="form-input" value={duration} onChange={e => setDuration(e.target.value)} /></div>

                        {selectedPath === 'A' && (
                            <>
                                <div><label className="form-label">Voucher 1 Address</label><input className="form-input" value={pathCVoucher1} onChange={e => setPathCVoucher1(e.target.value)} /></div>
                                <div><label className="form-label">Voucher 2 Address</label><input className="form-input" value={pathCVoucher2} onChange={e => setPathCVoucher2(e.target.value)} /></div>
                            </>
                        )}
                        {selectedPath === 'B' && (
                            <>
                                <div><label className="form-label">Guarantor Address</label><input className="form-input" value={pathCVoucher1} onChange={e => setPathCVoucher1(e.target.value)} /></div>
                            </>
                        )}
                        {selectedPath === 'C' && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--lp-slate-muted)' }}>No additional vouchers or guarantors required for Self-raise.</p>
                        )}

                        <div style={{ borderTop: '1px solid var(--lp-border-light)', paddingTop: '16px', marginTop: '8px' }}>
                            <label className="form-label">Requested Loan Amount (ALGO)</label>
                            <input type="number" className="form-input" placeholder={`Max ${activeLimit}`} value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value) || '')} />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMasterStep(2)}>Back</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handlePathSubmit}>Save & Continue</button>
                        </div>
                    </div>
                )}

                {/* MASTER STEP 4: Wallet Connect */}
                {masterStep === 4 && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--lp-slate)', marginBottom: '16px' }}>Step 4: Connect Wallet</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--lp-slate-muted)', marginBottom: '24px' }}>
                            Please connect your Pera Wallet SDK to cross-verify the Tier {targetTier} ASA badge before submitting your loan.
                        </p>

                        {walletError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>{walletError}</div>}

                        <button className="btn btn-gold btn-lg" onClick={handlePerformWalletConnect} disabled={processing}>
                            {processing ? 'Connecting Pera...' : 'Connect Wallet'}
                        </button>
                    </div>
                )}

                {/* MASTER STEP 5: Summary */}
                {masterStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--lp-green)', marginBottom: '8px' }}>Step 5: Final Review</h3>
                        
                        <div style={{ background: 'var(--lp-surface-raised)', padding: '16px', borderRadius: '8px', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--lp-border-light)' }}>
                                <span style={{ color: 'var(--lp-slate-muted)' }}>Path Selected:</span>
                                <span style={{ fontWeight: 600 }}>{selectedPath}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--lp-border-light)' }}>
                                <span style={{ color: 'var(--lp-slate-muted)' }}>Loan Amount:</span>
                                <span style={{ fontWeight: 600, color: 'var(--lp-green)' }}>{loanAmount} ALGO</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--lp-border-light)' }}>
                                <span style={{ color: 'var(--lp-slate-muted)' }}>Wallet Address:</span>
                                <span style={{ fontWeight: 600 }}>{walletAddress?.substring(0, 8)}...{walletAddress?.slice(-4)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                                <span style={{ color: 'var(--lp-slate-muted)' }}>Tier Achieved:</span>
                                <span style={{ fontWeight: 600 }}>Tier {targetTier} (Max {activeLimit})</span>
                            </div>
                        </div>

                        {walletError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>{walletError}</div>}
                        
                        {!walletAddress ? (
                            <button className="btn btn-gold btn-lg" onClick={handlePerformWalletConnect} disabled={processing} style={{ marginTop: '16px', width: '100%' }}>
                                {processing ? 'Connecting Pera...' : 'Connect Wallet to Submit'}
                            </button>
                        ) : (
                            <button className="btn btn-primary btn-lg" onClick={handleFinalSubmit} disabled={submittingLoan} style={{ marginTop: '16px', width: '100%' }}>
                                {submittingLoan ? 'Signing & Broadcasting...' : 'Submit Loan Request on Chain'}
                            </button>
                        )}
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
