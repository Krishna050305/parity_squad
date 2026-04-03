import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from .kyc import verify_email_otp, verify_phone_otp, hash_pan_aadhaar, get_tier_for_verification
from .badge_minting import mint_tier_badge
from .algorand_client import get_algod
from .indexer import get_all_loans, get_loan_txns, get_wallet_history
from .transactions import (
    build_create_loan_txn,
    build_fund_loan_txns,
    build_repay_loan_txns,
    build_claim_txn
)

load_dotenv()
app = FastAPI(title="LendPool Backend APIs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    wallet_address: str
    email_otp: str | None = None
    phone_otp: str | None = None
    pan_document: str | None = None

users_state = {}

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
        "badge_asa_id": issued_badge
    }

class CreateLoanRequest(BaseModel):
    borrower_address: str
    goal_microalgos: int
    duration_days: int
    tier_required: int

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

@app.get("/loans")
def route_get_loans():
    return get_all_loans()

@app.get("/loans/{app_id}/txns")
def route_get_loan_txns(app_id: int):
    return get_loan_txns(app_id)

@app.get("/loans/{app_id}/state")
def route_get_loan_state(app_id: int):
    algod = get_algod()
    try:
        app_info = algod.application_info(app_id)
        state = app_info.get("params", {}).get("global-state", [])
        return {"state": state}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/loans/create")
def route_create_loan(req: CreateLoanRequest):
    badge_asa_id = int(os.getenv(f"TIER{req.tier_required}_BADGE_ID", 0))
    txns = build_create_loan_txn(
        req.borrower_address, 
        req.goal_microalgos, 
        req.duration_days, 
        req.tier_required,
        badge_asa_id
    )
    return {"txns": txns}

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
