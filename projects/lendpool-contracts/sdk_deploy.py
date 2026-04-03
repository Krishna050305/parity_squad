import os
from algosdk.v2client import algod
from algosdk import transaction, account, mnemonic
from pathlib import Path
import base64

# Config
ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "a" * 64

PROJECT_ROOT = Path(__file__).parent
ARTIFACT_PATH = PROJECT_ROOT / "smart_contracts" / "artifacts" / "loan_contract"

def compile_program(client, source_code):
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])

def main():
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    # Get localnet account (using default KMD logic simplified: just use a known localnet account or dispenser)
    # Actually, we can get it from the dispenser if we have algokit-utils or just use a dummy mnemonic for localnet
    # But wait, I'll use the dispenser from algokit-utils since it's already there
    try:
        import algokit_utils
        algorand = algokit_utils.AlgorandClient.default_localnet()
        dispenser = algorand.account.localnet_dispenser()
        private_key = dispenser.private_key
        sender = dispenser.address
    except:
        print("Could not get dispenser, please ensure LocalNet is running")
        return

    # Load TEAL
    with open(ARTIFACT_PATH / "LoanContract.approval.teal", "r") as f:
        approval_source = f.read()
    with open(ARTIFACT_PATH / "LoanContract.clear.teal", "r") as f:
        clear_source = f.read()
        
    # Compile
    approval_program = compile_program(client, approval_source)
    clear_program = compile_program(client, clear_source)
    
    # Create App
    # create_loan(goal_amount, duration_days, tier_required, badge_asa_id)
    # We need the ABI selector for create_loan
    # method "create_loan(uint64,uint64,uint64,uint64)void" -> 0xdc85f076
    selector = b'\xdc\x85\xf0v'
    
    # Args
    args = [
        selector,
        (1_000_000).to_bytes(8, 'big'), # goal
        (30).to_bytes(8, 'big'),        # duration
        (0).to_bytes(8, 'big'),         # tier
        (0).to_bytes(8, 'big')          # badge
    ]
    
    params = client.suggested_params()
    
    txn = transaction.ApplicationCreateTxn(
        sender=sender,
        sp=params,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=transaction.StateSchema(num_uints=7, num_byte_slices=2),
        local_schema=transaction.StateSchema(num_uints=2, num_byte_slices=0),
        app_args=args
    )
    
    # Sign and send
    signed_txn = txn.sign(private_key)
    txid = client.send_transaction(signed_txn)
    print(f"Transaction ID: {txid}")
    
    # Wait for completion
    result = transaction.wait_for_confirmation(client, txid, 4)
    app_id = result['application-index']
    
    print("\n" + "="*40)
    print(f"DEPLOYMENT SUCCESSFUL (SDK)")
    print(f"App ID: {app_id}")
    print("="*40)

if __name__ == "__main__":
    main()
