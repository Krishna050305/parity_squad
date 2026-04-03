"""
Transaction builders for LendPool backend.

Every function returns base64-encoded unsigned transaction(s).
The backend NEVER holds keys, NEVER signs, NEVER stores ALGO.
The frontend (Pera Wallet) signs these transactions.
"""

import base64
import os
from pathlib import Path

import dotenv
from algosdk import encoding, logic
from algosdk.abi import Method
from algosdk.transaction import (
    ApplicationCallTxn,
    ApplicationCreateTxn,
    OnComplete,
    PaymentTxn,
    StateSchema,
    assign_group_id,
)

from backend.algorand_client import get_algod

dotenv.load_dotenv()

# ──────────────────────────────────────────────
# ABI method selectors (first 4 bytes of SHA-512/256 of method signature)
# Parsed from the ARC56 spec
# ──────────────────────────────────────────────
METHOD_FUND_LOAN = Method.from_signature("fund_loan(pay)void")
METHOD_REPAY_LOAN = Method.from_signature("repay_loan(pay)void")
METHOD_CLAIM_REPAYMENT = Method.from_signature("claim_repayment()void")
METHOD_CREATE_LOAN = Method.from_signature("create_loan(uint64,uint64,uint64,uint64)void")

# Load compiled TEAL programs
_CONTRACT_DIR = Path(__file__).parent.parent / "smart_contracts" / "loan_contract"


def _load_teal(filename: str) -> bytes:
    """Load and compile a TEAL file, returning the compiled bytecode."""
    algod = get_algod()
    teal_path = _CONTRACT_DIR / filename
    teal_source = teal_path.read_text()
    result = algod.compile(teal_source)
    return base64.b64decode(result["result"])


def encode_txn(txn) -> str:
    """Encode a single transaction to base64 msgpack string.
    Note: algosdk.encoding.msgpack_encode() already returns a base64 string.
    """
    return encoding.msgpack_encode(txn)


def encode_txns(txns: list) -> list[str]:
    """Encode a list of transactions to base64 msgpack strings."""
    return [encode_txn(txn) for txn in txns]


def build_create_loan_txn(
    borrower_address: str,
    goal_microalgos: int,
    duration_days: int,
    tier_required: int,
    badge_asa_id: int = 0,
) -> list[str]:
    """
    Build an ApplicationCreateTxn for creating a new loan.

    Returns a list with a single base64-encoded unsigned transaction.
    """
    algod = get_algod()
    sp = algod.suggested_params()

    approval_program = _load_teal("LoanContract.approval.teal")
    clear_program = _load_teal("LoanContract.clear.teal")

    # Global schema: 7 ints + 2 byte slices (from ARC56 spec)
    global_schema = StateSchema(num_uints=7, num_byte_slices=2)
    # Local schema: 2 ints + 0 byte slices
    local_schema = StateSchema(num_uints=2, num_byte_slices=0)

    # ABI-encode the method call arguments
    app_args = [
        METHOD_CREATE_LOAN.get_selector(),
        goal_microalgos.to_bytes(8, "big"),
        duration_days.to_bytes(8, "big"),
        tier_required.to_bytes(8, "big"),
        badge_asa_id.to_bytes(8, "big"),
    ]

    txn = ApplicationCreateTxn(
        sender=borrower_address,
        sp=sp,
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema,
        app_args=app_args,
        foreign_assets=[badge_asa_id] if badge_asa_id > 0 else [],
    )

    return encode_txns([txn])


def build_fund_loan_txns(
    lender_address: str,
    app_id: int,
    amount_microalgos: int,
) -> list[str]:
    """
    Build an atomic group for funding a loan:
      [0] PaymentTxn → app address
      [1] ApplicationNoOpTxn calling fund_loan

    Returns base64-encoded unsigned transactions with group ID assigned.
    """
    algod = get_algod()
    sp = algod.suggested_params()

    # Get the application's escrow address
    app_address = logic.get_application_address(app_id)

    # Transaction 1: Payment to the contract escrow
    pay_txn = PaymentTxn(
        sender=lender_address,
        sp=sp,
        receiver=app_address,
        amt=amount_microalgos,
    )

    # Transaction 2: App call to fund_loan (references the payment)
    app_txn = ApplicationCallTxn(
        sender=lender_address,
        sp=sp,
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[METHOD_FUND_LOAN.get_selector()],
    )

    # Assign group ID
    grouped = assign_group_id([pay_txn, app_txn])

    return encode_txns(grouped)


def build_repay_loan_txns(
    borrower_address: str,
    app_id: int,
    amount_microalgos: int,
) -> list[str]:
    """
    Build an atomic group for repaying a loan:
      [0] PaymentTxn → app address
      [1] ApplicationNoOpTxn calling repay_loan

    Returns base64-encoded unsigned transactions with group ID assigned.
    """
    algod = get_algod()
    sp = algod.suggested_params()

    app_address = logic.get_application_address(app_id)

    # Transaction 1: Payment to the contract escrow
    pay_txn = PaymentTxn(
        sender=borrower_address,
        sp=sp,
        receiver=app_address,
        amt=amount_microalgos,
    )

    # Transaction 2: App call to repay_loan (references the payment)
    app_txn = ApplicationCallTxn(
        sender=borrower_address,
        sp=sp,
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[METHOD_REPAY_LOAN.get_selector()],
    )

    # Assign group ID
    grouped = assign_group_id([pay_txn, app_txn])

    return encode_txns(grouped)


def build_claim_txn(
    lender_address: str,
    app_id: int,
) -> list[str]:
    """
    Build a single ApplicationNoOpTxn calling claim_repayment.

    Returns a list with a single base64-encoded unsigned transaction.
    """
    algod = get_algod()
    sp = algod.suggested_params()

    txn = ApplicationCallTxn(
        sender=lender_address,
        sp=sp,
        index=app_id,
        on_complete=OnComplete.NoOpOC,
        app_args=[METHOD_CLAIM_REPAYMENT.get_selector()],
    )

    return encode_txns([txn])
