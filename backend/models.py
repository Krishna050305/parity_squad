"""Pydantic models for all LendPool API request/response types."""

from pydantic import BaseModel, Field
from typing import Optional


# ── Error Model ──────────────────────────────────────────────────
class LendPoolError(BaseModel):
    code: str           # e.g. "INSUFFICIENT_TIER"
    message: str        # Human-readable
    suggestion: str     # What user should do


# ── Auth & User Management ───────────────────────────────────────
class LenderLoginRequest(BaseModel):
    name: str
    mobile: str
    otp: str

class BorrowerLoginRequest(BaseModel):
    user_id: str
    password: str

class BorrowerRegisterRequest(BaseModel):
    aadhaar_hash: str
    pan_document: str
    otp: str
    mobile: str


# ── Existing (kept) ──────────────────────────────────────────────
class VerificationRequest(BaseModel):
    wallet_address: str
    email_otp: Optional[str] = None
    phone_otp: Optional[str] = None
    pan_document: Optional[str] = None

class CreateLoanRequest(BaseModel):
    borrower_address: str
    goal_microalgos: int
    duration_days: int
    tier_required: int
    purpose: Optional[str] = None
    category: Optional[str] = None
    installment_schedule: Optional[dict] = None

class FundLoanRequest(BaseModel):
    lender_address: str
    app_id: int
    amount_microalgos: int

class RepayLoanRequest(BaseModel):
    borrower_address: str
    app_id: int
    amount_microalgos: int

class ClaimRequest(BaseModel):
    lender_address: str
    app_id: int

class AddGuarantorRequest(BaseModel):
    borrower_address: str
    app_id: int
    guarantor_address: str


# ── Trust Path & Vouch ───────────────────────────────────────────
class VouchPaymentRequest(BaseModel):
    borrower_address: str
    voucher_address: str
    amount_inr: int

class GuarantorRequest(BaseModel):
    borrower_address: str
    guarantor_address: str
    app_id: int

class NotificationApproveRequest(BaseModel):
    guarantor_address: str


# ── Loan Installments & Schedules ────────────────────────────────
class CreateScheduleRequest(BaseModel):
    amount_microalgos: int
    tenure_months: int
    installment_frequency: str  # "weekly" | "biweekly" | "monthly"
    start_date: str             # ISO date string e.g. "2025-01-15"

class PayInstallmentRequest(BaseModel):
    borrower_address: str


# ── Loan Memory Receipts ─────────────────────────────────────────
class GenerateReceiptRequest(BaseModel):
    app_id: int


# ── Score Impact ─────────────────────────────────────────────────
class UpdateScoreRequest(BaseModel):
    wallet_address: str
    event_type: str
    # event_type: "loan_repaid_ontime" | "loan_repaid_late" | "loan_defaulted"
    #             "guarantor_borrower_repaid" | "guarantor_borrower_defaulted"
    #             "vouched_borrower_repaid" | "vouched_borrower_defaulted"
