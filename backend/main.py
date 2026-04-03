"""
LendPool FastAPI Backend

The backend's ONLY job is building unsigned transactions and reading chain state.
It never holds keys, never signs, never stores ALGO.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.indexer import get_all_loans, get_loan_txns, get_wallet_history, get_loan_state
from backend.transactions import (
    build_create_loan_txn,
    build_fund_loan_txns,
    build_repay_loan_txns,
    build_claim_txn,
)

# ──────────────────────────────────────────────
# App
# ──────────────────────────────────────────────
app = FastAPI(
    title="LendPool API",
    description="Community-based P2P lending on Algorand. "
                "Builds unsigned transactions for frontend signing via Pera Wallet.",
    version="0.1.0",
)

# CORS — allow all origins for hackathon demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Pydantic Models
# ──────────────────────────────────────────────
class CreateLoanRequest(BaseModel):
    borrower_address: str
    goal_microalgos: int
    duration_days: int
    tier_required: int = 0
    badge_asa_id: int = 0


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


# ──────────────────────────────────────────────
# GET Routes — Read chain state
# ──────────────────────────────────────────────
@app.get("/loans")
def list_loans():
    """Get all loan applications from the Indexer."""
    loans = get_all_loans()
    return {"loans": loans}


@app.get("/loans/{app_id}/txns")
def loan_transactions(app_id: int):
    """Get all transactions for a specific loan."""
    txns = get_loan_txns(app_id)
    return txns


@app.get("/loans/{app_id}/state")
def loan_state(app_id: int):
    """Get the decoded global state of a loan application."""
    try:
        state = get_loan_state(app_id)
        return {"app_id": app_id, "state": state}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/wallet/{address}/history")
def wallet_history(address: str):
    """Get transaction history for a wallet address."""
    history = get_wallet_history(address)
    return history


# ──────────────────────────────────────────────
# POST Routes — Build unsigned transactions
# ──────────────────────────────────────────────
@app.post("/loans/create")
def create_loan(req: CreateLoanRequest):
    """
    Build an unsigned ApplicationCreateTxn for a new loan.
    Returns base64-encoded transaction(s) for Pera Wallet to sign.
    """
    try:
        txns = build_create_loan_txn(
            borrower_address=req.borrower_address,
            goal_microalgos=req.goal_microalgos,
            duration_days=req.duration_days,
            tier_required=req.tier_required,
            badge_asa_id=req.badge_asa_id,
        )
        return {"txns": txns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/loans/fund")
def fund_loan(req: FundLoanRequest):
    """
    Build an unsigned atomic group [PaymentTxn + AppCallTxn] to fund a loan.
    Returns base64-encoded transactions for Pera Wallet to sign.
    """
    try:
        txns = build_fund_loan_txns(
            lender_address=req.lender_address,
            app_id=req.app_id,
            amount_microalgos=req.amount_microalgos,
        )
        return {"txns": txns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/loans/repay")
def repay_loan(req: RepayLoanRequest):
    """
    Build an unsigned atomic group [PaymentTxn + AppCallTxn] to repay a loan.
    Returns base64-encoded transactions for Pera Wallet to sign.
    """
    try:
        txns = build_repay_loan_txns(
            borrower_address=req.borrower_address,
            app_id=req.app_id,
            amount_microalgos=req.amount_microalgos,
        )
        return {"txns": txns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/loans/{app_id}/claim")
def claim_repayment(app_id: int, req: ClaimRequest):
    """
    Build an unsigned AppCallTxn to claim pro-rata repayment.
    Returns base64-encoded transaction for Pera Wallet to sign.
    """
    try:
        txns = build_claim_txn(
            lender_address=req.lender_address,
            app_id=app_id,
        )
        return {"txns": txns}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
