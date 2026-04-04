/**
 * LendPool API Client
 * All backend endpoint functions with environment-aware base URL.
 */

import algosdk from 'algosdk';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const headers = { 'Content-Type': 'application/json' };

const get = async (url: string) => {
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    console.error(`[NETWORK ERROR] ${url}:`, err);
    throw new Error("Backend server is not running. Please start the backend or check your connection.");
  }
  if (!response.ok) {
    console.warn(`[API GET ERROR] ${url}: Status ${response.status}`);
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

const post = async (url: string, body: object) => {
  let response;
  try {
    response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch (err) {
    console.error(`[NETWORK ERROR] ${url}:`, err);
    throw new Error("Backend server is not running. Please start the backend or check your connection.");
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`[API POST ERROR] ${url}: Status ${response.status}`, errorText);
    throw new Error(`Backend error (${response.status}): ${errorText}`);
  }
  return response.json();
};

export const getUserContributions = (wallet: string) =>
  get(`${BASE_URL}/users/${wallet}/contributions`);

// ══════════════════════════════════════════════════════════════════
//  AUTH & USER MANAGEMENT
// ══════════════════════════════════════════════════════════════════

export const lenderLogin = (name: string, mobile: string, otp: string) =>
  post(`${BASE_URL}/auth/lender-login`, { name, mobile, otp });

export const borrowerLogin = (userId: string, password: string) =>
  post(`${BASE_URL}/auth/borrower-login`, { user_id: userId, password });

export const borrowerRegister = (params: {
  aadhaar_hash: string;
  pan_document: string;
  otp: string;
  mobile: string;
}) => post(`${BASE_URL}/auth/borrower-register`, params);

// ══════════════════════════════════════════════════════════════════
//  COMMUNITY & TRUST PATH
// ══════════════════════════════════════════════════════════════════

export const getCommunityVouchers = () =>
  get(`${BASE_URL}/community/vouchers`);

export const submitVouchPayment = (borrowerAddress: string, voucherAddress: string) =>
  post(`${BASE_URL}/community/vouch-payment`, {
    borrower_address: borrowerAddress,
    voucher_address: voucherAddress,
    amount_inr: 500,
  });

export const requestGuarantor = (borrowerAddress: string, guarantorAddress: string, appId: number) =>
  post(`${BASE_URL}/community/request-guarantor`, {
    borrower_address: borrowerAddress,
    guarantor_address: guarantorAddress,
    app_id: appId,
  });

// ══════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════

export const getNotifications = (walletAddress: string) =>
  get(`${BASE_URL}/notifications/${walletAddress}`);

export const approveGuarantorRequest = (notificationId: string, guarantorAddress: string) =>
  post(`${BASE_URL}/notifications/${notificationId}/approve`, {
    guarantor_address: guarantorAddress,
  });

export const declineGuarantorRequest = (notificationId: string) =>
  post(`${BASE_URL}/notifications/${notificationId}/decline`, {});

// ══════════════════════════════════════════════════════════════════
//  LOANS (existing + enhanced)
// ══════════════════════════════════════════════════════════════════

export const fetchLoans = (filters?: {
  category?: string;
  min_trust?: number;
  status?: number;
}) => {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.min_trust) params.set('min_trust', String(filters.min_trust));
  if (filters?.status) params.set('status', String(filters.status));
  const qs = params.toString();
  return get(`${BASE_URL}/loans${qs ? `?${qs}` : ''}`);
};

export const fetchLoanState = (appId: number) =>
  get(`${BASE_URL}/loans/${appId}/state`);

export const fetchLoanTxns = (appId: number) =>
  get(`${BASE_URL}/loans/${appId}/txns`);

export const createLoan = (params: {
  borrower_address: string;
  goal_microalgos: number;
  duration_days: number;
  tier_required: number;
  purpose?: string;
  category?: string;
  installment_schedule?: {
    tenure_months: number;
    frequency: string;
    start_date: string;
  };
}) => post(`${BASE_URL}/loans/create`, params);

export const confirmLoanCreation = (loanId: string, appId: number) =>
  post(`${BASE_URL}/loans/${loanId}/confirm?app_id=${appId}`, {});

export const fundLoan = (params: {
  lender_address: string;
  app_id: number;
  amount_microalgos: number;
}) => post(`${BASE_URL}/loans/fund`, params);

export const repayLoan = (params: {
  borrower_address: string;
  app_id: number;
  amount_microalgos: number;
}) => post(`${BASE_URL}/loans/repay`, params);

export const claimRepayment = (appId: number, lenderAddress: string) =>
  post(`${BASE_URL}/loans/${appId}/claim`, {
    lender_address: lenderAddress,
    app_id: appId,
  });

export const addGuarantor = (params: {
  borrower_address: string;
  app_id: number;
  guarantor_address: string;
}) => post(`${BASE_URL}/loans/add_guarantor`, params);

// ══════════════════════════════════════════════════════════════════
//  INSTALLMENT SCHEDULES
// ══════════════════════════════════════════════════════════════════

export const createInstallmentSchedule = (
  appId: number,
  params: {
    amount_microalgos: number;
    tenure_months: number;
    installment_frequency: string;
    start_date: string;
  },
) => post(`${BASE_URL}/loans/${appId}/schedule`, params);

export const getInstallmentSchedule = (appId: number) =>
  get(`${BASE_URL}/loans/${appId}/schedule`);

export const payInstallment = (appId: number, installmentNo: number, borrowerAddress: string) =>
  post(`${BASE_URL}/loans/${appId}/installment/${installmentNo}/pay`, {
    borrower_address: borrowerAddress,
  });

// ══════════════════════════════════════════════════════════════════
//  LOAN RECEIPTS & USER PROFILES
// ══════════════════════════════════════════════════════════════════

export const generateReceipt = (appId: number) =>
  post(`${BASE_URL}/loans/${appId}/generate-receipt`, { app_id: appId });

export const getUserReceipts = (walletAddress: string) =>
  get(`${BASE_URL}/users/${walletAddress}/receipts`);

export const getUserProfile = (walletAddress: string) =>
  get(`${BASE_URL}/users/${walletAddress}/profile`);

// ══════════════════════════════════════════════════════════════════
//  REMINDERS & SCORES
// ══════════════════════════════════════════════════════════════════

export const checkReminders = () =>
  post(`${BASE_URL}/reminders/check`, {});

export const updateScore = (walletAddress: string, eventType: string) =>
  post(`${BASE_URL}/scores/update`, {
    wallet_address: walletAddress,
    event_type: eventType,
  });

// ══════════════════════════════════════════════════════════════════
//  HEALTH
// ══════════════════════════════════════════════════════════════════

export const healthCheck = () =>
  get(`${BASE_URL}/health`);

// ══════════════════════════════════════════════════════════════════
//  UTILITIES (kept from original)
// ══════════════════════════════════════════════════════════════════

export const parseGlobalState = (stateArray: any[]) => {
  const state: any = {};
  for (const item of stateArray) {
    const key = atob(item.key);
    if (item.value.type === 2) {
      state[key] = item.value.uint;
    } else if (item.value.type === 1 && item.value.bytes) {
      const rawBytes = Uint8Array.from(atob(item.value.bytes), (c: string) => c.charCodeAt(0));
      if (rawBytes.length === 32) {
        state[key] = algosdk.encodeAddress(rawBytes);
      } else {
        state[key] = atob(item.value.bytes);
      }
    }
  }
  return state;
};

export const calculateReputation = async (address: string): Promise<number | null> => {
  try {
    const res = await fetchLoans();
    if (!res.applications) return null;

    let total = 0;
    let repaid = 0;

    for (const app of res.applications) {
      const state = parseGlobalState(app.params['global-state'] || []);
      if (state.borrower === address) {
        total++;
        if (state.status === 4) {
          repaid++;
        }
      }
    }

    if (total === 0) return 100;
    return Math.round((repaid / total) * 100);
  } catch (e) {
    return null;
  }
};
