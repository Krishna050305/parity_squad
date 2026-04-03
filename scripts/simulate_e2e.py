import asyncio
import httpx
from algosdk import account, mnemonic
from algokit_utils import get_localnet_default_account, get_algod_client

async def main():
    print("Fetching localnet accounts...")
    algod = get_algod_client()
    default_acct = get_localnet_default_account(algod)
    
    # Generate a second account
    private_key_2, address_2 = account.generate_account()
    
    # Fund account 2 from default account to have ALGOs for testing
    from algokit_utils.transactions import transfer
    from algokit_utils.models import TransferParameters
    
    # Note: algokit_utils transfer might require AlgoAmount. We can just use the backend for testing if we need.
    import urllib.request
    import json
    
    BASE_URL = "http://localhost:8000"
    
    def post(path, data):
        req = urllib.request.Request(f"{BASE_URL}{path}", json.dumps(data).encode(), {"Content-Type": "application/json"})
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
            
    print(f"Borrower: {default_acct.address}")
    
    # 1. Create
    print("\n[1/4] Creating Loan...")
    res = post("/loans/create", {
        "borrower_address": default_acct.address,
        "goal_microalgos": 1000000,
        "duration_days": 30,
        "tier_required": 0
    })
    
    # We need to sign this. But we can't easily sign unsigned txns dynamically without reconstructing them in algosdk.
    # It's actually easier to just manually do the sequence or skip API and use the contract wrapper if we wanted pure contract test.
    print(res)

if __name__ == "__main__":
    asyncio.run(main())
