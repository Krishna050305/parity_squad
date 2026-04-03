"""Demo seed data and in-memory state management for LendPool."""

import uuid
from datetime import datetime, timedelta
from typing import Optional

# ── Demo Vouchers ────────────────────────────────────────────────
DEMO_VOUCHERS = [
    {
        "id": "v1",
        "name": "Ravi Kumar",
        "wallet": "RAVI_KUMAR_WALLET",
        "trust_score": 88,
        "loans_backed": 12,
        "bio": "I vouch for responsible borrowers",
        "is_active": True,
    },
    {
        "id": "v2",
        "name": "Sneha Joshi",
        "wallet": "SNEHA_JOSHI_WALLET",
        "trust_score": 92,
        "loans_backed": 18,
        "bio": "Building community one loan at a time",
        "is_active": True,
    },
    {
        "id": "v3",
        "name": "Amit Patel",
        "wallet": "AMIT_PATEL_WALLET",
        "trust_score": 85,
        "loans_backed": 9,
        "bio": "Here to help genuine borrowers",
        "is_active": True,
    },
    {
        "id": "v4",
        "name": "Priyanka Singh",
        "wallet": "PRIYANKA_SINGH_WALLET",
        "trust_score": 79,
        "loans_backed": 6,
        "bio": "Peer lending made trustworthy",
        "is_active": True,
    },
    {
        "id": "v5",
        "name": "Venkat Rao",
        "wallet": "VENKAT_RAO_WALLET",
        "trust_score": 91,
        "loans_backed": 15,
        "bio": "Strong community = strong economy",
        "is_active": True,
    },
    {
        "id": "v6",
        "name": "Meera Pillai",
        "wallet": "MEERA_PILLAI_WALLET",
        "trust_score": 83,
        "loans_backed": 11,
        "bio": "Helping hands, verified wallets",
        "is_active": True,
    },
]

# ── Demo Users (seed data, simulates DB) ─────────────────────────
DEMO_USERS: dict = {
    "RAVI_KUMAR_WALLET": {
        "name": "Ravi Kumar",
        "role": "guarantor_and_lender",
        "email": True,
        "phone": True,
        "pan": "hashed_pan_ravi",
        "tier": 3,
        "trust_score": 88,
        "risk_score": 12,
        "total_loans_backed": 12,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [
            "Ravi Kumar successfully guaranteed Priya's ₹15,000 loan (medical). Repaid in full, 8 days early. 2026.",
            "Ravi Kumar backed Arvind's ₹22,000 loan (education). 3 installments paid on time, 1 paid 2 days late. Closed 2025.",
            "Ravi Kumar co-vouched for Sunita's ₹9,500 agricultural loan. Repaid across 4 installments, all on time. Closed 2025.",
        ],
    },
    "SNEHA_JOSHI_WALLET": {
        "name": "Sneha Joshi",
        "role": "lender_and_voucher",
        "email": True,
        "phone": True,
        "pan": "hashed_pan_sneha",
        "tier": 3,
        "trust_score": 92,
        "risk_score": 8,
        "total_loans_backed": 18,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [
            "Sneha Joshi lent ₹5,000 to 3 borrowers across agriculture and education. All repaid on time. 2025.",
        ],
    },
    "AMIT_PATEL_WALLET": {
        "name": "Amit Patel",
        "role": "lender_and_voucher",
        "email": True,
        "phone": True,
        "pan": "hashed_pan_amit",
        "tier": 2,
        "trust_score": 85,
        "risk_score": 15,
        "total_loans_backed": 9,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [],
    },
    "PRIYANKA_SINGH_WALLET": {
        "name": "Priyanka Singh",
        "role": "voucher",
        "email": True,
        "phone": True,
        "pan": None,
        "tier": 2,
        "trust_score": 79,
        "risk_score": 21,
        "total_loans_backed": 6,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [],
    },
    "VENKAT_RAO_WALLET": {
        "name": "Venkat Rao",
        "role": "lender_and_voucher",
        "email": True,
        "phone": True,
        "pan": "hashed_pan_venkat",
        "tier": 3,
        "trust_score": 91,
        "risk_score": 9,
        "total_loans_backed": 15,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [
            "Venkat Rao guaranteed 5 loans totaling ₹1,20,000. All repaid successfully. 2024–2025.",
        ],
    },
    "MEERA_PILLAI_WALLET": {
        "name": "Meera Pillai",
        "role": "voucher",
        "email": True,
        "phone": True,
        "pan": "hashed_pan_meera",
        "tier": 2,
        "trust_score": 83,
        "risk_score": 17,
        "total_loans_backed": 11,
        "active_notifications": [],
        "password": "demo123",
        "receipts": [],
    },
}

# ── Score Impact Deltas ──────────────────────────────────────────
SCORE_DELTAS = {
    "loan_repaid_ontime":           {"trust": +5,   "risk": -3},
    "loan_repaid_late":             {"trust": -2,   "risk": +5},
    "loan_defaulted":               {"trust": -15,  "risk": +20},
    "guarantor_borrower_repaid":    {"trust": +10,  "risk": -5},
    "guarantor_borrower_defaulted": {"trust": -40,  "risk": +30},
    "vouched_borrower_repaid":      {"trust": +0,   "risk": -1},
    "vouched_borrower_defaulted":   {"trust": +0,   "risk": +3},
}

# ── Tier Limits (in microAlgos) ──────────────────────────────────
TIER_LIMITS_INR = {
    0: 41_500,      # ~500 ALGO
    1: 83_000,      # ~1000 ALGO
    2: 4_15_000,    # ~5000 ALGO
    3: 8_30_000,    # ~10000 ALGO
}

INR_PER_ALGO = 83  # Approximate conversion rate

# ── In-Memory State ──────────────────────────────────────────────
# Notifications store
notifications_store: dict = {}

# Loan schedules store (app_id -> schedule)
loan_schedules: dict = {}

# Loan metadata store (app_id -> {purpose, category, borrower, ...})
loan_metadata: dict = {}

# Loan receipts store (app_id -> receipt string)
loan_receipts: dict = {}


def get_user(wallet: str) -> dict:
    """Get or create a user record."""
    if wallet not in DEMO_USERS:
        DEMO_USERS[wallet] = {
            "name": f"User_{wallet[:8]}",
            "role": "borrower",
            "email": False,
            "phone": False,
            "pan": None,
            "tier": 0,
            "trust_score": 50,
            "risk_score": 50,
            "total_loans_backed": 0,
            "active_notifications": [],
            "password": "1234",
            "receipts": [],
        }
    return DEMO_USERS[wallet]


def create_notification(
    borrower_wallet: str,
    guarantor_wallet: str,
    app_id: int,
    amount: int = 0,
) -> str:
    """Create a guarantor notification and return its ID."""
    notif_id = str(uuid.uuid4())[:8]
    borrower = get_user(borrower_wallet)

    notifications_store[notif_id] = {
        "id": notif_id,
        "borrower_wallet": borrower_wallet,
        "borrower_name": borrower.get("name", "Unknown"),
        "guarantor_wallet": guarantor_wallet,
        "amount": amount,
        "trust_score": borrower.get("trust_score", 50),
        "risk_score": borrower.get("risk_score", 50),
        "receipt_preview": borrower.get("receipts", ["No prior history"])[-1] if borrower.get("receipts") else "No prior history",
        "app_id": app_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }

    # Add to guarantor's active notifications
    guarantor = get_user(guarantor_wallet)
    if "active_notifications" not in guarantor:
        guarantor["active_notifications"] = []
    guarantor["active_notifications"].append(notif_id)

    return notif_id


def build_schedule(
    amount_microalgos: int,
    tenure_months: int,
    frequency: str,
    start_date_str: str,
) -> list[dict]:
    """Calculate installment schedule with amounts and due dates."""
    start_date = datetime.fromisoformat(start_date_str)

    if frequency == "weekly":
        count = tenure_months * 4
        delta = timedelta(weeks=1)
    elif frequency == "biweekly":
        count = tenure_months * 2
        delta = timedelta(weeks=2)
    else:  # monthly
        count = tenure_months
        delta = timedelta(days=30)

    installment_amount = amount_microalgos // count
    remainder = amount_microalgos - (installment_amount * count)

    schedule = []
    for i in range(count):
        due_date = start_date + (delta * (i + 1))
        amt = installment_amount + (remainder if i == count - 1 else 0)
        schedule.append({
            "installment_no": i + 1,
            "due_date": due_date.strftime("%Y-%m-%d"),
            "amount_microalgos": amt,
            "status": "upcoming",
            "paid_date": None,
            "days_late": 0,
        })

    return schedule


def generate_receipt_text(
    app_id: int,
    borrower_name: str,
    amount_inr: int,
    purpose: str,
    start_date: str,
    guarantor_name: Optional[str] = None,
    voucher_names: Optional[list[str]] = None,
    schedule: Optional[list[dict]] = None,
    lender_count: int = 0,
) -> str:
    """Generate a human-readable loan receipt narrative."""
    # Guarantor/voucher line
    trust_line = ""
    if guarantor_name:
        trust_line = f"{guarantor_name} guaranteed this loan."
    elif voucher_names:
        trust_line = f"Vouched by {', '.join(voucher_names)}."
    else:
        trust_line = "Self-started at verified tier."

    # Repayment narrative
    if schedule:
        total = len(schedule)
        on_time = sum(1 for s in schedule if s["status"] == "paid" and s["days_late"] == 0)
        late = sum(1 for s in schedule if s["status"] == "paid" and s["days_late"] > 0)
        repay_line = f"{on_time}/{total} installments paid on time"
        if late > 0:
            repay_line += f", {late} paid late"
        repay_line += ". Repaid in full."
    else:
        repay_line = "Repayment details not available."

    receipt = (
        f"{borrower_name} borrowed ₹{amount_inr:,} for {purpose} on {start_date}. "
        f"{trust_line} "
        f"{repay_line} "
        f"{lender_count} lender{'s' if lender_count != 1 else ''} contributed."
    )
    return receipt
