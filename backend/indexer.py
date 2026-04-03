from .algorand_client import get_indexer

def get_all_loans():
    indexer = get_indexer()
    return indexer.search_applications(limit=50)

def get_loan_txns(app_id: int):
    indexer = get_indexer()
    return indexer.search_transactions(application_id=app_id)

def get_wallet_history(address: str):
    indexer = get_indexer()
    return indexer.search_transactions(address=address)
