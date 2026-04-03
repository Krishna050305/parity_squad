const BASE_URL = "http://localhost:8000";

export const fetchLoans = () => fetch(`${BASE_URL}/loans`).then(r => r.json());
export const fetchLoanState = (appId: number) => fetch(`${BASE_URL}/loans/${appId}/state`).then(r => r.json());
export const fetchLoanTxns = (appId: number) => fetch(`${BASE_URL}/loans/${appId}/txns`).then(r => r.json());

export const createLoan = (params: { borrower_address: string; goal_microalgos: number; duration_days: number; tier_required: number }) => 
    fetch(`${BASE_URL}/loans/create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) }).then(r => r.json());
    
export const fundLoan = (params: { lender_address: string; app_id: number; amount_microalgos: number }) => 
    fetch(`${BASE_URL}/loans/fund`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) }).then(r => r.json());

export const repayLoan = (params: { borrower_address: string; app_id: number; amount_microalgos: number }) => 
    fetch(`${BASE_URL}/loans/repay`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) }).then(r => r.json());

export const claimRepayment = (appId: number, lenderAddress: string) => 
    fetch(`${BASE_URL}/loans/${appId}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lender_address: lenderAddress, app_id: appId }) }).then(r => r.json());
