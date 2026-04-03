import algosdk
from algosdk.transaction import PaymentTxn, ApplicationNoOpTxn, assign_group_id
from transactions import build_fund_loan_txns
import json

base64_txns = build_fund_loan_txns("FQK4RUX3IKS5UYZ375Q42X6J7QWJ7F7B7B7B7B7B7B7B7B7B7BVA", 1001, 2000000)
print(json.dumps(base64_txns))
