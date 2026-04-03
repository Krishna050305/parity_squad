"""LendPool Backend — Extended FastAPI Application.

Endpoints:
- Auth & User Management
- KYC Verification
- Trust Path & Vouch System
- Loan CRUD & Transactions
- Installment Schedules
- Loan Memory Receipts
- Reminder System (Mock)
- Score Impact (Mock ML Stubs)
"""

import os
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .kyc import verify_email_otp, verify_phone_otp, hash_pan_aadhaar, get_tier_for_verification
from .badge_minting import mint_tier_badge
from .algorand_client import get_algod
from .indexer import get_all_loans, get_loan_txns, get_wallet_history
from .transactions import (
    build_create_loan_txn,
    build_fund_loan_txns,
    build_repay_loan_txns,
    build_claim_txn,
    build_add_guarantor_txn,
)
from .models import (
    LendPoolError,
    LenderLoginRequest,
    BorrowerLoginRequest,
    BorrowerRegisterRequest,
    VerificationRequest,
    CreateLoanRequest,
    FundLoanRequest,
    RepayLoanRequest,
    ClaimRequest,
    AddGuarantorRequest,
    VouchPaymentRequest,
    GuarantorRequest,
    NotificationApproveRequest,
    CreateScheduleRequest,
    PayInstallmentRequest,
    GenerateReceiptRequest,
    UpdateScoreRequest,
)
from .demo_data import (
    DEMO_VOUCHERS,
    DEMO_USERS,
    SCORE_DELTAS,
    TIER_LIMITS_INR,
    INR_PER_ALGO,
    notifications_store,
    loan_schedules,
    loan_metadata,
    loan_receipts,
    get_user,
    create_notification,
    build_schedule,
    generate_receipt_text,
)

load_dotenv()

app = FastAPI(
    title="LendPool Backend APIs",
    description="Community-powered P2P lending on Algorand",
    version="2.0.0",
)

# CORS — restrict origins for production
_origins = ["http://localhost:5173", "http://localhost:3000"]
if os.getenv("VITE_ENVIRONMENT") == "production":
    _origins = [os.getenv("PRODUCTION_ORIGIN", "https://lendpool.app")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Legacy users_state (kept for backward compatibility with /verify) ──
users_state: dict = {}


# ══════════════════════════════════════════════════════════════════
#  Helper: Raise LendPool error
# ══════════════════════════════════════════════════════════════════
def lp_error(status: int, code: str, message: str, suggestion: str = ""):
    raise HTTPException(
        status_code=status,
        detail={
            "code": code,
            "message": message,
            "suggestion": suggestion,
        },
    )


# ══════════════════════════════════════════════════════════════════
#  1. AUTH & USER MANAGEMENT
# ══════════════════════════════════════════════════════════════════

@app.post("/auth/lender-login")
def lender_login(req: LenderLoginRequest):
    """Authenticate a lender via OTP. Mock: any 4-digit OTP works."""
    if len(req.otp) != 4 or not req.otp.isdigit():
        lp_error(400, "INVALID_OTP", "OTP must be 4 digits.", "Enter the 4-digit code sent to your mobile.")

    # Generate a deterministic wallet address from name for demo
    wallet = f"LENDER_{hashlib.md5(req.name.encode()).hexdigest()[:12].upper()}"
    token = str(uuid.uuid4())

    # Ensure user exists
    user = get_user(wallet)
    user["name"] = req.name
    user["role"] = "lender"
    user["phone"] = True

    return {
        "token": token,
        "wallet_address": wallet,
        "role": "lender",
        "name": req.name,
    }


@app.post("/auth/borrower-login")
def borrower_login(req: BorrowerLoginRequest):
    """Login a returning borrower with user_id (wallet prefix) + password."""
    # Find user by wallet prefix match
    matched_wallet = None
    for wallet, data in DEMO_USERS.items():
        if wallet.startswith(req.user_id) or req.user_id in wallet:
            if data.get("password") == req.password:
                matched_wallet = wallet
                break

    if not matched_wallet:
        # Also accept any user_id as a new wallet
        matched_wallet = req.user_id.upper()
        user = get_user(matched_wallet)
        if user.get("password") != req.password and req.password != "demo123":
            lp_error(401, "INVALID_CREDENTIALS", "Invalid user ID or password.", "Check your credentials or register as a new borrower.")

    user = get_user(matched_wallet)
    token = str(uuid.uuid4())

    return {
        "token": token,
        "wallet_address": matched_wallet,
        "role": "borrower",
        "tier": user.get("tier", 0),
        "name": user.get("name", "Borrower"),
        "trust_score": user.get("trust_score", 50),
    }


@app.post("/auth/borrower-register")
def borrower_register(req: BorrowerRegisterRequest):
    """Register a new borrower with KYC documents. Returns tier + badge."""
    # Validate Aadhaar
    if len(req.aadhaar_hash) != 12 or not req.aadhaar_hash.isdigit():
        lp_error(400, "INVALID_AADHAAR", "Aadhaar must be 12 digits.", "Enter your 12-digit Aadhaar number.")

    # Validate PAN
    pan_hash = None
    tier = 1  # default: OTP verified
    try:
        pan_hash = hash_pan_aadhaar(req.pan_document)
        tier = 3  # PAN verified = tier 3
    except ValueError:
        tier = 2  # Aadhaar only = tier 2

    # Mock OTP validation
    if req.otp != "1234" and len(req.otp) != 4:
        lp_error(400, "INVALID_OTP", "Invalid OTP.", "Enter the 4-digit OTP sent to your mobile.")

    # Create user
    wallet = f"BORR_{hashlib.md5(req.mobile.encode()).hexdigest()[:12].upper()}"
    user = get_user(wallet)
    user["name"] = f"Borrower_{wallet[5:11]}"
    user["role"] = "borrower"
    user["phone"] = True
    user["pan"] = pan_hash
    user["tier"] = tier
    user["trust_score"] = 50
    user["risk_score"] = 50
    user["password"] = req.otp  # In real app, hash this

    # Issue badge
    badge_id = int(os.getenv(f"TIER{tier}_BADGE_ID", 0))

    return {
        "user_id": wallet,
        "wallet_address": wallet,
        "tier": tier,
        "badge_asa_id": badge_id,
        "name": user["name"],
    }


# ══════════════════════════════════════════════════════════════════
#  LEGACY: KYC Verification (kept for backward compat)
# ══════════════════════════════════════════════════════════════════

@app.post("/verify")
def verify_user(req: VerificationRequest):
    if req.wallet_address not in users_state:
        users_state[req.wallet_address] = {"email": False, "phone": False, "pan": None, "tier": 0}

    state = users_state[req.wallet_address]

    if req.email_otp:
        if verify_email_otp("test@example.com", req.email_otp):
            state["email"] = True
        else:
            raise HTTPException(status_code=400, detail="Invalid email OTP")

    if req.phone_otp:
        if verify_phone_otp("1234567890", req.phone_otp):
            state["phone"] = True
        else:
            raise HTTPException(status_code=400, detail="Invalid phone OTP")

    if req.pan_document:
        try:
            state["pan"] = hash_pan_aadhaar(req.pan_document)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    tier = get_tier_for_verification(state["email"], state["phone"], state["pan"])

    issued_badge = None
    if tier > state["tier"]:
        state["tier"] = tier
        issued_badge = os.getenv(f"TIER{tier}_BADGE_ID")

    return {
        "status": "success",
        "wallet": req.wallet_address,
        "achieved_tier": state["tier"],
        "badge_asa_id": issued_badge,
    }


# ══════════════════════════════════════════════════════════════════
#  2. TRUST PATH & VOUCH SYSTEM
# ══════════════════════════════════════════════════════════════════

@app.get("/community/vouchers")
def get_vouchers():
    """Return list of eligible vouchers (trust_score > 70, is_active)."""
    return [v for v in DEMO_VOUCHERS if v.get("trust_score", 0) > 70 and v.get("is_active", True)]


@app.post("/community/vouch-payment")
def vouch_payment(req: VouchPaymentRequest):
    """Build a payment transaction for vouch fee (₹500 per voucher)."""
    if req.amount_inr != 500:
        lp_error(400, "INVALID_AMOUNT", "Vouch payment must be exactly ₹500.", "Each voucher requires a ₹500 fee.")

    # Convert INR to microAlgos (~6 ALGO at ₹83/ALGO)
    algo_amount = req.amount_inr / INR_PER_ALGO
    microalgos = int(algo_amount * 1_000_000)

    # Build payment transaction
    from .transactions import encode_txns
    from algosdk.transaction import PaymentTxn

    algod = get_algod()
    sp = algod.suggested_params()

    txn = PaymentTxn(
        sender=req.borrower_address,
        sp=sp,
        receiver=req.voucher_address,
        amt=microalgos,
        note=b"LendPool Vouch Fee",
    )

    return {
        "txns": encode_txns([txn]),
        "message": f"Pay ₹{req.amount_inr} ({algo_amount:.2f} ALGO) to voucher",
        "microalgos": microalgos,
    }


@app.post("/community/request-guarantor")
def request_guarantor(req: GuarantorRequest):
    """Send a guarantor request notification."""
    # Create notification
    notif_id = create_notification(
        borrower_wallet=req.borrower_address,
        guarantor_wallet=req.guarantor_address,
        app_id=req.app_id,
    )

    return {
        "status": "pending",
        "notification_id": notif_id,
        "message": f"Guarantor request sent to {req.guarantor_address}",
    }


@app.get("/notifications/{wallet_address}")
def get_notifications(wallet_address: str):
    """Return all pending guarantor requests for this wallet."""
    result = []
    for notif_id, notif in notifications_store.items():
        if notif["guarantor_wallet"] == wallet_address and notif["status"] == "pending":
            result.append(notif)
    return result


@app.post("/notifications/{notification_id}/approve")
def approve_notification(notification_id: str, req: NotificationApproveRequest):
    """Approve a guarantor request and call add_guarantor on-chain."""
    if notification_id not in notifications_store:
        lp_error(404, "NOT_FOUND", "Notification not found.", "Check the notification ID.")

    notif = notifications_store[notification_id]
    if notif["status"] != "pending":
        lp_error(400, "ALREADY_PROCESSED", "This notification has already been processed.", "")

    # Build on-chain add_guarantor transaction
    try:
        txns = build_add_guarantor_txn(
            notif["borrower_wallet"],
            notif["app_id"],
            req.guarantor_address,
        )
    except Exception:
        txns = []  # If app doesn't exist on-chain, still allow for demo

    # Mark approved
    notif["status"] = "approved"
    notif["approved_at"] = datetime.utcnow().isoformat()

    # Update guarantor's trust boost
    guarantor = get_user(req.guarantor_address)
    guarantor["total_loans_backed"] = guarantor.get("total_loans_backed", 0) + 1

    return {
        "status": "approved",
        "txns": txns,
        "notification_id": notification_id,
    }


@app.post("/notifications/{notification_id}/decline")
def decline_notification(notification_id: str):
    """Decline a guarantor request."""
    if notification_id not in notifications_store:
        lp_error(404, "NOT_FOUND", "Notification not found.", "Check the notification ID.")

    notif = notifications_store[notification_id]
    if notif["status"] != "pending":
        lp_error(400, "ALREADY_PROCESSED", "This notification has already been processed.", "")

    notif["status"] = "declined"
    notif["declined_at"] = datetime.utcnow().isoformat()

    return {"status": "declined", "notification_id": notification_id}


# ══════════════════════════════════════════════════════════════════
#  3. LOANS (Enhanced existing + new)
# ══════════════════════════════════════════════════════════════════

@app.get("/loans")
def route_get_loans(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_trust: Optional[int] = Query(None, description="Minimum trust score"),
    status: Optional[int] = Query(None, description="Loan status (1=OPEN, 2=FUNDED, 3=REPAYING, 4=CLOSED, 5=DEFAULTED)"),
):
    """Get all loans with optional filters."""
    result = get_all_loans()

    # Apply filters to metadata if available
    if category or min_trust or status:
        filtered_apps = []
        for app in result.get("applications", []):
            app_id = app.get("id")
            meta = loan_metadata.get(app_id, {})

            if category and meta.get("category") != category:
                continue
            if min_trust is not None and meta.get("borrower_trust", 0) < min_trust:
                continue
            if status is not None:
                # Check on-chain status if available
                pass  # Would need to parse global state per app

            filtered_apps.append(app)

        result["applications"] = filtered_apps

    return result


@app.get("/loans/{app_id}/txns")
def route_get_loan_txns(app_id: int):
    return get_loan_txns(app_id)


@app.get("/loans/{app_id}/state")
def route_get_loan_state(app_id: int):
    """Get loan state including metadata (guarantor, vouchers, schedule)."""
    algod = get_algod()
    try:
        app_info = algod.application_info(app_id)
        state = app_info.get("params", {}).get("global-state", [])
    except Exception as e:
        # If on-chain lookup fails, return metadata only
        meta = loan_metadata.get(app_id, {})
        schedule = loan_schedules.get(app_id)
        return {
            "state": [],
            "metadata": meta,
            "schedule": schedule,
            "error": str(e),
        }

    # Enrich with off-chain metadata
    meta = loan_metadata.get(app_id, {})
    schedule = loan_schedules.get(app_id)

    return {
        "state": state,
        "metadata": meta,
        "schedule": schedule,
    }


@app.post("/loans/create")
def route_create_loan(req: CreateLoanRequest):
    """Create a new loan with optional purpose, category, and schedule."""
    # Validate tier limits
    if req.borrower_address in DEMO_USERS:
        user = DEMO_USERS[req.borrower_address]
        tier = user.get("tier", 0)
        limit_inr = TIER_LIMITS_INR.get(tier, 41_500)
        amount_inr = (req.goal_microalgos / 1_000_000) * INR_PER_ALGO
        if amount_inr > limit_inr:
            lp_error(
                400,
                "INSUFFICIENT_TIER",
                f"Loan amount ₹{amount_inr:,.0f} exceeds Tier {tier} limit of ₹{limit_inr:,}.",
                f"Upgrade to a higher tier or reduce your loan amount below ₹{limit_inr:,}.",
            )

    badge_asa_id = int(os.getenv(f"TIER{req.tier_required}_BADGE_ID", 0))
    txns = build_create_loan_txn(
        req.borrower_address,
        req.goal_microalgos,
        req.duration_days,
        req.tier_required,
        badge_asa_id,
    )

    # Store metadata
    app_id_placeholder = hash(f"{req.borrower_address}{datetime.utcnow().isoformat()}") % 1_000_000
    loan_metadata[app_id_placeholder] = {
        "borrower": req.borrower_address,
        "purpose": req.purpose or "General",
        "category": req.category or "other",
        "goal_microalgos": req.goal_microalgos,
        "duration_days": req.duration_days,
        "tier_required": req.tier_required,
        "created_at": datetime.utcnow().isoformat(),
        "borrower_trust": DEMO_USERS.get(req.borrower_address, {}).get("trust_score", 50),
    }

    # Create schedule if provided
    if req.installment_schedule:
        sched = build_schedule(
            req.goal_microalgos,
            req.installment_schedule.get("tenure_months", 6),
            req.installment_schedule.get("frequency", "monthly"),
            req.installment_schedule.get("start_date", datetime.utcnow().strftime("%Y-%m-%d")),
        )
        loan_schedules[app_id_placeholder] = sched

    return {"txns": txns, "metadata_id": app_id_placeholder}


@app.post("/loans/fund")
def route_fund_loan(req: FundLoanRequest):
    txns = build_fund_loan_txns(req.lender_address, req.app_id, req.amount_microalgos)
    return {"txns": txns}


@app.post("/loans/repay")
def route_repay_loan(req: RepayLoanRequest):
    txns = build_repay_loan_txns(req.borrower_address, req.app_id, req.amount_microalgos)
    return {"txns": txns}


@app.post("/loans/{app_id}/claim")
def route_claim_loan(app_id: int, req: ClaimRequest):
    txns = build_claim_txn(req.lender_address, app_id)
    return {"txns": txns}


@app.post("/loans/add_guarantor")
def route_add_guarantor(req: AddGuarantorRequest):
    txns = build_add_guarantor_txn(req.borrower_address, req.app_id, req.guarantor_address)
    return {"txns": txns}


# ══════════════════════════════════════════════════════════════════
#  4. LOAN INSTALLMENTS & SCHEDULES
# ══════════════════════════════════════════════════════════════════

@app.post("/loans/{app_id}/schedule")
def create_schedule(app_id: int, req: CreateScheduleRequest):
    """Create an installment schedule for a loan. Cannot be modified once set."""
    if app_id in loan_schedules:
        lp_error(
            400,
            "SCHEDULE_LOCKED",
            "Installment schedule already exists for this loan.",
            "Once submitted, dates and installment schedule cannot be changed.",
        )

    schedule = build_schedule(
        req.amount_microalgos,
        req.tenure_months,
        req.installment_frequency,
        req.start_date,
    )
    loan_schedules[app_id] = schedule

    return {"schedule": schedule, "total_installments": len(schedule)}


@app.get("/loans/{app_id}/schedule")
def get_schedule(app_id: int):
    """Get the installment schedule with current status for each installment."""
    if app_id not in loan_schedules:
        lp_error(404, "NOT_FOUND", "No schedule found for this loan.", "Create a schedule first.")

    schedule = loan_schedules[app_id]

    # Update statuses based on current date
    today = datetime.utcnow().date()
    for inst in schedule:
        if inst["status"] == "upcoming":
            due = datetime.fromisoformat(inst["due_date"]).date()
            if due < today:
                inst["status"] = "overdue"

    return {"schedule": schedule}


@app.post("/loans/{app_id}/installment/{installment_no}/pay")
def pay_installment(app_id: int, installment_no: int, req: PayInstallmentRequest):
    """Mark an installment as paid. Determines if late based on date."""
    if app_id not in loan_schedules:
        lp_error(404, "NOT_FOUND", "No schedule found for this loan.", "Create a schedule first.")

    schedule = loan_schedules[app_id]

    # Find installment
    inst = None
    for s in schedule:
        if s["installment_no"] == installment_no:
            inst = s
            break

    if inst is None:
        lp_error(404, "NOT_FOUND", f"Installment #{installment_no} not found.", "Check the installment number.")

    if inst["status"] in ("paid", "paid-late"):
        lp_error(400, "ALREADY_PAID", "This installment has already been paid.", "")

    # Calculate lateness
    today = datetime.utcnow().date()
    due_date = datetime.fromisoformat(inst["due_date"]).date()
    was_late = today > due_date
    days_late = max(0, (today - due_date).days)

    # Update status
    inst["status"] = "paid-late" if was_late else "paid"
    inst["paid_date"] = today.isoformat()
    inst["days_late"] = days_late

    # Build repay transaction
    txns = build_repay_loan_txns(
        req.borrower_address,
        app_id,
        inst["amount_microalgos"],
    )

    # Update scores
    user = get_user(req.borrower_address)
    if was_late:
        delta = SCORE_DELTAS["loan_repaid_late"]
    else:
        delta = SCORE_DELTAS["loan_repaid_ontime"]

    user["trust_score"] = max(0, min(100, user.get("trust_score", 50) + delta["trust"]))
    user["risk_score"] = max(0, min(100, user.get("risk_score", 50) + delta["risk"]))

    return {
        "txns": txns,
        "was_late": was_late,
        "days_late": days_late,
        "installment_status": inst["status"],
        "new_trust_score": user["trust_score"],
        "new_risk_score": user["risk_score"],
    }


# ══════════════════════════════════════════════════════════════════
#  5. LOAN MEMORY RECEIPTS
# ══════════════════════════════════════════════════════════════════

@app.post("/loans/{app_id}/generate-receipt")
def generate_receipt(app_id: int, req: GenerateReceiptRequest):
    """Generate a human-readable receipt when a loan reaches CLOSED status."""
    meta = loan_metadata.get(app_id, {})
    schedule = loan_schedules.get(app_id)

    borrower_wallet = meta.get("borrower", "Unknown")
    borrower = get_user(borrower_wallet)

    receipt = generate_receipt_text(
        app_id=app_id,
        borrower_name=borrower.get("name", "Unknown"),
        amount_inr=int((meta.get("goal_microalgos", 0) / 1_000_000) * INR_PER_ALGO),
        purpose=meta.get("purpose", "general purpose"),
        start_date=meta.get("created_at", "Unknown date")[:10],
        schedule=schedule,
    )

    # Store receipt
    loan_receipts[app_id] = receipt
    borrower.setdefault("receipts", []).append(receipt)

    return {"receipt": receipt, "app_id": app_id}


@app.get("/users/{wallet_address}/receipts")
def get_user_receipts(wallet_address: str):
    """Return all loan receipts for a user (portable on-chain story)."""
    user = get_user(wallet_address)
    return {"wallet_address": wallet_address, "receipts": user.get("receipts", [])}


@app.get("/users/{wallet_address}/profile")
def get_user_profile(wallet_address: str):
    """Return aggregated user profile with scores, tier, loans, receipts."""
    user = get_user(wallet_address)

    # Count loans from schedules
    total_loans = 0
    on_time_payments = 0
    late_payments = 0
    active_loan = None

    for aid, schedule in loan_schedules.items():
        meta = loan_metadata.get(aid, {})
        if meta.get("borrower") == wallet_address:
            total_loans += 1
            for inst in schedule:
                if inst["status"] == "paid":
                    on_time_payments += 1
                elif inst["status"] == "paid-late":
                    late_payments += 1
                elif inst["status"] in ("upcoming", "overdue"):
                    if active_loan is None:
                        active_loan = aid

    return {
        "wallet_address": wallet_address,
        "name": user.get("name", "Unknown"),
        "role": user.get("role", "borrower"),
        "tier": user.get("tier", 0),
        "trust_score": user.get("trust_score", 50),
        "risk_score": user.get("risk_score", 50),
        "total_loans": total_loans,
        "on_time_payments": on_time_payments,
        "late_payments": late_payments,
        "active_loan_app_id": active_loan,
        "receipts": user.get("receipts", []),
        "total_loans_backed": user.get("total_loans_backed", 0),
    }


# ══════════════════════════════════════════════════════════════════
#  6. REMINDER SYSTEM (Mock Email)
# ══════════════════════════════════════════════════════════════════

@app.post("/reminders/check")
def check_reminders():
    """Check all active loans for installments due within 7 days. Mock email."""
    reminders = []
    today = datetime.utcnow().date()
    cutoff = today + timedelta(days=7)

    for app_id, schedule in loan_schedules.items():
        meta = loan_metadata.get(app_id, {})
        borrower_wallet = meta.get("borrower", "")
        borrower = get_user(borrower_wallet) if borrower_wallet else {}

        for inst in schedule:
            if inst["status"] not in ("upcoming", "overdue"):
                continue

            due_date = datetime.fromisoformat(inst["due_date"]).date()
            if due_date <= cutoff:
                days_until = (due_date - today).days
                amount_inr = int((inst["amount_microalgos"] / 1_000_000) * INR_PER_ALGO)
                name = borrower.get("name", "Borrower")

                # Mock email log
                print(
                    f"REMINDER EMAIL: Dear {name}, your installment of "
                    f"₹{amount_inr:,} is due on {inst['due_date']}. "
                    f"Please ensure ALGO coins are in your wallet. "
                    f"(Days until due: {days_until})"
                )

                reminders.append({
                    "wallet_address": borrower_wallet,
                    "borrower_name": name,
                    "amount_microalgos": inst["amount_microalgos"],
                    "amount_inr": amount_inr,
                    "due_date": inst["due_date"],
                    "days_until_due": days_until,
                    "app_id": app_id,
                    "installment_no": inst["installment_no"],
                })

    return {"reminders": reminders, "count": len(reminders)}


# ══════════════════════════════════════════════════════════════════
#  7. SCORE IMPACT (Mock ML Stubs)
# ══════════════════════════════════════════════════════════════════

@app.post("/scores/update")
def update_score(req: UpdateScoreRequest):
    """Update trust and risk scores based on an event. Mock ML stub."""
    if req.event_type not in SCORE_DELTAS:
        lp_error(
            400,
            "INVALID_EVENT",
            f"Unknown event type: {req.event_type}",
            f"Valid types: {', '.join(SCORE_DELTAS.keys())}",
        )

    delta = SCORE_DELTAS[req.event_type]
    user = get_user(req.wallet_address)

    old_trust = user.get("trust_score", 50)
    old_risk = user.get("risk_score", 50)

    # Special case: guarantor default drops trust to 40% of current
    if req.event_type == "guarantor_borrower_defaulted":
        new_trust = max(0, int(old_trust * 0.4))
    else:
        new_trust = max(0, min(100, old_trust + delta["trust"]))

    new_risk = max(0, min(100, old_risk + delta["risk"]))

    user["trust_score"] = new_trust
    user["risk_score"] = new_risk

    return {
        "wallet_address": req.wallet_address,
        "event_type": req.event_type,
        "old_trust_score": old_trust,
        "new_trust_score": new_trust,
        "old_risk_score": old_risk,
        "new_risk_score": new_risk,
        "delta": delta,
    }


# ══════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ══════════════════════════════════════════════════════════════════

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "users_count": len(DEMO_USERS),
        "active_schedules": len(loan_schedules),
        "pending_notifications": sum(1 for n in notifications_store.values() if n["status"] == "pending"),
    }
