"""SQLAlchemy ORM models for LendPool database.

All tables from the schema: users, loans, installments, lender_contributions,
vouches, guarantors, notifications, score_events, loan_receipts.

Compatible with both PostgreSQL (UUID, ARRAY) and SQLite (String fallbacks).
"""

import uuid
import os
from datetime import datetime

from sqlalchemy import (
    Column, String, Integer, Boolean, Text, Numeric, BigInteger,
    DateTime, Date, ForeignKey, UniqueConstraint, Index, CheckConstraint,
    event,
)
from sqlalchemy.orm import relationship

from .database import Base

# ── Detect dialect for UUID/ARRAY handling ──────────────────────
_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lendpool.db")
_IS_POSTGRES = _DATABASE_URL.startswith("postgresql")

if _IS_POSTGRES:
    from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ARRAY as PG_ARRAY
    _UUID_TYPE = PG_UUID(as_uuid=True)
    _ARRAY_TYPE = lambda inner: PG_ARRAY(inner)  # noqa: E731
else:
    # SQLite: use String(36) for UUIDs, Text for arrays (JSON-serialized)
    _UUID_TYPE = String(36)
    _ARRAY_TYPE = lambda inner: Text  # noqa: E731


def _new_uuid():
    return str(uuid.uuid4()) if not _IS_POSTGRES else uuid.uuid4()


# ══════════════════════════════════════════════════════════════════
#  USERS TABLE
# ══════════════════════════════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    wallet_address = Column(String(58), unique=True, nullable=False, index=True)
    name = Column(String(255))
    role = Column(String(20), nullable=False)  # 'borrower', 'lender', 'both'
    mobile = Column(String(15))
    email = Column(String(255))

    # KYC State
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    pan_hash = Column(String(64))        # SHA-256 of PAN
    aadhaar_hash = Column(String(64))    # SHA-256 of Aadhaar
    tier = Column(Integer, default=0)
    tier_badge_asa_id = Column(BigInteger)

    # Score System
    trust_score = Column(Numeric(5, 2), default=50.0)
    risk_score = Column(Numeric(5, 2), default=50.0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active_at = Column(DateTime)
    is_active = Column(Boolean, default=True)

    # Community Role
    is_voucher = Column(Boolean, default=False)
    is_guarantor = Column(Boolean, default=False)
    voucher_bio = Column(Text)
    loans_backed_count = Column(Integer, default=0)

    # Password (hashed in production)
    password_hash = Column(String(255))

    # Relationships
    loans_as_borrower = relationship("Loan", back_populates="borrower", foreign_keys="Loan.borrower_id")
    contributions = relationship("LenderContribution", back_populates="lender")
    vouches_given = relationship("Vouch", back_populates="voucher", foreign_keys="Vouch.voucher_id")
    guarantees_given = relationship("Guarantor", back_populates="guarantor_user", foreign_keys="Guarantor.guarantor_id")
    score_events = relationship("ScoreEvent", back_populates="user")
    receipts = relationship("LoanReceipt", back_populates="borrower_user")

    def __repr__(self):
        return f"<User {self.name} wallet={self.wallet_address[:16]}...>"


Index("idx_users_trust_score", User.trust_score.desc())
Index("idx_users_tier", User.tier)


# ══════════════════════════════════════════════════════════════════
#  LOANS TABLE
# ══════════════════════════════════════════════════════════════════
class Loan(Base):
    __tablename__ = "loans"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    app_id = Column(BigInteger, unique=True)  # Algorand Application ID

    borrower_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False, index=True)

    # Loan Parameters
    purpose = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # agriculture, medical, education, housing, business, other
    goal_microalgos = Column(BigInteger, nullable=False)
    funded_microalgos = Column(BigInteger, default=0)
    repaid_microalgos = Column(BigInteger, default=0)
    tier_required = Column(Integer, default=0)

    # Schedule (immutable once set)
    tenure_months = Column(Integer)
    installment_frequency = Column(String(20))  # weekly, biweekly, monthly
    installment_count = Column(Integer)
    installment_amount_microalgos = Column(BigInteger)
    schedule_locked_at = Column(DateTime)

    # Status: 1=OPEN, 2=FUNDED, 3=REPAYING, 4=CLOSED, 5=DEFAULTED
    status = Column(Integer, default=1, index=True)

    # Dates
    created_at = Column(DateTime, default=datetime.utcnow)
    funded_at = Column(DateTime)
    repayment_started_at = Column(DateTime)
    closed_at = Column(DateTime)
    deadline = Column(DateTime)
    duration_days = Column(Integer)

    # Trust Path
    trust_path = Column(String(20))  # vouch, guarantor, solo

    # On-Chain Receipt
    receipt_narrative = Column(Text)
    receipt_generated_at = Column(DateTime)

    # Relationships
    borrower = relationship("User", back_populates="loans_as_borrower", foreign_keys=[borrower_id])
    installments = relationship("Installment", back_populates="loan", cascade="all, delete-orphan")
    contributions = relationship("LenderContribution", back_populates="loan")
    vouches = relationship("Vouch", back_populates="loan")
    guarantors = relationship("Guarantor", back_populates="loan")
    receipt = relationship("LoanReceipt", back_populates="loan", uselist=False)

    def __repr__(self):
        return f"<Loan {self.id} status={self.status} goal={self.goal_microalgos}>"


Index("idx_loans_app_id", Loan.app_id)
Index("idx_loans_category", Loan.category)


# ══════════════════════════════════════════════════════════════════
#  INSTALLMENTS TABLE
# ══════════════════════════════════════════════════════════════════
class Installment(Base):
    __tablename__ = "installments"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id", ondelete="CASCADE"), nullable=False, index=True)

    installment_no = Column(Integer, nullable=False)
    due_date = Column(Date, nullable=False)
    amount_microalgos = Column(BigInteger, nullable=False)

    # Status
    status = Column(String(20), default="upcoming")  # upcoming, paid, paid_late, overdue
    paid_at = Column(DateTime)
    days_late = Column(Integer, default=0)
    txn_id = Column(String(52))  # Algorand transaction ID

    # Reminders
    reminder_7day_sent = Column(Boolean, default=False)
    reminder_1day_sent = Column(Boolean, default=False)

    # Relationships
    loan = relationship("Loan", back_populates="installments")

    __table_args__ = (
        UniqueConstraint("loan_id", "installment_no", name="uq_installment_loan_no"),
    )

    def __repr__(self):
        return f"<Installment #{self.installment_no} due={self.due_date} status={self.status}>"


Index("idx_installments_due_date", Installment.due_date)
Index("idx_installments_status", Installment.status)


# ══════════════════════════════════════════════════════════════════
#  LENDER_CONTRIBUTIONS TABLE
# ══════════════════════════════════════════════════════════════════
class LenderContribution(Base):
    __tablename__ = "lender_contributions"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"), nullable=False, index=True)
    lender_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False, index=True)

    amount_microalgos = Column(BigInteger, nullable=False)
    contributed_at = Column(DateTime, default=datetime.utcnow)
    txn_id = Column(String(52))

    # Repayment tracking
    claimed_amount_microalgos = Column(BigInteger, default=0)
    claimed_at = Column(DateTime)

    # Relationships
    loan = relationship("Loan", back_populates="contributions")
    lender = relationship("User", back_populates="contributions")

    __table_args__ = (
        UniqueConstraint("loan_id", "lender_id", name="uq_contribution_loan_lender"),
    )


# ══════════════════════════════════════════════════════════════════
#  VOUCHES TABLE
# ══════════════════════════════════════════════════════════════════
class Vouch(Base):
    __tablename__ = "vouches"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"), nullable=False)
    borrower_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)
    voucher_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)

    payment_amount_inr = Column(Integer, default=500)
    payment_txn_id = Column(String(52))
    status = Column(String(20), default="pending")  # pending, confirmed, voided

    created_at = Column(DateTime, default=datetime.utcnow)
    confirmed_at = Column(DateTime)

    # Relationships
    loan = relationship("Loan", back_populates="vouches")
    borrower = relationship("User", foreign_keys=[borrower_id])
    voucher = relationship("User", back_populates="vouches_given", foreign_keys=[voucher_id])

    __table_args__ = (
        UniqueConstraint("loan_id", "voucher_id", name="uq_vouch_loan_voucher"),
    )


# ══════════════════════════════════════════════════════════════════
#  GUARANTORS TABLE
# ══════════════════════════════════════════════════════════════════
class Guarantor(Base):
    __tablename__ = "guarantors"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"), nullable=False)
    borrower_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)
    guarantor_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)

    status = Column(String(20), default="pending")  # pending, approved, declined, forfeited
    requested_at = Column(DateTime, default=datetime.utcnow)
    responded_at = Column(DateTime)
    on_chain_txn_id = Column(String(52))

    # Impact tracking
    borrower_outcome = Column(String(20))  # repaid_ontime, repaid_late, defaulted
    trust_impact_applied = Column(Boolean, default=False)

    # Relationships
    loan = relationship("Loan", back_populates="guarantors")
    borrower = relationship("User", foreign_keys=[borrower_id])
    guarantor_user = relationship("User", back_populates="guarantees_given", foreign_keys=[guarantor_id])


# ══════════════════════════════════════════════════════════════════
#  NOTIFICATIONS TABLE
# ══════════════════════════════════════════════════════════════════
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    recipient_wallet = Column(String(58), nullable=False, index=True)
    sender_wallet = Column(String(58))

    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)

    # Related entities
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"))
    related_user_id = Column(_UUID_TYPE, ForeignKey("users.id"))

    # State
    is_read = Column(Boolean, default=False)
    requires_action = Column(Boolean, default=False)
    action_taken = Column(String(50))

    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

    # Relationships
    loan = relationship("Loan")
    related_user = relationship("User")


Index("idx_notifications_unread", Notification.recipient_wallet, Notification.is_read)


# ══════════════════════════════════════════════════════════════════
#  SCORE_EVENTS TABLE (Audit Trail for ML)
# ══════════════════════════════════════════════════════════════════
class ScoreEvent(Base):
    __tablename__ = "score_events"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    user_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)

    event_type = Column(String(50), nullable=False)
    trust_delta = Column(Numeric(5, 2))
    risk_delta = Column(Numeric(5, 2))
    trust_score_before = Column(Numeric(5, 2))
    risk_score_before = Column(Numeric(5, 2))
    trust_score_after = Column(Numeric(5, 2))
    risk_score_after = Column(Numeric(5, 2))

    related_loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"))
    applied_at = Column(DateTime, default=datetime.utcnow)
    applied_by = Column(String(50), default="system")  # system, ml_model, admin

    # Relationships
    user = relationship("User", back_populates="score_events")
    related_loan = relationship("Loan")


# ══════════════════════════════════════════════════════════════════
#  LOAN_RECEIPTS TABLE (Portable On-Chain Story)
# ══════════════════════════════════════════════════════════════════
class LoanReceipt(Base):
    __tablename__ = "loan_receipts"

    id = Column(_UUID_TYPE, primary_key=True, default=_new_uuid)
    loan_id = Column(_UUID_TYPE, ForeignKey("loans.id"), unique=True, nullable=False)
    borrower_id = Column(_UUID_TYPE, ForeignKey("users.id"), nullable=False)

    narrative = Column(Text, nullable=False)
    algo_txn_id = Column(String(52))

    # Structured fields for ML/display
    amount_inr = Column(Integer)
    purpose_category = Column(String(50))
    tenure_days = Column(Integer)
    on_time_count = Column(Integer)
    late_count = Column(Integer)
    total_lenders = Column(Integer)
    guarantor_name = Column(String(255))
    voucher_names_json = Column(Text)  # JSON array (SQLite compat; use ARRAY on PG)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    loan = relationship("Loan", back_populates="receipt")
    borrower_user = relationship("User", back_populates="receipts")
