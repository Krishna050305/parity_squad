/* ── LendPool Shared Type Definitions ─────────────────────────── */

export type LoanCategory = 'agriculture' | 'medical' | 'education' | 'housing' | 'business';

export type InstallmentStatus = 'upcoming' | 'paid' | 'paid_late' | 'overdue';
export type LoanStatus = 'OPEN' | 'FUNDED' | 'REPAYING' | 'CLOSED' | 'DEFAULTED';

export interface BorrowerProfile {
  appId?: number;
  walletAddress: string;
  name: string;
  state: string;
  category: LoanCategory;
  purpose: string;
  amountINR: number;
  fundedPercent: number;
  trustScore: number;
  riskScore: number;
  lenderCount: number;
  tier: 0 | 1 | 2 | 3;
  guarantor?: GuarantorInfo;
  vouchers?: VoucherInfo[];
  receipts?: LoanReceipt[];
  installmentSchedule?: Installment[];
}

export interface GuarantorInfo {
  walletAddress: string;
  name: string;
  trustScore: number;
  status: 'pending' | 'approved' | 'declined';
}

export interface VoucherInfo {
  id: string;
  walletAddress: string;
  name: string;
  trustScore: number;
  loansBacked: number;
  bio: string;
  isActive: boolean;
}

export interface LoanReceipt {
  loanId: string;
  narrative: string;
  closedDate: string;
  status: 'CLOSED' | 'DEFAULTED';
  onTimeCount: number;
  lateCount: number;
  lenderCount: number;
}

export interface Installment {
  no: number;
  dueDate: string;
  amountMicroAlgos: number;
  status: InstallmentStatus;
  paidDate?: string;
  daysLate?: number;
}

export interface UserProfile {
  walletAddress: string;
  name: string;
  role: string;
  tier: 0 | 1 | 2 | 3;
  trustScore: number;
  riskScore: number;
  totalLoans: number;
  onTimePayments: number;
  latePayments: number;
  activeLoanAppId: number | null;
  receipts: string[];
  totalLoansBacked: number;
}

export interface Notification {
  id: string;
  borrowerWallet: string;
  borrowerName: string;
  guarantorWallet: string;
  amount: number;
  trustScore: number;
  riskScore: number;
  receiptPreview: string;
  appId: number;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface LendPoolApiError {
  code: string;
  message: string;
  suggestion: string;
}

export interface ScheduleResponse {
  schedule: Array<{
    installment_no: number;
    due_date: string;
    amount_microalgos: number;
    status: string;
    paid_date: string | null;
    days_late: number;
  }>;
  total_installments?: number;
}

export interface ScoreUpdateResponse {
  walletAddress: string;
  eventType: string;
  oldTrustScore: number;
  newTrustScore: number;
  oldRiskScore: number;
  newRiskScore: number;
  delta: { trust: number; risk: number };
}
