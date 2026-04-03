import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  demoReceipts, demoInstallments, demoLenderActivity,
  getTrustColor, getRiskColor, formatCurrency,
  getInitials, getAvatarColor,
  type InstallmentStatus,
} from '../data';

const pillClass: Record<InstallmentStatus, string> = {
  'paid': 'pill pill-paid',
  'paid-late': 'pill pill-paid-late',
  'upcoming': 'pill pill-upcoming',
  'overdue': 'pill pill-overdue',
};

const pillLabel: Record<InstallmentStatus, string> = {
  'paid': '✓ Paid',
  'paid-late': '⚠ Late',
  'upcoming': '○ Upcoming',
  'overdue': '✕ Overdue',
};

export const BorrowerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('lp_user') || '{}');
  const trustScore = 82;
  const riskScore = 18;
  const tier = user.tier ?? 2;
  const walletAddress = 'RAME...P4X2';
  const name = user.name || 'Ramesh Patel';

  // Next installment
  const nextInstallment = demoInstallments.find(i => i.status === 'upcoming');
  const showReminder = !!nextInstallment;

  // Loan progress
  const paidInstallments = demoInstallments.filter(i => i.status === 'paid' || i.status === 'paid-late');
  const totalPaid = paidInstallments.reduce((s, i) => s + i.amount, 0);
  const totalLoan = demoInstallments.reduce((s, i) => s + i.amount, 0);
  const repayPct = Math.round((totalPaid / totalLoan) * 100);

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--lp-ivory)', padding: 'var(--space-2xl) var(--space-xl)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* ═══ Email Reminder Banner ═══ */}
        {showReminder && nextInstallment && (
          <div className="alert-banner alert-banner--warning" style={{ marginBottom: 'var(--space-xl)' }}>
             Your next installment of <strong style={{ margin: '0 4px' }}>{formatCurrency(nextInstallment.amount)}</strong> is due on <strong style={{ marginLeft: '4px' }}>{nextInstallment.dueDate}</strong>. Please ensure ALGO coins are in your wallet.
          </div>
        )}

        {/* ═══ Header Card ═══ */}
        <div className="card card-elevated" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div className="avatar avatar-lg" style={{ background: getAvatarColor(name), width: '72px', height: '72px', fontSize: '1.4rem' }}>
              {getInitials(name)}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--lp-slate)', marginBottom: '4px' }}>
                {name}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--lp-slate-muted)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace' }}>{walletAddress}</span>
                <span className="pill pill-paid">Tier {tier}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2xl)', textAlign: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: getTrustColor(trustScore) }}>
                  {trustScore}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', fontWeight: 500 }}>Trust Score</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: getRiskColor(riskScore) }}>
                  {riskScore}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)', fontWeight: 500 }}>Risk Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Active Loan Summary ═══ */}
        <div className="card card-elevated" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }} id="payments">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-slate)' }}>Active Loan</h2>
            <span className="pill pill-paid">REPAYING</span>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--lp-green)', fontWeight: 600 }}>{formatCurrency(totalPaid)} repaid ({repayPct}%)</span>
              <span style={{ color: 'var(--lp-slate-muted)' }}>{formatCurrency(totalLoan)} total</span>
            </div>
            <div className="progress-bar" style={{ height: '10px' }}>
              <div className="progress-bar__fill" style={{ width: `${repayPct}%` }} />
            </div>
          </div>

          {/* Installment Calendar */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lp-slate)', marginBottom: 'var(--space-sm)' }}>Installment Schedule</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {demoInstallments.map(inst => (
                <div key={inst.number} className={pillClass[inst.status]} title={`${inst.dueDate} — ${formatCurrency(inst.amount)}`}>
                  #{inst.number} {pillLabel[inst.status]}
                  {inst.delayDays && <span style={{ marginLeft: '4px', fontSize: '0.7rem' }}>+{inst.delayDays}d</span>}
                </div>
              ))}
            </div>
          </div>

          {nextInstallment && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', background: 'var(--lp-surface-raised)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)' }}>Next due</div>
                <div style={{ fontWeight: 700, color: 'var(--lp-slate)' }}>{nextInstallment.dueDate} — {formatCurrency(nextInstallment.amount)}</div>
              </div>
              <button className="btn btn-primary btn-sm">Make Payment →</button>
            </div>
          )}
        </div>

        {/* ═══ On-Chain Memory Receipts ═══ */}
        <div style={{ marginBottom: 'var(--space-xl)' }} id="trust">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
            On-Chain Loan Receipts
          </h2>
          {demoReceipts.map(receipt => (
            <div className="receipt-card" key={receipt.id}>
              <div className="receipt-card__narrative">{receipt.narrative}</div>
              <div className="receipt-card__stats">
                <span className="pill pill-paid">CLOSED ✓</span>
                <span>Duration: {receipt.durationMonths} months</span>
                <span>On-time: {receipt.onTime}/{receipt.totalInstallments}</span>
                <span>Delayed: {receipt.delayed}/{receipt.totalInstallments}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ Lenders Who Funded Me ═══ */}
        <div className="card card-elevated" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--lp-slate)', marginBottom: 'var(--space-lg)' }}>
            Lenders Who Funded Me
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
            {demoLenderActivity.map((lender, i) => (
              <div key={i} style={{ padding: 'var(--space-md)', background: 'var(--lp-surface-raised)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div className="avatar avatar-sm" style={{ background: getAvatarColor(lender.name), margin: '0 auto var(--space-sm) auto' }}>
                  {getInitials(lender.name)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--lp-slate)' }}>{lender.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--lp-green)', fontWeight: 600 }}>{formatCurrency(lender.amount)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--lp-slate-muted)' }}>{lender.timeAgo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Wallet Balance (Mock) ═══ */}
        <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--lp-slate-muted)', marginBottom: '4px' }}>Wallet Balance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--lp-green)' }}>
            12.45 ALGO
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--lp-slate-muted)' }}>≈ ₹1,037 at current rates</div>
        </div>
      </div>
    </div>
  );
};
