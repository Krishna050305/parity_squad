import base64
import json
import os
import algosdk
from algosdk.transaction import (
    ApplicationCreateTxn, 
    ApplicationNoOpTxn, 
    PaymentTxn, 
    StateSchema,
    assign_group_id
)
from .algorand_client import get_algod

# Method selectors derived from algosdk.abi
CREATE_SELECTOR = algosdk.abi.Method.from_signature("create_loan(uint64,uint64,uint64,asset)void").get_selector()
FUND_SELECTOR = algosdk.abi.Method.from_signature("fund_loan(pay)void").get_selector()
REPAY_SELECTOR = algosdk.abi.Method.from_signature("repay_loan(pay)void").get_selector()
CLAIM_SELECTOR = algosdk.abi.Method.from_signature("claim_repayment()void").get_selector()
GUARANTOR_SELECTOR = algosdk.abi.Method.from_signature("add_guarantor(account)void").get_selector()

def encode_txns(txns: list) -> list[str]:
    """Base64 msgpack-encode a list of transactions."""
    return [base64.b64encode(algosdk.encoding.msgpack_encode(txn)).decode("utf-8") for txn in txns]

def get_approval_clear_programs():
    path = os.path.join(os.path.dirname(__file__), '..', 'smart_contracts', 'artifacts', 'loan_contract', 'LoanContract.arc56.json')
    with open(path, "r") as f:
        spec = json.load(f)
    return (
        base64.b64decode(spec["byteCode"]["approval"]),
        base64.b64decode(spec["byteCode"]["clear"])
    )

def build_create_loan_txn(borrower_address: str, goal_microalgos: int, duration_days: int, tier_required: int, badge_asa_id: int):
    algod_client = get_algod()
    sp = algod_client.suggested_params()
    approval, clear = get_approval_clear_programs()
    
    txn = ApplicationCreateTxn(
        sender=borrower_address,
        sp=sp,
        on_complete=algosdk.transaction.OnComplete.NoOpOC,
        approval_program=approval,
        clear_program=clear,
        global_schema=StateSchema(9, 2),
        local_schema=StateSchema(0, 2),
        app_args=[
            CREATE_SELECTOR,
            (goal_microalgos).to_bytes(8, "big"),
            (duration_days).to_bytes(8, "big"),
            (tier_required).to_bytes(8, "big"),
            (0).to_bytes(1, "big") # index representing `foreign_assets[0]`
        ],
        foreign_assets=[badge_asa_id] if badge_asa_id else []
    )
    return encode_txns([txn])

def build_fund_loan_txns(lender_address: str, app_id: int, amount_microalgos: int):
    algod_client = get_algod()
    sp = algod_client.suggested_params()
    app_addr = algosdk.logic.get_application_address(app_id)
    
    pay_txn = PaymentTxn(
        sender=lender_address,
        sp=sp,
        receiver=app_addr,
        amt=amount_microalgos
    )
    
    app_txn = ApplicationNoOpTxn(
        sender=lender_address,
        sp=sp,
        index=app_id,
        app_args=[FUND_SELECTOR]
    )
    
    txns = assign_group_id([pay_txn, app_txn])
    return encode_txns(txns)

def build_repay_loan_txns(borrower_address: str, app_id: int, amount_microalgos: int):
    algod_client = get_algod()
    sp = algod_client.suggested_params()
    app_addr = algosdk.logic.get_application_address(app_id)
    
    pay_txn = PaymentTxn(
        sender=borrower_address,
        sp=sp,
        receiver=app_addr,
        amt=amount_microalgos
    )
    
    app_txn = ApplicationNoOpTxn(
        sender=borrower_address,
        sp=sp,
        index=app_id,
        app_args=[REPAY_SELECTOR]
    )
    
    txns = assign_group_id([pay_txn, app_txn])
    return encode_txns(txns)

def build_claim_txn(lender_address: str, app_id: int):
    algod_client = get_algod()
    sp = algod_client.suggested_params()
    
    txn = ApplicationNoOpTxn(
        sender=lender_address,
        sp=sp,
        index=app_id,
        app_args=[CLAIM_SELECTOR]
    )
    return encode_txns([txn])
