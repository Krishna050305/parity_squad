import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TxBadge } from '../components/TxBadge';

const BASE_URL = "http://localhost:8000";

export const VerifyPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [badgeId, setBadgeId] = useState<string | null>(null);

    const [form, setForm] = useState({
        email: '',
        emailOtp: '',
        phone: '',
        phoneOtp: '',
        pan: ''
    });

    const address = localStorage.getItem("connectedAddress");

    const handleVerify = async (payload: any) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet_address: address, ...payload })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.detail || "Verification failed");
            
            if (data.badge_asa_id) {
                setBadgeId(data.badge_asa_id);
            }
            
            // For demo purposes, we also update the mockTier in localStorage
            localStorage.setItem(`mockTier_${address}`, data.achieved_tier.toString());
            
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const nextStep = async () => {
        if (step === 1) {
            const data = await handleVerify({ email_otp: form.emailOtp });
            if (data) setStep(2);
        } else if (step === 2) {
            const data = await handleVerify({ phone_otp: form.phoneOtp });
            if (data) setStep(3);
        } else if (step === 3) {
            const data = await handleVerify({ pan_document: form.pan });
            if (data) setSuccess(true);
        }
    };

    if (!address) {
        return <div style={{ padding: '6rem', textAlign: 'center' }}>Please connect your wallet to verify your identity.</div>;
    }

    if (success) {
        return (
            <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid #eee' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
                    <h2 style={{ color: 'var(--brand-green)', fontSize: '2rem' }}>Identity Verified!</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        You have achieved <strong>Tier 3</strong> status. Your borrow limits have been increased to 20,000 ALGO.
                    </p>
                    {badgeId && (
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                            <span style={{ fontWeight: 600 }}>ASA Badge Issued: </span>
                            <code>{badgeId}</code>
                        </div>
                    )}
                    <button onClick={() => navigate('/')} className="btn-green">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '500px', width: '100%', background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--text)' }}>Verify Your Account</h2>
                    <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Step {step} of 3: Upgrade your trust tier</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--brand-green)' : '#eee', borderRadius: '2px' }}></div>
                    ))}
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Level 1: Email</h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Enter your email and the verification code sent (Demo: use code 1234).</p>
                        <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <input type="text" placeholder="OTP Code" value={form.emailOtp} onChange={e => setForm({...form, emailOtp: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Level 2: Phone</h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Verify your mobile number (Demo: use code 1234).</p>
                        <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <input type="text" placeholder="OTP Code" value={form.phoneOtp} onChange={e => setForm({...form, phoneOtp: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                )}

                {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Level 3: Legal ID</h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Enter your PAN or Government ID for hashing.</p>
                        <input type="text" placeholder="ABCDE1234F" value={form.pan} onChange={e => setForm({...form, pan: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                )}

                <button 
                    onClick={nextStep} 
                    disabled={loading}
                    className="btn-green"
                    style={{ width: '100%', marginTop: '2.5rem' }}
                >
                    {loading ? 'Verifying...' : step === 3 ? 'Complete Verification' : 'Next Step'}
                </button>
            </div>
        </div>
    );
};
