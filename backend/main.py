"""LendPool Backend — FastAPI Application with PostgreSQL/SQLite persistence.

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

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from .database import engine, Base, get_db
from .db_models import (
    User as DBUser,
    Loan as DBLoan,
    Installment as DBInstallment,
    Notification as DBNotification,
    LoanReceipt as DBLoanReceipt,
)
from . import crud
from . import ml_service

from .kyc import verify_email_otp, verify_phone_otp, hash_pan_aadhaar, get_tier_for_verification
from .badge_minting import mint_tier_badge
from .algorand_client import get_algod
from .indexer import get_all_loans, get_loan_txns, get_wallet_history, get_loan_app_state
from .chain_reader import get_all_chain_loans, sync_chain_to_db
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
    SCORE_DELTAS,
    TIER_LIMITS_INR,
    INR_PER_ALGO,
    generate_receipt_text,
)

load_dotenv()

# ── Create all tables on startup ────────────────────────────────
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LendPool Backend APIs",
    description="Community-powered P2P lending on Algorand",
    version="3.0.0",
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
demo_loans_store: dict = {}

from .demo_seed_data import DEMO_BORROWERS, DEMO_VOUCHERS

@app.on_event("startup")
async def seed_demo_data():
    """Load demo users and borrower profiles on startup."""
    for borrower in DEMO_BORROWERS:
        if borrower["id"] not in demo_loans_store:
            demo_loans_store[borrower["id"]] = borrower
    
    for voucher in DEMO_VOUCHERS:
        if voucher["wallet"] not in users_state:
            users_state[voucher["wallet"]] = {
                "email": True, "phone": True, "pan": f"demo_pan_{voucher['name'][:4].lower()}",
                "tier": 2, "trust_score": voucher["trust_score"], "risk_score": 100 - voucher["trust_score"],
                "is_voucher": True, "is_guarantor": voucher["name"] in ["Ravi Kumar", "Venkat Rao"]
            }

@app.get("/demo/borrowers")
def get_demo_borrowers(category: str | None = None, min_trust: int | None = None):
    result = list(demo_loans_store.values())
    if category:
        result = [b for b in result if b["category"] == category]
    if min_trust:
        result = [b for b in result if b["trust_score"] >= min_trust]
    return {"borrowers": result}

@app.get("/demo/borrowers/{profile_id}")
def get_demo_borrower(profile_id: str):
    if profile_id not in demo_loans_store:
        raise HTTPException(status_code=404, detail="Profile not found")
    return demo_loans_store[profile_id]


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
def lender_login(req: LenderLoginRequest, db: Session = Depends(get_db)):
    """Authenticate a lender via OTP. Mock: any 4-digit OTP works."""
    if len(req.otp) != 4 or not req.otp.isdigit():
        lp_error(400, "INVALID_OTP", "OTP must be 4 digits.", "Enter the 4-digit code sent to your mobile.")

    # Generate a deterministic wallet address from name for demo
    wallet = f"LENDER_{hashlib.md5(req.name.encode()).hexdigest()[:12].upper()}"
    token = str(uuid.uuid4())

    # Ensure user exists in DB
    user = crud.get_or_create_user(db, wallet, defaults={
        "name": req.name,
        "role": "lender",
        "phone_verified": True,
    })

    # Update name and role if changed
    user.name = req.name
    user.role = "lender"
    user.phone_verified = True
    user.last_active_at = datetime.utcnow()
    db.commit()

    return {
        "token": token,
        "wallet_address": wallet,
        "role": "lender",
        "name": req.name,
    }


@app.post("/auth/borrower-login")
def borrower_login(req: BorrowerLoginRequest, db: Session = Depends(get_db)):
    """Login a returning borrower with user_id (wallet prefix) + password."""
    # Find user by wallet prefix match
    matched_user = None

    # Try exact match first
    matched_user = crud.get_user_by_wallet(db, req.user_id)

    # Try prefix/substring match
    if not matched_user:
        all_users = db.query(DBUser).all()
        for u in all_users:
            if u.wallet_address.startswith(req.user_id) or req.user_id in u.wallet_address:
                if u.password_hash == req.password:
                    matched_user = u
                    break

    if not matched_user:
        # Accept any user_id as a new wallet
        wallet = req.user_id.upper()
        matched_user = crud.get_or_create_user(db, wallet, defaults={
            "role": "borrower",
            "password_hash": req.password,
        })
        if matched_user.password_hash != req.password and req.password != "demo123":
            lp_error(401, "INVALID_CREDENTIALS", "Invalid user ID or password.", "Check your credentials or register as a new borrower.")

    matched_user.last_active_at = datetime.utcnow()
    db.commit()

    return {
        "token": str(uuid.uuid4()),
        "wallet_address": matched_user.wallet_address,
        "role": "borrower",
        "tier": matched_user.tier or 0,
        "name": matched_user.name or "Borrower",
        "trust_score": float(matched_user.trust_score or 50),
    }


@app.post("/auth/borrower-register")
def borrower_register(req: BorrowerRegisterRequest, db: Session = Depends(get_db)):
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
    user = crud.get_or_create_user(db, wallet, defaults={
        "name": f"Borrower_{wallet[5:11]}",
        "role": "borrower",
        "phone_verified": True,
        "pan_hash": pan_hash,
        "aadhaar_hash": hashlib.sha256(req.aadhaar_hash.encode()).hexdigest(),
        "tier": tier,
        "trust_score": 50.0,
        "risk_score": 50.0,
        "password_hash": req.otp,
    })

    # Issue badge
    badge_id = int(os.getenv(f"TIER{tier}_BADGE_ID", 0))

    return {
        "user_id": wallet,
        "wallet_address": wallet,
        "tier": tier,
        "badge_asa_id": badge_id,
        "name": user.name,
    }


@app.get("/users/{wallet_address}/contributions")
def get_user_contributions(wallet_address: str, db: Session = Depends(get_db)):
    """Fetch all loans funded by this user."""
    return crud.get_user_contributions(db, wallet_address)


# ══════════════════════════════════════════════════════════════════
#  LEGACY: KYC Verification (kept for backward compat)
# ══════════════════════════════════════════════════════════════════

@app.post("/verify")
def verify_user(req: VerificationRequest, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(db, req.wallet_address)

    if req.email_otp:
        if verify_email_otp("test@example.com", req.email_otp):
            user.email_verified = True
        else:
            raise HTTPException(status_code=400, detail="Invalid email OTP")

    if req.phone_otp:
        if verify_phone_otp("1234567890", req.phone_otp):
            user.phone_verified = True
        else:
            raise HTTPException(status_code=400, detail="Invalid phone OTP")

    if req.pan_document:
        try:
            user.pan_hash = hash_pan_aadhaar(req.pan_document)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    tier = get_tier_for_verification(user.email_verified, user.phone_verified, user.pan_hash)

    issued_badge = None
    if tier > (user.tier or 0):
        user.tier = tier
        issued_badge = os.getenv(f"TIER{tier}_BADGE_ID")

    db.commit()

    return {
        "status": "success",
        "wallet": req.wallet_address,
        "achieved_tier": user.tier,
        "badge_asa_id": issued_badge,
    }


# ══════════════════════════════════════════════════════════════════
#  1.5 MACHINE LEARNING INFERENCE
# ══════════════════════════════════════════════════════════════════

@app.get("/users/{wallet_address}/ml-score")
def calculate_user_ml_score(wallet_address: str, db: Session = Depends(get_db)):
    """Calculate and return the dynamic ML Trust Score (0-1000) for a user based on history."""
    user = crud.get_user_by_wallet(db, wallet_address)
    if not user:
        lp_error(404, "NOT_FOUND", "User not found.", "Check the wallet address.")
    
    # 1. Extract dynamic DB features
    features = ml_service.extract_user_features(db, user)
    
    # 2. Run through pre-trained RandomForest model
    trust_score = ml_service.calculate_ml_trust_score(features)
    
    # 3. Apply the 0-1000 score directly to the user
    from decimal import Decimal
    user.trust_score = Decimal(str(trust_score))
    
    # As requested, we ignore Risk Score scaling in this exact route.
    db.commit()
    
    return {
        "wallet_address": wallet_address,
        "ml_trust_score": trust_score,
        "features_used": features
    }


# ══════════════════════════════════════════════════════════════════
#  2. TRUST PATH & VOUCH SYSTEM
# ══════════════════════════════════════════════════════════════════

@app.get("/community/vouchers")
def get_vouchers(db: Session = Depends(get_db)):
    """Return list of eligible vouchers (trust_score > 70, is_active)."""
    vouchers = crud.get_vouchers(db, min_trust=70.0)
    return [
        {
            "id": str(v.id),
            "name": v.name,
            "wallet": v.wallet_address,
            "trust_score": float(v.trust_score or 0),
            "loans_backed": v.loans_backed_count or 0,
            "bio": v.voucher_bio or "",
            "is_active": v.is_active,
        }
        for v in vouchers
    ]


@app.post("/community/vouch-payment")
def vouch_payment(req: VouchPaymentRequest):
    """Build a payment transaction for vouch fee (₹500 per voucher)."""
    if req.amount_inr != 500:
        lp_error(400, "INVALID_AMOUNT", "Vouch payment must be exactly ₹500.", "Each voucher requires a ₹500 fee.")

    # Convert INR to microAlgos
    algo_amount = req.amount_inr / INR_PER_ALGO
    microalgos = int(algo_amount * 1_000_000)

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
def request_guarantor(req: GuarantorRequest, db: Session = Depends(get_db)):
    """Send a guarantor request notification."""
    notif = crud.create_guarantor_notification(
        db,
        borrower_wallet=req.borrower_address,
        guarantor_wallet=req.guarantor_address,
        app_id=req.app_id,
    )

    return {
        "status": "pending",
        "notification_id": str(notif.id),
        "message": f"Guarantor request sent to {req.guarantor_address}",
    }


@app.get("/notifications/{wallet_address}")
def get_notifications(wallet_address: str, db: Session = Depends(get_db)):
    """Return all pending notifications for this wallet."""
    notifications = crud.get_pending_notifications(db, wallet_address)
    result = []
    for n in notifications:
        result.append({
            "id": str(n.id),
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "sender_wallet": n.sender_wallet,
            "recipient_wallet": n.recipient_wallet,
            "requires_action": n.requires_action,
            "created_at": n.created_at.isoformat() if n.created_at else None,
            "status": "pending" if not n.action_taken else n.action_taken,
        })
    return result


@app.post("/notifications/{notification_id}/approve")
def approve_notification(notification_id: str, req: NotificationApproveRequest, db: Session = Depends(get_db)):
    """Approve a guarantor request and call add_guarantor on-chain."""
    notif = db.query(DBNotification).filter(DBNotification.id == notification_id).first()
    if not notif:
        lp_error(404, "NOT_FOUND", "Notification not found.", "Check the notification ID.")

    if notif.action_taken:
        lp_error(400, "ALREADY_PROCESSED", "This notification has already been processed.", "")

    # Build on-chain add_guarantor transaction
    txns = []
    try:
        # Get borrower from sender_wallet
        borrower = crud.get_user_by_wallet(db, notif.sender_wallet)
        if borrower and notif.loan_id:
            loan = db.query(DBLoan).filter(DBLoan.id == notif.loan_id).first()
            if loan and loan.app_id:
                txns = build_add_guarantor_txn(
                    notif.sender_wallet,
                    loan.app_id,
                    req.guarantor_address,
                )
    except Exception:
        txns = []  # If app doesn't exist on-chain, still allow for demo

    # Mark approved
    crud.resolve_notification(db, notification_id, "approved")

    # Update guarantor's trust boost
    guarantor = crud.get_or_create_user(db, req.guarantor_address)
    guarantor.loans_backed_count = (guarantor.loans_backed_count or 0) + 1
    db.commit()

    return {
        "status": "approved",
        "txns": txns,
        "notification_id": notification_id,
    }


@app.post("/notifications/{notification_id}/decline")
def decline_notification(notification_id: str, db: Session = Depends(get_db)):
    """Decline a guarantor request."""
    notif = db.query(DBNotification).filter(DBNotification.id == notification_id).first()
    if not notif:
        lp_error(404, "NOT_FOUND", "Notification not found.", "Check the notification ID.")

    if notif.action_taken:
        lp_error(400, "ALREADY_PROCESSED", "This notification has already been processed.", "")

    crud.resolve_notification(db, notification_id, "declined")

    return {"status": "declined", "notification_id": notification_id}


# ══════════════════════════════════════════════════════════════════
#  3. LOANS (Enhanced existing + new)
# ══════════════════════════════════════════════════════════════════

@app.get("/loans")
def route_get_loans(
    category: Optional[str] = Query(None),
    min_trust: Optional[int] = Query(None),
    status: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get all loans - chain-first with DB fallback for metadata."""
    # Try blockchain first via indexer
    chain_loans = get_all_chain_loans(db, category=category)
    if chain_loans:
        # Filter by status/trust if needed (indexer filtering is basic)
        result = chain_loans
        if status:
            result = [l for l in result if l["status"] == status]
        if min_trust:
            result = [l for l in result if l["borrower_trust"] >= min_trust]
        return {"loans": result}

    # Fallback to DB if chain is empty/unavailable
    db_loans = crud.get_loans(db, category=category, min_trust=min_trust, status=status)
    return {
        "loans": [
            {
                "id": str(loan.id),
                "app_id": loan.app_id,
                "borrower_wallet": loan.borrower.wallet_address if loan.borrower else None,
                "purpose": loan.purpose,
                "category": loan.category,
                "goal_microalgos": loan.goal_microalgos,
                "funded_microalgos": loan.funded_microalgos or 0,
                "status": loan.status,
                "tier_required": loan.tier_required or 0,
                "trust_path": loan.trust_path,
                "created_at": loan.created_at.isoformat() if loan.created_at else None,
                "borrower_trust": float(loan.borrower.trust_score or 50) if loan.borrower else 50,
            }
            for loan in db_loans
        ]
    }


@app.get("/loans/{app_id}/txns")
def route_get_loan_txns(app_id: int):
    return get_loan_txns(app_id)


@app.get("/loans/{app_id}/state")
def route_get_loan_state(app_id: int, db: Session = Depends(get_db)):
    """Get loan state including metadata (guarantor, vouchers, schedule)."""
    # Force sync from chain
    sync_chain_to_db(app_id, db)

    # Try DB loan first
    db_loan = crud.get_loan_by_app_id(db, app_id)

    algod = get_algod()
    state = []
    error = None
    try:
        app_info = algod.application_info(app_id)
        state = app_info.get("params", {}).get("global-state", [])
    except Exception as e:
        error = str(e)

    # Build metadata and schedule from DB
    metadata = {}
    schedule = None
    if db_loan:
        metadata = {
            "borrower": db_loan.borrower.wallet_address if db_loan.borrower else None,
            "purpose": db_loan.purpose,
            "category": db_loan.category,
            "goal_microalgos": db_loan.goal_microalgos,
            "duration_days": db_loan.duration_days,
            "tier_required": db_loan.tier_required or 0,
            "created_at": db_loan.created_at.isoformat() if db_loan.created_at else None,
            "borrower_trust": float(db_loan.borrower.trust_score or 50) if db_loan.borrower else 50,
        }
        if db_loan.installments:
            schedule = crud.get_schedule_dicts(db_loan)

    result = {"state": state, "metadata": metadata, "schedule": schedule}
    if error:
        result["error"] = error
    return result


@app.post("/loans/create")
def route_create_loan(req: CreateLoanRequest, db: Session = Depends(get_db)):
    """Create a new loan with optional purpose, category, and schedule."""
    # Get or create borrower
    borrower = crud.get_or_create_user(db, req.borrower_address, defaults={"role": "borrower"})

    # Validate tier limits
    tier = borrower.tier or 0
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

    # Placeholder app_id (will be updated after on-chain confirmation)
    app_id_placeholder = abs(hash(f"{req.borrower_address}{datetime.utcnow().isoformat()}")) % 1_000_000

    # Create loan in DB
    loan = crud.create_loan(
        db,
        borrower_id=str(borrower.id),
        purpose=req.purpose or "General",
        category=req.category or "other",
        goal_microalgos=req.goal_microalgos,
        duration_days=req.duration_days,
        tier_required=req.tier_required,
        app_id=app_id_placeholder,
        installment_schedule=req.installment_schedule,
    )

    return {"txns": txns, "metadata_id": app_id_placeholder, "loan_id": str(loan.id)}

@app.post("/loans/{loan_id}/confirm")
def route_confirm_loan(loan_id: str, app_id: int, db: Session = Depends(get_db)):
    """Update loan in DB with real app_id after on-chain creation."""
    loan = db.query(DBLoan).filter(DBLoan.id == loan_id).first()
    if not loan:
        lp_error(404, "NOT_FOUND", "Loan metadata not found.", "")
    
    loan.app_id = app_id
    db.commit()
    
    # Sync immediately
    sync_chain_to_db(app_id, db)
    return {"status": "success", "app_id": app_id}


@app.post("/loans/fund")
def route_fund_loan(req: FundLoanRequest, db: Session = Depends(get_db)):
    txns = build_fund_loan_txns(req.lender_address, req.app_id, req.amount_microalgos)

    # Record contribution in DB
    db_loan = crud.get_loan_by_app_id(db, req.app_id)
    if db_loan:
        lender = crud.get_or_create_user(db, req.lender_address, defaults={"role": "lender"})
        crud.record_contribution(
            db,
            loan_id=str(db_loan.id),
            lender_id=str(lender.id),
            amount_microalgos=req.amount_microalgos,
        )
        db_loan.funded_microalgos = (db_loan.funded_microalgos or 0) + req.amount_microalgos
        if db_loan.funded_microalgos >= db_loan.goal_microalgos:
            db_loan.status = 2  # FUNDED
            db_loan.funded_at = datetime.utcnow()
        db.commit()

    return {"txns": txns}


@app.post("/loans/repay")
def route_repay_loan(req: RepayLoanRequest, db: Session = Depends(get_db)):
    txns = build_repay_loan_txns(req.borrower_address, req.app_id, req.amount_microalgos)

    # Update DB
    db_loan = crud.get_loan_by_app_id(db, req.app_id)
    if db_loan:
        db_loan.repaid_microalgos = (db_loan.repaid_microalgos or 0) + req.amount_microalgos
        if db_loan.status == 2:
            db_loan.status = 3  # REPAYING
            db_loan.repayment_started_at = datetime.utcnow()
        if db_loan.repaid_microalgos >= db_loan.goal_microalgos:
            db_loan.status = 4  # CLOSED
            db_loan.closed_at = datetime.utcnow()
        db.commit()
    
    # Sync chain to DB
    if req.app_id:
        sync_chain_to_db(req.app_id, db)

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
def create_schedule(app_id: int, req: CreateScheduleRequest, db: Session = Depends(get_db)):
    """Create an installment schedule for a loan. Cannot be modified once set."""
    db_loan = crud.get_loan_by_app_id(db, app_id)
    if not db_loan:
        lp_error(404, "NOT_FOUND", "Loan not found.", "Check the app_id.")

    if db_loan.schedule_locked_at is not None:
        lp_error(
            400,
            "SCHEDULE_LOCKED",
            "Installment schedule already exists for this loan.",
            "Once submitted, dates and installment schedule cannot be changed.",
        )

    try:
        installments = crud.create_schedule_for_loan(
            db, db_loan,
            req.amount_microalgos,
            req.tenure_months,
            req.installment_frequency,
            req.start_date,
        )
    except ValueError as e:
        lp_error(400, "SCHEDULE_LOCKED", str(e), "")

    schedule = crud.get_schedule_dicts(db_loan)
    return {"schedule": schedule, "total_installments": len(schedule)}


@app.get("/loans/{app_id}/schedule")
def get_schedule(app_id: int, db: Session = Depends(get_db)):
    """Get the installment schedule with current status for each installment."""
    db_loan = crud.get_loan_by_app_id(db, app_id)
    if not db_loan or not db_loan.installments:
        lp_error(404, "NOT_FOUND", "No schedule found for this loan.", "Create a schedule first.")

    # Update statuses based on current date
    today = datetime.utcnow().date()
    for inst in db_loan.installments:
        if inst.status == "upcoming" and inst.due_date < today:
            inst.status = "overdue"
    db.commit()

    schedule = crud.get_schedule_dicts(db_loan)
    return {"schedule": schedule}


@app.post("/loans/{app_id}/installment/{installment_no}/pay")
def pay_installment(app_id: int, installment_no: int, req: PayInstallmentRequest, db: Session = Depends(get_db)):
    """Mark an installment as paid. Determines if late based on date."""
    db_loan = crud.get_loan_by_app_id(db, app_id)
    if not db_loan:
        lp_error(404, "NOT_FOUND", "No schedule found for this loan.", "Create a schedule first.")

    result = crud.pay_installment(db, db_loan, installment_no)

    if "error" in result:
        if "not found" in result["error"].lower():
            lp_error(404, "NOT_FOUND", result["error"], "Check the installment number.")
        else:
            lp_error(400, "ALREADY_PAID", result["error"], "")

    # Build repay transaction
    inst = (
        db.query(DBInstallment)
        .filter(DBInstallment.loan_id == db_loan.id, DBInstallment.installment_no == installment_no)
        .first()
    )
    txns = build_repay_loan_txns(req.borrower_address, app_id, inst.amount_microalgos)

    # Update borrower scores
    borrower = db_loan.borrower
    delta_key = "loan_repaid_late" if result["was_late"] else "loan_repaid_ontime"
    delta = SCORE_DELTAS[delta_key]
    crud.update_user_scores(
        db, borrower,
        trust_delta=delta["trust"],
        risk_delta=delta["risk"],
        event_type=delta_key,
        loan_id=str(db_loan.id),
    )

    return {
        "txns": txns,
        "was_late": result["was_late"],
        "days_late": result["days_late"],
        "installment_status": result["status"],
        "new_trust_score": float(borrower.trust_score),
        "new_risk_score": float(borrower.risk_score),
    }


# ══════════════════════════════════════════════════════════════════
#  5. LOAN MEMORY RECEIPTS
# ══════════════════════════════════════════════════════════════════

@app.post("/loans/{app_id}/generate-receipt")
def generate_receipt(app_id: int, req: GenerateReceiptRequest, db: Session = Depends(get_db)):
    """Generate a human-readable receipt when a loan reaches CLOSED status."""
    db_loan = crud.get_loan_by_app_id(db, app_id)

    borrower_name = "Unknown"
    amount_inr = 0
    purpose = "general purpose"
    start_date = "Unknown date"
    schedule = None

    if db_loan:
        borrower = db_loan.borrower
        borrower_name = borrower.name if borrower else "Unknown"
        amount_inr = int((db_loan.goal_microalgos / 1_000_000) * INR_PER_ALGO)
        purpose = db_loan.purpose or "general purpose"
        start_date = db_loan.created_at.strftime("%Y-%m-%d") if db_loan.created_at else "Unknown date"
        if db_loan.installments:
            schedule = crud.get_schedule_dicts(db_loan)

    receipt_text = generate_receipt_text(
        app_id=app_id,
        borrower_name=borrower_name,
        amount_inr=amount_inr,
        purpose=purpose,
        start_date=start_date,
        schedule=schedule,
    )

    # Store receipt in DB
    if db_loan:
        on_time = sum(1 for i in db_loan.installments if i.status == "paid")
        late = sum(1 for i in db_loan.installments if i.status == "paid_late")
        lender_count = db.query(DBLoan).filter(DBLoan.id == db_loan.id).first()

        crud.generate_receipt(
            db, db_loan,
            narrative=receipt_text,
            amount_inr=amount_inr,
            on_time_count=on_time,
            late_count=late,
            total_lenders=len(db_loan.contributions),
        )

    return {"receipt": receipt_text, "app_id": app_id}


@app.get("/users/{wallet_address}/receipts")
def get_user_receipts(wallet_address: str, db: Session = Depends(get_db)):
    """Return all loan receipts for a user (portable on-chain story)."""
    user = crud.get_user_by_wallet(db, wallet_address)
    if not user:
        return {"wallet_address": wallet_address, "receipts": []}

    receipts = crud.get_user_receipts(db, str(user.id))
    return {
        "wallet_address": wallet_address,
        "receipts": [r.narrative for r in receipts],
    }


@app.get("/users/{wallet_address}/profile")
def get_user_profile(wallet_address: str, db: Session = Depends(get_db)):
    """Return aggregated user profile with scores, tier, loans, receipts."""
    profile = crud.get_user_profile(db, wallet_address)
    if not profile:
        lp_error(404, "NOT_FOUND", "User not found.", "Check the wallet address.")
    return profile


# ══════════════════════════════════════════════════════════════════
#  6. REMINDER SYSTEM (Mock Email)
# ══════════════════════════════════════════════════════════════════

@app.post("/reminders/check")
def check_reminders(db: Session = Depends(get_db)):
    """Check all active loans for installments due within 7 days. Mock email."""
    reminders = crud.get_upcoming_installments(db, days_ahead=7)

    for r in reminders:
        print(
            f"REMINDER EMAIL: Dear {r['borrower_name']}, your installment of "
            f"₹{r['amount_inr']:,} is due on {r['due_date']}. "
            f"Please ensure ALGO coins are in your wallet. "
            f"(Days until due: {r['days_until_due']})"
        )

    return {"reminders": reminders, "count": len(reminders)}


# ══════════════════════════════════════════════════════════════════
#  7. SCORE IMPACT (Mock ML Stubs)
# ══════════════════════════════════════════════════════════════════

@app.post("/scores/update")
def update_score(req: UpdateScoreRequest, db: Session = Depends(get_db)):
    """Update trust and risk scores based on an event. Mock ML stub."""
    if req.event_type not in SCORE_DELTAS:
        lp_error(
            400,
            "INVALID_EVENT",
            f"Unknown event type: {req.event_type}",
            f"Valid types: {', '.join(SCORE_DELTAS.keys())}",
        )

    delta = SCORE_DELTAS[req.event_type]
    user = crud.get_or_create_user(db, req.wallet_address)

    old_trust = float(user.trust_score or 50)
    old_risk = float(user.risk_score or 50)

    user = crud.update_user_scores(
        db, user,
        trust_delta=delta["trust"],
        risk_delta=delta["risk"],
        event_type=req.event_type,
    )

    return {
        "wallet_address": req.wallet_address,
        "event_type": req.event_type,
        "old_trust_score": old_trust,
        "new_trust_score": float(user.trust_score),
        "old_risk_score": old_risk,
        "new_risk_score": float(user.risk_score),
        "delta": delta,
    }


# ══════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ══════════════════════════════════════════════════════════════════

@app.get("/health")
def health(db: Session = Depends(get_db)):
    user_count = db.query(DBUser).count()
    loan_count = db.query(DBLoan).count()
    notification_count = db.query(DBNotification).filter(DBNotification.action_taken == None).count()  # noqa: E711

    return {
        "status": "healthy",
        "version": "3.0.0",
        "database": "connected",
        "users_count": user_count,
        "active_loans": loan_count,
        "pending_notifications": notification_count,
    }
