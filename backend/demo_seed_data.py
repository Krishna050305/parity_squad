import hashlib

RAVI_KUMAR = {
    "wallet_address": "RAVI7KUMARDEMOWALLET1234567890ABCDEFGHIJK58CHARS",
    "name": "Ravi Kumar",
    "role": "both",
    "tier": 3,
    "trust_score": 88,
    "risk_score": 12,
    "email_verified": True,
    "phone_verified": True,
    "pan_hash": hashlib.sha256("ABCDE1234F".encode()).hexdigest(),
    "is_voucher": True,
    "is_guarantor": True,
    "voucher_bio": "I vouch for responsible borrowers with a proven track record.",
    "loans_backed_count": 12,
    "receipts": [
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
    ]
}

DEMO_BORROWERS = [
    # Agriculture
    {"id": "agri-001", "name": "Ramesh Patel", "state": "Gujarat", "category": "agriculture",
     "purpose": "Installing drip irrigation system to reduce water waste on 2-acre farm",
     "amount_inr": 18000, "funded_percent": 78, "trust_score": 82, "risk_score": 18,
     "lender_count": 3, "tier": 2, "days_remaining": 12,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "attestations": "First-time borrower. Ravi Kumar vouched personally.",
     "receipt": None
    },

    # Medical
    {"id": "med-001", "name": "Priya Nair", "state": "Kerala", "category": "medical",
     "purpose": "Father's bilateral cataract surgery at Aravind Eye Hospital",
     "amount_inr": 30000, "funded_percent": 60, "trust_score": 90, "risk_score": 10,
     "lender_count": 7, "tier": 3, "days_remaining": 8,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "receipt": "Priya borrowed ₹15,000 in 2025 for mother's knee surgery. Paid early. 5 lenders gave maximum rating."
    },

    # Education
    {"id": "edu-001", "name": "Ananya Mishra", "state": "Odisha", "category": "education",
     "purpose": "UPSC coaching fees at Vision IAS, Delhi — 6-month classroom program",
     "amount_inr": 8000, "funded_percent": 95, "trust_score": 93, "risk_score": 7,
     "lender_count": 9, "tier": 2, "days_remaining": 2,
     "trust_path": "vouch", "vouchers": ["Sneha Joshi", "Amit Patel"],
     "receipt": "Ananya borrowed ₹5,000 for UPSC prelim materials in 2024. Repaid ahead of schedule. 6 lenders. Zero late payments."
    },

    # Business
    {"id": "biz-001", "name": "Rohit Agarwal", "state": "Delhi", "category": "business",
     "purpose": "Restocking mobile repair shop — 50 phone screens and 30 battery units",
     "amount_inr": 45000, "funded_percent": 85, "trust_score": 91, "risk_score": 9,
     "lender_count": 8, "tier": 3, "days_remaining": 5,
     "trust_path": "guarantor", "guarantor": "Ravi Kumar",
     "receipt": "Rohit borrowed ₹30,000 for shop expansion in 2024. Paid all 4 installments ahead of schedule. 6 lenders gave perfect scores."
    },
]

DEMO_VOUCHERS = [
  { "id": 'v1', "name": 'Ravi Kumar',      "city": 'Delhi',     "trust_score": 88, "loans_backed": 12, "tagline": 'I vouch for responsible borrowers',           "wallet": 'RAVI7KUMARDEMOWALLET1234567890ABCDEFGHIJK58CHARS' },
  { "id": 'v2', "name": 'Sneha Joshi',     "city": 'Mumbai',    "trust_score": 92, "loans_backed": 18, "tagline": 'Building community one loan at a time',       "wallet": 'SNEH...J9P1' },
  { "id": 'v3', "name": 'Amit Patel',      "city": 'Ahmedabad', "trust_score": 85, "loans_backed": 9,  "tagline": 'Here to help genuine borrowers',              "wallet": 'AMIT...P3Q7' },
  { "id": 'v4', "name": 'Priyanka Singh',  "city": 'Pune',      "trust_score": 79, "loans_backed": 6,  "tagline": 'Peer lending made trustworthy',               "wallet": 'PRIY...S8R2' },
  { "id": 'v5', "name": 'Venkat Rao',      "city": 'Hyderabad', "trust_score": 91, "loans_backed": 15, "tagline": 'Strong community = strong economy',           "wallet": 'VENK...R1M5' },
  { "id": 'v6', "name": 'Meera Pillai',    "city": 'Chennai',   "trust_score": 83, "loans_backed": 11, "tagline": 'Helping hands, verified wallets',              "wallet": 'MEER...P6N4' },
]
