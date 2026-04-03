import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import algosdk from 'algosdk';
import { fetchLoanState, fetchLoanTxns, fundLoan, repayLoan, claimRepayment } from '../api';
import { signAndSendTxns } from '../wallet';
import {
  categories, borrowerProfiles, demoReceipts, demoInstallments, demoLenderActivity,
  getInitials, getAvatarColor, getTrustColor, getRiskColor, formatCurrency,
  type InstallmentStatus,
} from '../data';

/* ── Helper: parse global state ───────────────────────────────── */
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

const pillClass: Record<InstallmentStatus, string> = {
  paid: 'pill pill-paid', 'paid-late': 'pill pill-paid-late',
  upcoming: 'pill pill-upcoming', overdue: 'pill pill-overdue',
};
const pillLabel: Record<InstallmentStatus, string> = {
  paid: '✓ Paid', 'paid-late': '⚠ Late',
  upcoming: '○ Upcoming', overdue: '✕ Overdue',
};

export const LoanDetailPage = () => {
  const { appId } = useParams<{ appId: string }>();

  // Check if it's a static profile ID (e.g. "agr-1") or a real app ID
  const isStaticProfile = appId && isNaN(Number(appId));
  const staticProfile = isStaticProfile ? borrowerProfiles.find(p => p.id === appId) : null;

  // On-chain state
  const [loan, setLoan] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTxId, setSuccessTxId] = useState<string | null>(null);
  const connectedAddress = localStorage.getItem('connectedAddress');

  const application_id = isStaticProfile ? 0 : parseInt(appId || '0');

  useEffect(() => {
    if (isStaticProfile) {
      setLoading(false);
      return;
    }
    if (!application_id) { setLoading(false); return; }
    const loadData = async () => {
      try {
        setLoading(true);
        const stateRes = await fetchLoanState(application_id);
        const parsed = parseGlobalState(stateRes.state || []);
        setLoan({
          borrower: parsed.borrower || '', goal: parsed.goal_amount || 0,
          funded: parsed.funded_amount || 0, repaid: parsed.repaid_amount || 0,
          status: parsed.status || 1, tierRequired: parsed.tier_required || 0,
          deadline: parsed.deadline || 0,
        });
        const txnsRes = await fetchLoanTxns(application_id);
        setTxns(txnsRes.transactions || []);
      } catch (err) {
        console.error('Load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [application_id, isStaticProfile]);

  const handleAction = async (actionFn: any, payload: any) => {
    setError(null);
    if (!connectedAddress) { setError('Connect wallet first!'); return; }
    try {
      setActionLoading(true);
      const { txns: encodedTxns } = await actionFn(payload);
      const txId = await signAndSendTxns(encodedTxns);
      setSuccessTxId(txId);
    } catch (err: any) {
      setError(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  /* ─── Static Profile View ──────────────────────────────────── */
  if (isStaticProfile && staticProfile) {
    const trustColor = getTrustColor(staticProfile.trustScore);
    const riskScore = Math.max(5, 100 - staticProfile.trustScore);
    const riskColor = getRiskColor(riskScore);

    return (
      <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Borrower Story */}
          <div className="card card-elevated" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="avatar avatar-lg" style={{ background: getAvatarColor(staticProfile.name), width: '80px', height: '80px', fontSize: '1.5rem' }}>
                {getInitials(staticProfile.name)}
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>
                  {staticProfile.name}
                </h1>
                <div style={{ fontSize: '0.9rem', color: 'var(--lp-slate-muted)', marginBottom: 'var(--space-md)' }}>
                  {staticProfile.state} • {categories.find(c => c.key === staticProfile.category)?.label}
                </div>

                <div style={{ fontSize: '1rem', color: 'var(--lp-slate-light)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
                  {staticProfile.name.split(' ')[0]} needs <strong>{formatCurrency(staticProfile.amount)}</strong> for <strong>{staticProfile.reason.toLowerCase()}</strong>.
                  With a trust score of {staticProfile.trustScore}, they have shown consistent reliability in the LendPool community.
                  {staticProfile.lenderCount > 0 && ` ${staticProfile.lenderCount} lender${staticProfile.lenderCount > 1 ? 's have' : ' has'} already contributed.`}
                </div>

                {/* Funding Progress */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--lp-green)', fontWeight: 600 }}>{staticProfile.fundedPct}% funded</span>
                    <span style={{ color: 'var(--lp-slate-muted)' }}>Goal: {formatCurrency(staticProfile.amount)}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '12px' }}>
                    <div className="progress-bar__fill" style={{ width: `${staticProfile.fundedPct}%` }} />
                  </div>
                </div>

                {/* Amount funded */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--lp-green)' }}>
                  {formatCurrency(Math.round(staticProfile.amount * staticProfile.fundedPct / 100))}
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--lp-slate-muted)', marginLeft: '8px' }}>
                    of {formatCurrency(staticProfile.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Risk Scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <div className="card card-elevated" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', marginBottom: '8px', fontWeight: 500 }}>Trust Score</div>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto',
                border: `4px solid ${trustColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: trustColor,
              }}>
                {staticProfile.trustScore}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', marginTop: '8px' }}>
                {staticProfile.trustScore >= 80 ? ' Excellent' : staticProfile.trustScore >= 60 ? ' Good' : ' Building'}
              </div>
            </div>
            <div className="card card-elevated" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', marginBottom: '8px', fontWeight: 500 }}>Risk Score</div>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto',
                border: `4px solid ${riskColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: riskColor,
              }}>
                {riskScore}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', marginTop: '8px' }}>
                {riskScore <= 20 ? ' Low Risk' : riskScore <= 40 ? ' Moderate' : ' High Risk'}
              </div>
            </div>
          </div>

          {/* Attestations — On-Chain History */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
              On-Chain Attestations
            </h2>
            {demoReceipts.map(receipt => (
              <div className="receipt-card" key={receipt.id}>
                <div className="receipt-card__narrative">{receipt.narrative}</div>
                <div className="receipt-card__stats">
                  <span className="pill pill-paid">CLOSED ✓</span>
                  <span>Duration: {receipt.durationMonths}mo</span>
                  <span>On-time: {receipt.onTime}/{receipt.totalInstallments}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Installment Schedule */}
          <div className="card card-elevated" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
              Installment Schedule
            </h2>
            <div className="table-wrapper">
              <table className="lp-table">
                <thead>
                  <tr><th>#</th><th>Due Date</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {demoInstallments.map(inst => (
                    <tr key={inst.number}>
                      <td>{inst.number}</td>
                      <td>{inst.dueDate}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(inst.amount)}</td>
                      <td>
                        <span className={pillClass[inst.status]}>
                          {pillLabel[inst.status]}
                          {inst.delayDays && <span style={{ marginLeft: '4px', fontSize: '0.7rem' }}>+{inst.delayDays}d</span>}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lender Activity Feed */}
          <div className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
              Lender Activity
            </h2>
            {demoLenderActivity.map((lender, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-sm) 0',
                borderBottom: i < demoLenderActivity.length - 1 ? '1px solid var(--lp-border-light)' : 'none',
              }}>
                <div className="avatar avatar-sm" style={{ background: getAvatarColor(lender.name) }}>
                  {getInitials(lender.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lender.name}</span>
                  <span style={{ color: 'var(--lp-slate-muted)', fontSize: '0.82rem', marginLeft: '6px' }}>lent {formatCurrency(lender.amount)}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)' }}>{lender.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── On-Chain Loan View (existing functionality) ──────────── */
  if (loading) {
    return (
      <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--lp-slate-muted)' }}>
        Loading Loan Details...
      </div>
    );
  }

  if (!loan) {
    return (
      <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--lp-slate-muted)' }}>
        Loan not found
      </div>
    );
  }

  const isBorrower = connectedAddress === loan.borrower;
  const goalAlgo = loan.goal / 1e6;
  const fundedAlgo = loan.funded / 1e6;
  const pct = goalAlgo > 0 ? Math.min(100, Math.round((fundedAlgo / goalAlgo) * 100)) : 0;
  const statusMap: any = { 1: 'OPEN', 2: 'FUNDED', 3: 'REPAYING', 4: 'CLOSED', 5: 'DEFAULTED' };
  const statusStr = statusMap[loan.status] || 'UNKNOWN';

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card card-elevated" style={{ padding: 'var(--space-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--lp-border-light)', paddingBottom: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>
                Borrower: {loan.borrower.substring(0, 10)}...
              </h1>
              <div className="pill pill-paid">Tier {loan.tierRequired}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`pill ${statusStr === 'OPEN' ? 'pill-upcoming' : statusStr === 'CLOSED' ? 'pill-paid' : 'pill-paid-late'}`}>
                {statusStr}
              </span>
              <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--lp-slate-muted)' }}>
                {Math.max(0, Math.ceil((loan.deadline - Date.now() / 1000) / 86400))} days remaining
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.95rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--lp-green)' }}>{fundedAlgo} ALGO funded ({pct}%)</span>
              <span style={{ color: 'var(--lp-slate-muted)' }}>{goalAlgo} ALGO Goal</span>
            </div>
            <div className="progress-bar" style={{ height: '12px' }}>
              <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--lp-danger)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {successTxId && (
            <div style={{ background: 'rgba(13,79,60,0.06)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--lp-green)', fontWeight: 600 }}>
               TX: {successTxId.substring(0, 12)}...
              <a href={`https://testnet.explorer.perawallet.app/tx/${successTxId}`} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: 'var(--lp-gold)' }}>View ↗</a>
            </div>
          )}

          {/* Fund */}
          {statusStr === 'OPEN' && !isBorrower && (
            <div style={{ background: 'var(--lp-surface-raised)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-lg)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)', color: 'var(--lp-slate)' }}>Fund this Loan</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="number" placeholder="Amount (ALGO)" value={fundAmount} onChange={e => setFundAmount(e.target.value)} style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={() => handleAction(fundLoan, { lender_address: connectedAddress, app_id: application_id, amount_microalgos: parseInt(fundAmount) * 1e6 })} disabled={actionLoading || !fundAmount}>
                  {actionLoading ? 'Processing...' : 'Fund'}
                </button>
              </div>
            </div>
          )}

          {/* Repay */}
          {statusStr === 'REPAYING' && isBorrower && (
            <div style={{ background: 'rgba(200,151,43,0.06)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-lg)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--lp-gold-dark)', marginBottom: 'var(--space-md)' }}>Make Repayment</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="number" placeholder="Amount (ALGO)" value={repayAmount} onChange={e => setRepayAmount(e.target.value)} style={{ flex: 1, borderColor: 'var(--lp-gold)' }} />
                <button className="btn btn-gold" onClick={() => handleAction(repayLoan, { borrower_address: connectedAddress, app_id: application_id, amount_microalgos: parseInt(repayAmount) * 1e6 })} disabled={actionLoading || !repayAmount}>
                  {actionLoading ? 'Processing...' : 'Repay'}
                </button>
              </div>
            </div>
          )}

          {/* Claim */}
          {statusStr === 'CLOSED' && (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg)', background: 'var(--lp-surface-raised)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-primary" onClick={() => handleAction(claimRepayment, { lender_address: connectedAddress, app_id: application_id })} disabled={actionLoading}>
                {actionLoading ? 'Claiming...' : 'Claim My Share'}
              </button>
            </div>
          )}

          {/* Explorer Link */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '0.9rem' }}>
            <a href={`https://testnet.explorer.perawallet.app/application/${application_id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--lp-gold)', fontWeight: 600, textDecoration: 'none' }}>
              View contract on Algorand ↗
            </a>
          </div>
        </div>

        {/* Transaction History */}
        {txns.length > 0 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-lg)', fontSize: '1.4rem', color: 'var(--lp-slate)' }}>
              Transaction History
            </h2>
            <div className="card card-elevated" style={{ padding: 0 }}>
              {txns.map(tx => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--lp-border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--lp-slate)' }}>
                      {tx['tx-type'] === 'appl' ? 'Contract Call' : 'Payment'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', marginTop: '2px' }}>
                      {new Date(tx['round-time'] * 1000).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {tx['tx-type'] === 'pay' && tx['payment-transaction'] && (
                      <div style={{ fontWeight: 700, color: 'var(--lp-green)', marginBottom: '2px' }}>
                        {(tx['payment-transaction'].amount / 1e6).toFixed(2)} ALGO
                      </div>
                    )}
                    <a href={`https://testnet.explorer.perawallet.app/tx/${tx.id}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: 'var(--lp-gold)', textDecoration: 'none' }}>
                      {tx.id.substring(0, 8)}... ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
