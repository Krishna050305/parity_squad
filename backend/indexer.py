from .algorand_client import get_indexer, get_algod
import base64
import algosdk

def get_all_loans():
    indexer = get_indexer()
    # In a real app, we'd filter by creator or a specific note prefix
    return indexer.search_applications(limit=50)

def get_loan_txns(app_id: int):
    indexer = get_indexer()
    return indexer.search_transactions(application_id=app_id)

def get_wallet_history(address: str):
    indexer = get_indexer()
    return indexer.search_transactions(address=address)

def get_loan_app_state(app_id: int):
    """Wrapper around algod.application_info() that parses global state into a clean dict."""
    algod = get_algod()
    try:
        app_info = algod.application_info(app_id)
        state_array = app_info.get("params", {}).get("global-state", [])
        return parse_global_state(state_array)
    except Exception as e:
        print(f"Error fetching app {app_id} state: {e}")
        return {}

def parse_global_state(state_array: list) -> dict:
    """Utility to parse Algorand global state into a human-readable dict."""
    state = {}
    for item in state_array:
        key = base64.b64decode(item["key"]).decode("utf-8")
        value = item["value"]
        if value["type"] == 2:  # uint
            state[key] = value["uint"]
        else:  # bytes
            try:
                # Try to decode as address
                raw_bytes = base64.b64decode(value["bytes"])
                if len(raw_bytes) == 32:
                    state[key] = algosdk.encoding.encode_address(raw_bytes)
                else:
                    state[key] = value["bytes"]
            except:
                state[key] = value["bytes"]
    return state
