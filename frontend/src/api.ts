import algosdk from 'algosdk';

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

export const addGuarantor = (params: { borrower_address: string; app_id: number; guarantor_address: string }) =>
    fetch(`${BASE_URL}/loans/add_guarantor`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) }).then(r => r.json());

export const parseGlobalState = (stateArray: any[]) => {
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
                if (state.status === 4) { // CLOSED / REPAID
                    repaid++;
                }
            }
        }
        
        if (total === 0) return 100; // default for new users
        return Math.round((repaid / total) * 100);
    } catch (e) {
        return null;
    }
};
