// Note: types might be loosely defined or imported from data if they don't exactly match BorrowerProfile
export interface DemoBorrowerProfile {
  id: string;
  name: string;
  state: string;
  category: string;
  purpose: string;
  amount_inr: number;
  funded_percent: number;
  trust_score: number;
  risk_score: number;
  lender_count: number;
  tier: number;
  days_remaining: number;
  trust_path: string;
  guarantor?: string;
  vouchers?: string[];
  attestations?: string;
  receipt?: string | null;
}

export const DEMO_BORROWERS: DemoBorrowerProfile[] = [
    // Agriculture
    {"id": "agri-001", "name": "Ramesh Patel", "state": "Gujarat", "category": "agriculture",
     "purpose": "Installing drip irrigation system to reduce water waste on 2-acre farm",
     "amount_inr": 18000, "funded_percent": 78, "trust_score": 82, "risk_score": 18,
     "lender_count": 3, "tier": 2, "days_remaining": 12,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "attestations": "First-time borrower. Ravi Kumar vouched personally.",
     "receipt": null
    },
    {"id": "agri-002", "name": "Sunita Devi", "state": "Bihar", "category": "agriculture",
     "purpose": "Purchasing high-yield paddy seeds and organic fertilizer for kharif season",
     "amount_inr": 12000, "funded_percent": 45, "trust_score": 71, "risk_score": 29,
     "lender_count": 2, "tier": 1, "days_remaining": 18,
     "trust_path": "vouch", "vouchers": ["Ravi Kumar", "Sneha Joshi"],
     "receipt": "Sunita borrowed ₹8,000 for rabi season seeds in 2024. Repaid in 3 installments, all on time. 2 lenders gave 5-star reviews."
    },
    {"id": "agri-003", "name": "Kiran Rao", "state": "Andhra Pradesh", "category": "agriculture",
     "purpose": "Security deposit for 3-month tractor rental for sugarcane harvest",
     "amount_inr": 25000, "funded_percent": 91, "trust_score": 88, "risk_score": 12,
     "lender_count": 5, "tier": 2, "days_remaining": 4,
     "trust_path": "guarantor", "guarantor": "Venkat Rao",
     "receipt": "Kiran borrowed ₹20,000 in 2024 for fertilizer bulk purchase. Repaid 5 months early. 4 lenders praised his communication."
    },
    {"id": "agri-004", "name": "Mohammed Yusef", "state": "Rajasthan", "category": "agriculture",
     "purpose": "Expanding goat farming operation — adding 8 goats to existing herd of 5",
     "amount_inr": 9500, "funded_percent": 20, "trust_score": 65, "risk_score": 35,
     "lender_count": 1, "tier": 1, "days_remaining": 25,
     "trust_path": "solo", "vouchers": [],
     "receipt": null
    },

    // Medical
    {"id": "med-001", "name": "Priya Nair", "state": "Kerala", "category": "medical",
     "purpose": "Father's bilateral cataract surgery at Aravind Eye Hospital",
     "amount_inr": 30000, "funded_percent": 60, "trust_score": 90, "risk_score": 10,
     "lender_count": 7, "tier": 3, "days_remaining": 8,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "receipt": "Priya borrowed ₹15,000 in 2025 for mother's knee surgery. Paid early. 5 lenders gave maximum rating."
    },
    {"id": "med-002", "name": "Arvind Gupta", "state": "Madhya Pradesh", "category": "medical",
     "purpose": "6-month supply of insulin and diabetes medication for self-management",
     "amount_inr": 22000, "funded_percent": 33, "trust_score": 74, "risk_score": 26,
     "lender_count": 3, "tier": 2, "days_remaining": 20,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "receipt": null
    },
    {"id": "med-003", "name": "Fatima Shaikh", "state": "Maharashtra", "category": "medical",
     "purpose": "6 months of physiotherapy sessions for 4-year-old daughter's cerebral palsy",
     "amount_inr": 15000, "funded_percent": 88, "trust_score": 85, "risk_score": 15,
     "lender_count": 4, "tier": 2, "days_remaining": 3,
     "trust_path": "vouch", "vouchers": ["Meera Pillai", "Priyanka Singh"],
     "receipt": "Fatima borrowed ₹10,000 for childbirth expenses in 2024. All 4 installments paid on time. 3 lenders."
    },
    {"id": "med-004", "name": "Deepak Sharma", "state": "Uttar Pradesh", "category": "medical",
     "purpose": "Partial financing for knee replacement surgery — AIIMS Delhi waitlist",
     "amount_inr": 40000, "funded_percent": 12, "trust_score": 61, "risk_score": 39,
     "lender_count": 1, "tier": 1, "days_remaining": 30,
     "trust_path": "solo",
     "receipt": null
    },

    // Education
    {"id": "edu-001", "name": "Ananya Mishra", "state": "Odisha", "category": "education",
     "purpose": "UPSC coaching fees at Vision IAS, Delhi — 6-month classroom program",
     "amount_inr": 8000, "funded_percent": 95, "trust_score": 93, "risk_score": 7,
     "lender_count": 9, "tier": 2, "days_remaining": 2,
     "trust_path": "vouch", "vouchers": ["Sneha Joshi", "Amit Patel"],
     "receipt": "Ananya borrowed ₹5,000 for UPSC prelim materials in 2024. Repaid ahead of schedule. 6 lenders. Zero late payments."
    },
    {"id": "edu-002", "name": "Raju Verma", "state": "Jharkhand", "category": "education",
     "purpose": "ITI welding certification course + toolkit purchase",
     "amount_inr": 14000, "funded_percent": 67, "trust_score": 79, "risk_score": 21,
     "lender_count": 5, "tier": 2, "days_remaining": 14,
     "trust_path": "guarantor", "guarantor": "Venkat Rao",
     "receipt": "Raju borrowed ₹10,000 for electrician course in 2024. 3/4 installments on time, 1 paid 4 days late."
    },
    {"id": "edu-003", "name": "Pooja Iyer", "state": "Tamil Nadu", "category": "education",
     "purpose": "Nursing entrance exam coaching and study material subscription",
     "amount_inr": 20000, "funded_percent": 40, "trust_score": 76, "risk_score": 24,
     "lender_count": 3, "tier": 2, "days_remaining": 22,
     "trust_path": "vouch", "vouchers": ["Meera Pillai", "Ravi Kumar"],
     "receipt": null
    },
    {"id": "edu-004", "name": "Sanjay Das", "state": "West Bengal", "category": "education",
     "purpose": "1-year computer hardware & networking diploma at NIIT",
     "amount_inr": 11000, "funded_percent": 22, "trust_score": 68, "risk_score": 32,
     "lender_count": 2, "tier": 1, "days_remaining": 28,
     "trust_path": "solo",
     "receipt": null
    },
    {"id": "edu-005", "name": "Meena Kumari", "state": "Haryana", "category": "education",
     "purpose": "B.Ed program admission fees — MD University, Rohtak",
     "amount_inr": 16000, "funded_percent": 55, "trust_score": 80, "risk_score": 20,
     "lender_count": 4, "tier": 2, "days_remaining": 16,
     "trust_path": "guarantor", "guarantor": "Sneha Joshi",
     "receipt": "Meena borrowed ₹12,000 for BA final year fees in 2024. All payments on time. 3 lenders."
    },

    // Housing
    {"id": "house-001", "name": "Vikram Singh", "state": "Punjab", "category": "housing",
     "purpose": "Emergency roof repair before monsoon season — asbestos sheet replacement",
     "amount_inr": 35000, "funded_percent": 70, "trust_score": 84, "risk_score": 16,
     "lender_count": 6, "tier": 2, "days_remaining": 9,
     "trust_path": "guarantor", "guarantor": "Amit Patel",
     "receipt": "Vikram borrowed ₹25,000 for kitchen remodeling in 2024. Repaid in 6 monthly installments, all on time."
    },
    {"id": "house-002", "name": "Geeta Yadav", "state": "Uttar Pradesh", "category": "housing",
     "purpose": "Kitchen renovation — replacing 15-year-old platform and fitting gas pipeline",
     "amount_inr": 18000, "funded_percent": 38, "trust_score": 72, "risk_score": 28,
     "lender_count": 2, "tier": 1, "days_remaining": 19,
     "trust_path": "solo",
     "receipt": null
    },
    {"id": "house-003", "name": "Abdul Karim", "state": "Karnataka", "category": "housing",
     "purpose": "Bathroom renovation and complete plumbing replacement — 30-year-old pipes",
     "amount_inr": 28000, "funded_percent": 82, "trust_score": 87, "risk_score": 13,
     "lender_count": 5, "tier": 2, "days_remaining": 6,
     "trust_path": "vouch", "vouchers": ["Venkat Rao", "Ravi Kumar"],
     "receipt": "Abdul borrowed ₹20,000 for home painting in 2025. Repaid 2 months early. 4 lenders."
    },
    {"id": "house-004", "name": "Lata Patil", "state": "Maharashtra", "category": "housing",
     "purpose": "Steel window grills and door locks for ground floor safety",
     "amount_inr": 12000, "funded_percent": 15, "trust_score": 60, "risk_score": 40,
     "lender_count": 1, "tier": 0, "days_remaining": 29,
     "trust_path": "solo",
     "receipt": null
    },

    // Business
    {"id": "biz-001", "name": "Rohit Agarwal", "state": "Delhi", "category": "business",
     "purpose": "Restocking mobile repair shop — 50 phone screens and 30 battery units",
     "amount_inr": 45000, "funded_percent": 85, "trust_score": 91, "risk_score": 9,
     "lender_count": 8, "tier": 3, "days_remaining": 5,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "receipt": "Rohit borrowed ₹30,000 for shop expansion in 2024. Paid all 4 installments ahead of schedule. 6 lenders gave perfect scores."
    },
    {"id": "biz-002", "name": "Champa Bai", "state": "Chhattisgarh", "category": "business",
     "purpose": "Scaling homemade pickle and papad business — packaging machine purchase",
     "amount_inr": 10000, "funded_percent": 50, "trust_score": 77, "risk_score": 23,
     "lender_count": 4, "tier": 1, "days_remaining": 17,
     "trust_path": "vouch", "vouchers": ["Meera Pillai", "Priyanka Singh"],
     "receipt": "Champa borrowed ₹6,000 to start her pickle venture in 2024. Repaid in 3 months. All lenders happy."
    },
    {"id": "biz-003", "name": "Naveen Reddy", "state": "Telangana", "category": "business",
     "purpose": "Down payment for auto-rickshaw financing — will generate ₹800/day income",
     "amount_inr": 32000, "funded_percent": 25, "trust_score": 66, "risk_score": 34,
     "lender_count": 2, "tier": 1, "days_remaining": 24,
     "trust_path": "solo",
     "receipt": null
    },
    {"id": "biz-004", "name": "Jasmine Thomas", "state": "Goa", "category": "business",
     "purpose": "Two industrial sewing machines for tailoring shop expansion",
     "amount_inr": 22000, "funded_percent": 90, "trust_score": 89, "risk_score": 11,
     "lender_count": 6, "tier": 2, "days_remaining": 3,
     "trust_path": "guarantor", "guarantor": "Sneha Joshi",
     "receipt": "Jasmine borrowed ₹15,000 for embroidery machine in 2024. Repaid fully in 4 months. 5 lenders."
    },
    {"id": "biz-005", "name": "Kamal Kishore", "state": "Bihar", "category": "business",
     "purpose": "Tea stall expansion — second stall near railway station, one month deposit",
     "amount_inr": 19000, "funded_percent": 60, "trust_score": 81, "risk_score": 19,
     "lender_count": 5, "tier": 2, "days_remaining": 13,
     "trust_path": "vouch", "vouchers": ["Amit Patel", "Ravi Kumar"],
     "receipt": "Kamal borrowed ₹14,000 for first tea stall setup in 2025. 5/6 on time, 1 paid 1 day late. 4 lenders."
    }
];

export const DEMO_VOUCHERS = [
  { id: 'v1', name: 'Ravi Kumar',      city: 'Delhi',     trust_score: 88, loans_backed: 12, tagline: 'I vouch for responsible borrowers',           wallet: 'RAVI7KUMARDEMOWALLET1234567890ABCDEFGHIJK58CHARS' },
  { id: 'v2', name: 'Sneha Joshi',     city: 'Mumbai',    trust_score: 92, loans_backed: 18, tagline: 'Building community one loan at a time',       wallet: 'SNEH...J9P1' },
  { id: 'v3', name: 'Amit Patel',      city: 'Ahmedabad', trust_score: 85, loans_backed: 9,  tagline: 'Here to help genuine borrowers',              wallet: 'AMIT...P3Q7' },
  { id: 'v4', name: 'Priyanka Singh',  city: 'Pune',      trust_score: 79, loans_backed: 6,  tagline: 'Peer lending made trustworthy',               wallet: 'PRIY...S8R2' },
  { id: 'v5', name: 'Venkat Rao',      city: 'Hyderabad', trust_score: 91, loans_backed: 15, tagline: 'Strong community = strong economy',           wallet: 'VENK...R1M5' },
  { id: 'v6', name: 'Meera Pillai',    city: 'Chennai',   trust_score: 83, loans_backed: 11, tagline: 'Helping hands, verified wallets',              wallet: 'MEER...P6N4' },
];

export const RAVI_KUMAR_RECEIPTS = [
  {
      "narrative": "Ravi Kumar guaranteed Priya Nair's ₹30,000 loan for her father's cataract surgery on 15 January 2025. Priya repaid ₹5,000 early on installment 1, communicated a 2-day delay on installment 3 via the platform. She completed the loan 10 days ahead of schedule. 7 lenders gave 5-star reviews. Ravi's trust score increased by +10 after this.",
      "closed_date": "2025-07-20",
      "status": "CLOSED",
      "on_time_count": 5,
      "late_count": 1,
      "total_lenders": 7
  },
  {
      "narrative": "Ravi Kumar guaranteed Arvind Gupta's ₹22,000 loan for 6 months of diabetes medication on 3 March 2025. All 4 installments were paid on schedule. 3 lenders participated. Loan closed cleanly.",
      "closed_date": "2025-07-05",
      "status": "CLOSED",
      "on_time_count": 4,
      "late_count": 0,
      "total_lenders": 3
  },
  {
      "narrative": "Ravi Kumar co-vouched (along with Sneha Joshi) for Sunita Devi's ₹12,000 agricultural loan for seed purchase on 10 September 2024. All 3 installments paid on time. 2 lenders funded the loan.",
      "closed_date": "2024-12-15",
      "status": "CLOSED",
      "on_time_count": 3,
      "late_count": 0,
      "total_lenders": 2
  }
];

export const getBorrowersByCategory = (category: string) =>
  DEMO_BORROWERS.filter(b => b.category === category);

export const getTopVouchers = () =>
  DEMO_VOUCHERS.filter(v => v.trust_score >= 79).sort((a, b) => b.trust_score - a.trust_score);

export type TierLevel = 0 | 1 | 2 | 3 | 4;

export const TIER_LIMITS: Record<TierLevel, { algo: number; inr: number; label: string }> = {
  0: { algo: 500,   inr: 41500,  label: "Tier 0 — Wallet only" },
  1: { algo: 2000,  inr: 166000, label: "Tier 1 — Email verified" },
  2: { algo: 5000,  inr: 415000, label: "Tier 2 — Phone verified" },
  3: { algo: 20000, inr: 1660000,label: "Tier 3 — Govt ID" },
  4: { algo: 50000, inr: 4150000,label: "Tier 4 — Community vouched" }
};
