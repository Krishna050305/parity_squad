"""
Indexer queries for LendPool backend.
Reads chain state — never modifies it.
"""

import base64
from backend.algorand_client import get_algod, get_indexer


STATUS_LABELS = {
    0: "UNINITIALIZED",
    1: "OPEN",
    2: "FUNDED",
    3: "REPAYING",
    4: "CLOSED",
    5: "DEFAULTED",
}


def _decode_global_state(state_list: list) -> dict:
    """
    Decode the raw global state key-value pairs into a readable dict.
    Keys are base64 → utf-8 strings, values are uint or bytes.
    """
    decoded = {}
    for item in state_list:
        key = base64.b64decode(item["key"]).decode("utf-8")
        value = item["value"]
        if value["type"] == 2:  # uint
            decoded[key] = value["uint"]
        elif value["type"] == 1:  # bytes
            raw = base64.b64decode(value["bytes"])
            # 32-byte values are likely Algorand addresses
            if len(raw) == 32:
                from algosdk import encoding
                decoded[key] = encoding.encode_address(raw)
            else:
                decoded[key] = raw.hex()
    return decoded


def get_loan_state(app_id: int) -> dict:
    """
    Read the global state of a loan application from algod.
    Returns decoded key-value pairs with human-readable status.
    """
    algod = get_algod()
    app_info = algod.application_info(app_id)

    global_state_raw = app_info.get("params", {}).get("global-state", [])
    state = _decode_global_state(global_state_raw)

    # Add human-readable status label
    if "status" in state:
        state["status_label"] = STATUS_LABELS.get(state["status"], "UNKNOWN")

    return state


def get_all_loans() -> list[dict]:
    """
    Search for all LendPool loan applications via the Indexer.
    Returns a list of application summaries.
    """
    indexer = get_indexer()
    try:
        response = indexer.search_applications(limit=50)
        apps = response.get("applications", [])

        results = []
        for app in apps:
            app_id = app.get("id")
            global_state_raw = (
                app.get("params", {}).get("global-state", [])
            )
            state = _decode_global_state(global_state_raw) if global_state_raw else {}

            results.append({
                "app_id": app_id,
                "creator": app.get("params", {}).get("creator", ""),
                "state": state,
            })
        return results
    except Exception as e:
        return [{"error": str(e)}]


def get_loan_txns(app_id: int) -> dict:
    """
    Get all transactions for a specific loan application via the Indexer.
    """
    indexer = get_indexer()
    try:
        response = indexer.search_transactions(application_id=app_id, limit=50)
        return response
    except Exception as e:
        return {"error": str(e)}


def get_wallet_history(address: str) -> dict:
    """
    Get transaction history for a specific wallet address via the Indexer.
    """
    indexer = get_indexer()
    try:
        response = indexer.search_transactions(address=address, limit=50)
        return response
    except Exception as e:
        return {"error": str(e)}
