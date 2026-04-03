"""CRUD operations for LendPool — replaces in-memory dictionaries.

Every function receives a SQLAlchemy Session and returns ORM objects or dicts.
All domain constants (SCORE_DELTAS, TIER_LIMITS_INR, INR_PER_ALGO) are kept
in demo_data.py so existing imports from other modules still work.
"""

import uuid
import json
from datetime import datetime, timedelta, date
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import and_, desc

from .db_models import (
    User, Loan, Installment, LenderContribution,
    Vouch, Guarantor, Notification, ScoreEvent, LoanReceipt,
)
from .demo_data import SCORE_DELTAS, TIER_LIMITS_INR, INR_PER_ALGO


# ══════════════════════════════════════════════════════════════════
#  USER CRUD
# ══════════════════════════════════════════════════════════════════

def get_user_by_wallet(db: Session, wallet: str) -> Optional[User]:
    """Fetch user by wallet address."""
    return db.query(User).filter(User.wallet_address == wallet).first()


def get_or_create_user(db: Session, wallet: str, defaults: dict = None) -> User:
    """Get existing user or create a new one with sensible defaults."""
    user = get_user_by_wallet(db, wallet)
    if user:
        return user

    defaults = defaults or {}
    user = User(
        wallet_address=wallet,
        name=defaults.get("name", f"User_{wallet[:8]}"),
        role=defaults.get("role", "borrower"),
        email_verified=defaults.get("email_verified", False),
        phone_verified=defaults.get("phone_verified", False),
        pan_hash=defaults.get("pan_hash"),
        aadhaar_hash=defaults.get("aadhaar_hash"),
        tier=defaults.get("tier", 0),
        trust_score=defaults.get("trust_score", 50.0),
        risk_score=defaults.get("risk_score", 50.0),
        password_hash=defaults.get("password_hash", "1234"),
        is_voucher=defaults.get("is_voucher", False),
        is_guarantor=defaults.get("is_guarantor", False),
        voucher_bio=defaults.get("voucher_bio"),
        loans_backed_count=defaults.get("loans_backed_count", 0),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_scores(
    db: Session,
    user: User,
    trust_delta: float,
    risk_delta: float,
    event_type: str,
    loan_id: str = None,
    applied_by: str = "system",
) -> User:
    """Apply score deltas and record a ScoreEvent."""
    old_trust = float(user.trust_score or 50)
    old_risk = float(user.risk_score or 50)

    # Special case: guarantor default drops trust to 40% of current
    if event_type == "guarantor_borrower_defaulted":
        new_trust = max(0, int(old_trust * 0.4))
    else:
        new_trust = max(0.0, min(100.0, old_trust + trust_delta))

    new_risk = max(0.0, min(100.0, old_risk + risk_delta))

    user.trust_score = Decimal(str(new_trust))
    user.risk_score = Decimal(str(new_risk))
    user.last_active_at = datetime.utcnow()

    # Audit trail
    event = ScoreEvent(
        user_id=user.id,
        event_type=event_type,
        trust_delta=Decimal(str(trust_delta)),
        risk_delta=Decimal(str(risk_delta)),
        trust_score_before=Decimal(str(old_trust)),
        risk_score_before=Decimal(str(old_risk)),
        trust_score_after=Decimal(str(new_trust)),
        risk_score_after=Decimal(str(new_risk)),
        related_loan_id=loan_id,
        applied_by=applied_by,
    )
    db.add(event)
    db.commit()
    db.refresh(user)
    return user


def get_vouchers(db: Session, min_trust: float = 70.0) -> list[User]:
    """Return eligible vouchers with trust_score > threshold and active."""
    return (
        db.query(User)
        .filter(
            User.is_voucher == True,  # noqa: E712
            User.is_active == True,   # noqa: E712
            User.trust_score > min_trust,
        )
        .order_by(desc(User.trust_score))
        .all()
    )


def get_user_profile(db: Session, wallet: str) -> dict:
    """Return aggregated user profile dict."""
    user = get_user_by_wallet(db, wallet)
    if not user:
        return None

    # Count loans
    total_loans = db.query(Loan).filter(Loan.borrower_id == user.id).count()
    on_time = 0
    late = 0
    active_loan_app_id = None

    loans = db.query(Loan).filter(Loan.borrower_id == user.id).all()
    for loan in loans:
        for inst in loan.installments:
            if inst.status == "paid":
                on_time += 1
            elif inst.status == "paid_late":
                late += 1
        if loan.status in (1, 2, 3) and active_loan_app_id is None:
            active_loan_app_id = loan.app_id

    # Get receipts
    receipts = (
        db.query(LoanReceipt)
        .filter(LoanReceipt.borrower_id == user.id)
        .all()
    )

    return {
        "wallet_address": user.wallet_address,
        "name": user.name,
        "role": user.role,
        "tier": user.tier,
        "trust_score": float(user.trust_score or 50),
        "risk_score": float(user.risk_score or 50),
        "total_loans": total_loans,
        "on_time_payments": on_time,
        "late_payments": late,
        "active_loan_app_id": active_loan_app_id,
        "receipts": [r.narrative for r in receipts],
        "total_loans_backed": user.loans_backed_count or 0,
    }


# ══════════════════════════════════════════════════════════════════
#  LOAN CRUD
# ══════════════════════════════════════════════════════════════════

def create_loan(
    db: Session,
    borrower_id: str,
    purpose: str,
    category: str,
    goal_microalgos: int,
    duration_days: int,
    tier_required: int = 0,
    app_id: int = None,
    trust_path: str = None,
    installment_schedule: dict = None,
) -> Loan:
    """Create a loan and optionally build its installment schedule."""
    loan = Loan(
        borrower_id=borrower_id,
        app_id=app_id,
        purpose=purpose,
        category=category,
        goal_microalgos=goal_microalgos,
        tier_required=tier_required,
        duration_days=duration_days,
        trust_path=trust_path,
    )
    db.add(loan)
    db.flush()  # get loan.id before creating installments

    # Build schedule if provided
    if installment_schedule:
        tenure = installment_schedule.get("tenure_months", 6)
        freq = installment_schedule.get("frequency", "monthly")
        start_str = installment_schedule.get(
            "start_date", datetime.utcnow().strftime("%Y-%m-%d")
        )
        _create_installments(db, loan, tenure, freq, start_str)

    db.commit()
    db.refresh(loan)
    return loan


def _create_installments(
    db: Session, loan: Loan,
    tenure_months: int, frequency: str, start_date_str: str,
):
    """Generate installment rows for a loan."""
    start_date = datetime.fromisoformat(start_date_str)

    if frequency == "weekly":
        count = tenure_months * 4
        delta = timedelta(weeks=1)
    elif frequency == "biweekly":
        count = tenure_months * 2
        delta = timedelta(weeks=2)
    else:
        count = tenure_months
        delta = timedelta(days=30)

    installment_amount = loan.goal_microalgos // count
    remainder = loan.goal_microalgos - (installment_amount * count)

    for i in range(count):
        due = start_date + (delta * (i + 1))
        amt = installment_amount + (remainder if i == count - 1 else 0)
        inst = Installment(
            loan_id=loan.id,
            installment_no=i + 1,
            due_date=due.date(),
            amount_microalgos=amt,
        )
        db.add(inst)

    loan.tenure_months = tenure_months
    loan.installment_frequency = frequency
    loan.installment_count = count
    loan.installment_amount_microalgos = installment_amount
    loan.schedule_locked_at = datetime.utcnow()


def get_loan_by_app_id(db: Session, app_id: int) -> Optional[Loan]:
    return db.query(Loan).filter(Loan.app_id == app_id).first()


def get_loans(
    db: Session,
    category: str = None,
    min_trust: int = None,
    status: int = None,
) -> list[Loan]:
    """List loans with optional filters."""
    q = db.query(Loan)
    if category:
        q = q.filter(Loan.category == category)
    if status is not None:
        q = q.filter(Loan.status == status)
    if min_trust is not None:
        q = q.join(User, Loan.borrower_id == User.id).filter(
            User.trust_score >= min_trust
        )
    return q.order_by(desc(Loan.created_at)).all()


def create_schedule_for_loan(
    db: Session, loan: Loan,
    amount_microalgos: int,
    tenure_months: int,
    frequency: str,
    start_date_str: str,
) -> list[Installment]:
    """Create installment schedule for an existing loan."""
    if loan.schedule_locked_at is not None:
        raise ValueError("Schedule already locked for this loan.")

    _create_installments(db, loan, tenure_months, frequency, start_date_str)
    db.commit()
    db.refresh(loan)
    return loan.installments


def pay_installment(
    db: Session, loan: Loan, installment_no: int, txn_id: str = None,
) -> dict:
    """Mark installment as paid. Returns status info."""
    inst = (
        db.query(Installment)
        .filter(
            Installment.loan_id == loan.id,
            Installment.installment_no == installment_no,
        )
        .first()
    )
    if not inst:
        return {"error": f"Installment #{installment_no} not found"}

    if inst.status in ("paid", "paid_late"):
        return {"error": "Already paid"}

    today = datetime.utcnow().date()
    was_late = today > inst.due_date
    days_late = max(0, (today - inst.due_date).days)

    inst.status = "paid_late" if was_late else "paid"
    inst.paid_at = datetime.utcnow()
    inst.days_late = days_late
    inst.txn_id = txn_id

    db.commit()

    return {
        "installment_no": installment_no,
        "status": inst.status,
        "was_late": was_late,
        "days_late": days_late,
    }


def get_schedule_dicts(loan: Loan) -> list[dict]:
    """Convert installment ORM objects to API-friendly dicts."""
    schedule = []
    for inst in sorted(loan.installments, key=lambda i: i.installment_no):
        schedule.append({
            "installment_no": inst.installment_no,
            "due_date": inst.due_date.isoformat(),
            "amount_microalgos": inst.amount_microalgos,
            "status": inst.status,
            "paid_date": inst.paid_at.isoformat() if inst.paid_at else None,
            "days_late": inst.days_late or 0,
            "txn_id": inst.txn_id,
        })
    return schedule


# ══════════════════════════════════════════════════════════════════
#  LENDER CONTRIBUTIONS
# ══════════════════════════════════════════════════════════════════

def record_contribution(
    db: Session, loan_id: str, lender_id: str,
    amount_microalgos: int, txn_id: str = None,
) -> LenderContribution:
    """Record or update a lender's contribution to a loan."""
    existing = (
        db.query(LenderContribution)
        .filter(
            LenderContribution.loan_id == loan_id,
            LenderContribution.lender_id == lender_id,
        )
        .first()
    )
    if existing:
        existing.amount_microalgos += amount_microalgos
        existing.txn_id = txn_id
        db.commit()
        db.refresh(existing)
        return existing

    contrib = LenderContribution(
        loan_id=loan_id,
        lender_id=lender_id,
        amount_microalgos=amount_microalgos,
        txn_id=txn_id,
    )
    db.add(contrib)
    db.commit()
    db.refresh(contrib)
    return contrib


# ══════════════════════════════════════════════════════════════════
#  NOTIFICATIONS
# ══════════════════════════════════════════════════════════════════

def create_notification(
    db: Session,
    recipient_wallet: str,
    sender_wallet: str,
    notif_type: str,
    title: str,
    message: str,
    loan_id: str = None,
    related_user_id: str = None,
    requires_action: bool = False,
    expires_at: datetime = None,
) -> Notification:
    """Create a notification record."""
    notif = Notification(
        recipient_wallet=recipient_wallet,
        sender_wallet=sender_wallet,
        type=notif_type,
        title=title,
        message=message,
        loan_id=loan_id,
        related_user_id=related_user_id,
        requires_action=requires_action,
        expires_at=expires_at,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def create_guarantor_notification(
    db: Session,
    borrower_wallet: str,
    guarantor_wallet: str,
    loan_id: str = None,
    app_id: int = None,
) -> Notification:
    """Create a guarantor request notification."""
    borrower = get_user_by_wallet(db, borrower_wallet)
    borrower_name = borrower.name if borrower else "Unknown"
    trust = float(borrower.trust_score) if borrower else 50

    notif = create_notification(
        db,
        recipient_wallet=guarantor_wallet,
        sender_wallet=borrower_wallet,
        notif_type="guarantor_request",
        title=f"Guarantor Request from {borrower_name}",
        message=f"{borrower_name} (trust: {trust}) is requesting you to guarantee their loan.",
        loan_id=loan_id,
        related_user_id=str(borrower.id) if borrower else None,
        requires_action=True,
        expires_at=datetime.utcnow() + timedelta(hours=72),
    )
    return notif


def get_pending_notifications(db: Session, wallet: str) -> list[Notification]:
    """Get unread/pending notifications for a wallet."""
    return (
        db.query(Notification)
        .filter(
            Notification.recipient_wallet == wallet,
            Notification.is_read == False,  # noqa: E712
        )
        .order_by(desc(Notification.created_at))
        .all()
    )


def resolve_notification(
    db: Session, notification_id: str, action: str,
) -> Optional[Notification]:
    """Approve or decline a notification."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        return None
    notif.action_taken = action
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


# ══════════════════════════════════════════════════════════════════
#  GUARANTORS
# ══════════════════════════════════════════════════════════════════

def create_guarantor_record(
    db: Session, loan_id: str, borrower_id: str, guarantor_id: str,
) -> Guarantor:
    g = Guarantor(
        loan_id=loan_id,
        borrower_id=borrower_id,
        guarantor_id=guarantor_id,
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


def approve_guarantor(db: Session, guarantor_record: Guarantor, txn_id: str = None):
    guarantor_record.status = "approved"
    guarantor_record.responded_at = datetime.utcnow()
    guarantor_record.on_chain_txn_id = txn_id
    db.commit()


# ══════════════════════════════════════════════════════════════════
#  VOUCHES
# ══════════════════════════════════════════════════════════════════

def create_vouch(
    db: Session, loan_id: str, borrower_id: str, voucher_id: str,
    payment_txn_id: str = None,
) -> Vouch:
    vouch = Vouch(
        loan_id=loan_id,
        borrower_id=borrower_id,
        voucher_id=voucher_id,
        payment_txn_id=payment_txn_id,
    )
    db.add(vouch)
    db.commit()
    db.refresh(vouch)
    return vouch


# ══════════════════════════════════════════════════════════════════
#  RECEIPTS
# ══════════════════════════════════════════════════════════════════

def generate_receipt(
    db: Session,
    loan: Loan,
    narrative: str,
    amount_inr: int = None,
    on_time_count: int = None,
    late_count: int = None,
    total_lenders: int = None,
    guarantor_name: str = None,
    voucher_names: list[str] = None,
) -> LoanReceipt:
    """Create a loan receipt."""
    receipt = LoanReceipt(
        loan_id=loan.id,
        borrower_id=loan.borrower_id,
        narrative=narrative,
        amount_inr=amount_inr,
        purpose_category=loan.category,
        tenure_days=loan.duration_days,
        on_time_count=on_time_count,
        late_count=late_count,
        total_lenders=total_lenders,
        guarantor_name=guarantor_name,
        voucher_names_json=json.dumps(voucher_names) if voucher_names else None,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def get_user_receipts(db: Session, user_id: str) -> list[LoanReceipt]:
    return db.query(LoanReceipt).filter(LoanReceipt.borrower_id == user_id).all()


# ══════════════════════════════════════════════════════════════════
#  REMINDERS
# ══════════════════════════════════════════════════════════════════

def get_upcoming_installments(db: Session, days_ahead: int = 7) -> list[dict]:
    """Find installments due within `days_ahead` days that haven't been reminded."""
    today = datetime.utcnow().date()
    cutoff = today + timedelta(days=days_ahead)

    installments = (
        db.query(Installment)
        .join(Loan, Installment.loan_id == Loan.id)
        .join(User, Loan.borrower_id == User.id)
        .filter(
            Installment.status.in_(["upcoming", "overdue"]),
            Installment.due_date <= cutoff,
        )
        .all()
    )

    results = []
    for inst in installments:
        loan = inst.loan
        borrower = loan.borrower
        days_until = (inst.due_date - today).days
        amount_inr = int((inst.amount_microalgos / 1_000_000) * INR_PER_ALGO)
        results.append({
            "wallet_address": borrower.wallet_address,
            "borrower_name": borrower.name,
            "amount_microalgos": inst.amount_microalgos,
            "amount_inr": amount_inr,
            "due_date": inst.due_date.isoformat(),
            "days_until_due": days_until,
            "app_id": loan.app_id,
            "installment_no": inst.installment_no,
        })
    return results
