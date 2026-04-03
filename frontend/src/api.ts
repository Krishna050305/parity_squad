const BASE_URL = "http://localhost:8000";

export interface CreateLoanParams {
  borrower_address: string;
  goal_microalgos: number;
  duration_days: number;
  tier_required: number;
  badge_asa_id?: number;
}

export interface FundLoanParams {
  lender_address: string;
  app_id: number;
  amount_microalgos: number;
}

export interface RepayLoanParams {
  borrower_address: string;
  app_id: number;
  amount_microalgos: number;
}

export async function fetchLoans() {
  const res = await fetch(`${BASE_URL}/loans`);
  if (!res.ok) throw new Error("Failed to fetch loans");
  return res.json();
}

export async function fetchLoanState(appId: number) {
  const res = await fetch(`${BASE_URL}/loans/${appId}/state`);
  if (!res.ok) throw new Error(`Failed to fetch state for loan ${appId}`);
  return res.json();
}

export async function fetchLoanTxns(appId: number) {
  const res = await fetch(`${BASE_URL}/loans/${appId}/txns`);
  if (!res.ok) throw new Error(`Failed to fetch transactions for loan ${appId}`);
  return res.json();
}

export async function createLoan(params: CreateLoanParams): Promise<{ txns: string[] }> {
  const res = await fetch(`${BASE_URL}/loans/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      badge_asa_id: params.badge_asa_id || 0
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create loan transaction");
  }
  return res.json();
}

export async function fundLoan(params: FundLoanParams): Promise<{ txns: string[] }> {
  const res = await fetch(`${BASE_URL}/loans/fund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fund loan transaction");
  }
  return res.json();
}

export async function repayLoan(params: RepayLoanParams): Promise<{ txns: string[] }> {
  const res = await fetch(`${BASE_URL}/loans/repay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to repay loan transaction");
  }
  return res.json();
}

export async function claimRepayment(appId: number, lenderAddress: string): Promise<{ txns: string[] }> {
  const res = await fetch(`${BASE_URL}/loans/${appId}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lender_address: lenderAddress }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to claim repayment transaction");
  }
  return res.json();
}
