import logging
import base64
import json
import algosdk
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
import algokit_utils

logger = logging.getLogger(__name__)

def deploy() -> None:
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    with open("smart_contracts/artifacts/loan_contract/LoanContract.arc56.json") as f:
        spec = json.load(f)

    # Use pre-compiled bytecode from ARC56
    approval = base64.b64decode(spec["byteCode"]["approval"])
    clear = base64.b64decode(spec["byteCode"]["clear"])

    method = algosdk.abi.Method.from_signature("create_loan(uint64,uint64,uint64,uint64)void")
    selector = method.get_selector()

    app_call = ApplicationCreateTxn(
        sender=deployer_.address,
        sp=algorand.client.algod.suggested_params(),
        on_complete=OnComplete.NoOpOC,
        approval_program=approval,
        clear_program=clear,
        global_schema=StateSchema(
            spec["state"]["schema"]["global"]["ints"],
            spec["state"]["schema"]["global"]["bytes"],
        ),
        local_schema=StateSchema(
            spec["state"]["schema"]["local"]["ints"], spec["state"]["schema"]["local"]["bytes"]
        ),
        app_args=[
            selector,
            (1000000).to_bytes(8, "big"),
            (30).to_bytes(8, "big"),
            (1).to_bytes(8, "big"),
            (0).to_bytes(8, "big"),
        ],
    )

    signed_txn = app_call.sign(deployer_.private_key)
    txid = algorand.client.algod.send_transaction(signed_txn)
    result = algosdk.transaction.wait_for_confirmation(algorand.client.algod, txid, 4)
    app_id = result["application-index"]

    logger.info(f"Deployed LoanContract! APP_ID: {app_id}")
    print(f"\nAPP_ID_IS_HERE={app_id}\n")
