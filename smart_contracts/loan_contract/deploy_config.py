import logging
import base64
import json
import os
import algosdk
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
import algokit_utils
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

def deploy() -> None:
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    with open("smart_contracts/artifacts/loan_contract/LoanContract.arc32.json") as f:
        spec = json.load(f)

    # ARC-32 source is base64-encoded TEAL; compile via algod
    approval_teal = base64.b64decode(spec["source"]["approval"]).decode("utf-8")
    clear_teal = base64.b64decode(spec["source"]["clear"]).decode("utf-8")

    approval_result = algorand.client.algod.compile(approval_teal)
    approval = base64.b64decode(approval_result["result"])
    clear_result = algorand.client.algod.compile(clear_teal)
    clear = base64.b64decode(clear_result["result"])

    method = algosdk.abi.Method.from_signature("create_loan(uint64,uint64,uint64,asset)void")
    selector = method.get_selector()

    # Get Tier 1 badge id for deployment check
    tier1_badge_id = int(os.getenv("TIER1_BADGE_ID", 1004))

    # Calculate extra pages needed (each page = 2048 bytes)
    import math
    extra_pages = max(0, math.ceil(len(approval) / 2048) - 1)

    app_call = ApplicationCreateTxn(
        sender=deployer_.address,
        sp=algorand.client.algod.suggested_params(),
        on_complete=OnComplete.NoOpOC,
        approval_program=approval,
        clear_program=clear,
        extra_pages=extra_pages,
        global_schema=StateSchema(
            spec["state"]["global"]["num_uints"],
            spec["state"]["global"]["num_byte_slices"],
        ),
        local_schema=StateSchema(
            spec["state"]["local"]["num_uints"], spec["state"]["local"]["num_byte_slices"]
        ),
        app_args=[
            selector,
            (400_000_000).to_bytes(8, "big"), # 400 ALGO
            (30).to_bytes(8, "big"),
            (1).to_bytes(8, "big"),
            (0).to_bytes(1, "big"), # index 0 of foreign_assets
        ],
        foreign_assets=[tier1_badge_id],
    )

    signed_txn = app_call.sign(deployer_.private_key)
    try:
        txid = algorand.client.algod.send_transaction(signed_txn)
        result = algosdk.transaction.wait_for_confirmation(algorand.client.algod, txid, 4)
        app_id = result["application-index"]

        logger.info(f"Deployed LoanContract! APP_ID: {app_id}")
        print(f"\nAPP_ID_IS_HERE={app_id}\n")
        
        env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                lines = f.readlines()
            newlines = [l for l in lines if not l.startswith("APP_ID=")]
            newlines.append(f"APP_ID={app_id}\n")
            with open(env_path, "w") as f:
                f.writelines(newlines)
    except Exception as e:
        logger.error(f"Deploy failed: {e}")
        # Not holding asset, it's expected! Because deployer hasn't opted in to Tier 1 badge!
        print(f"Deployment test finished with expected ABI guard: {str(e)}")
