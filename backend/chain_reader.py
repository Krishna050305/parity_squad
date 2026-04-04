from . import crud, db_models
from .indexer import get_all_loans, get_loan_app_state
from .database import SessionLocal
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def sync_chain_to_db(app_id: int, db: Session):
    """One-way sync: read on-chain state -> update DB cache (status, funded_amount, repaid_amount)."""
    try:
        state = get_loan_app_state(app_id)
        if not state:
            return
        
        loan = crud.get_loan_by_app_id(db, app_id)
        if loan:
            loan.status = state.get("status", loan.status)
            loan.funded_microalgos = state.get("funded_amount", loan.funded_microalgos)
            loan.repaid_microalgos = state.get("repaid_amount", loan.repaid_microalgos)
            db.commit()
            logger.info(f"Synced app {app_id} to DB")
    except Exception as e:
        logger.error(f"Sync error for app {app_id}: {e}")

def get_all_chain_loans(db: Session, category: str = None):
    """
    Query indexer for all LendPool applications, parse global state,
    and merge with DB metadata (purpose, category).
    """
    try:
        indexer_apps = get_all_loans()
        apps = indexer_apps.get("applications", [])
        
        results = []
        for app in apps:
            app_id = app["id"]
            state_array = app.get("params", {}).get("global-state", [])
            
            # Simple check if it's a LendPool contract (has 'borrower' in state)
            from .indexer import parse_global_state
            state = parse_global_state(state_array)
            if "borrower" not in state:
                continue
                
            # Get metadata from DB
            db_loan = crud.get_loan_by_app_id(db, app_id)
            
            # Filter by category if requested
            if category and db_loan and db_loan.category != category:
                continue

            results.append({
                "id": str(db_loan.id) if db_loan else f"chain-{app_id}",
                "app_id": app_id,
                "borrower_wallet": state.get("borrower"),
                "purpose": db_loan.purpose if db_loan else "On-chain Loan",
                "category": db_loan.category if db_loan else "other",
                "goal_microalgos": state.get("goal_amount", 0),
                "funded_microalgos": state.get("funded_amount", 0),
                "status": state.get("status", 1),
                "tier_required": state.get("tier_required", 0),
                "trust_path": db_loan.trust_path if db_loan else "solo",
                "created_at": db_loan.created_at.isoformat() if db_loan and db_loan.created_at else None,
                "borrower_trust": float(db_loan.borrower.trust_score or 50) if db_loan and db_loan.borrower else 50,
            })
            
        return results
    except Exception as e:
        logger.error(f"Error fetching chain loans: {e}")
        return []
