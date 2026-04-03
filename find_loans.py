import base64
import json
import os
import hashlib
from algosdk.v2client import indexer

def get_hash():
    with open('smart_contracts/artifacts/loan_contract/LoanContract.arc56.json', 'r') as f:
        spec = json.load(f)
    program = base64.b64decode(spec['byteCode']['approval'])
    return base64.b64encode(hashlib.sha256(program).digest()).decode()

def search():
    idx = indexer.IndexerClient("", "https://testnet-idx.algonode.cloud", "")
    h = get_hash()
    print(f"Searching for approval hash: {h}")
    # Searching by application creator or just listing recent apps
    # Note: Search by approval program hash is more efficient
    # But for a quick check, let's just see if we can find any apps created recently
    apps = idx.search_applications(limit=10)
    print(json.dumps(apps, indent=2))

if __name__ == "__main__":
    search()
