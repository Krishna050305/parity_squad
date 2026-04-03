# LendPool Database Schema Implementation

## Summary

Migrated the LendPool backend from **in-memory dictionaries** (`DEMO_USERS`, `notifications_store`, `loan_schedules`, etc.) to a persistent **SQLAlchemy database** supporting both PostgreSQL (production) and SQLite (local dev).

## Files Created

### 1. [database.py](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/database.py)
- SQLAlchemy `engine`, `SessionLocal`, and `Base`
- Auto-detects PostgreSQL vs SQLite from `DATABASE_URL` env var
- FastAPI `Depends(get_db)` session injection
- SQLite: enables WAL mode + foreign keys via pragma

### 2. [db_models.py](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/db_models.py)
All **9 ORM models** with full relationships:

| Table | Purpose |
|-------|---------|
| `users` | Wallet, KYC state, tier, trust/risk scores, community role |
| `loans` | Algorand app_id, purpose, category, status, schedule fields |
| `installments` | Per-loan payment schedule with due dates, late tracking |
| `lender_contributions` | Who funded how much per loan |
| `vouches` | Vouch relationships with ₹500 payment tracking |
| `guarantors` | Guarantor requests/approvals with outcome tracking |
| `notifications` | Typed notifications with action states |
| `score_events` | ML audit trail for trust/risk delta history |
| `loan_receipts` | Portable on-chain story narratives |

> [!NOTE]
> UUID columns use `String(36)` on SQLite and native `UUID` on PostgreSQL for cross-dialect compatibility.

### 3. [crud.py](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/crud.py)
Complete CRUD layer replacing all dict-based logic:
- `get_or_create_user()` — replaces `get_user()` from `demo_data.py`
- `update_user_scores()` — applies deltas + creates `ScoreEvent` audit row
- `create_loan()` + `_create_installments()` — replaces `loan_metadata` + `loan_schedules` dicts
- `pay_installment()` — replaces manual dict mutation
- `create_guarantor_notification()` — replaces `create_notification()` from `demo_data.py`
- `get_upcoming_installments()` — powers reminder system via DB queries

### 4. [seed.py](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/seed.py)
- Creates all tables via `Base.metadata.create_all()`
- Seeds 6 demo users (Ravi, Sneha, Amit, Priyanka, Venkat, Meera)
- Idempotent — skips existing records on re-run
- Run with: `python -m backend.seed`

### 5. [schema.sql](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/schema.sql)
- Complete PostgreSQL DDL with `CREATE TABLE IF NOT EXISTS` + indexes
- Seed data with `ON CONFLICT DO NOTHING`
- Reference schema for DBA review / direct Postgres deployment

### 6. [main.py](file:///d:/d%20drive/Ignition_Hackathon/parity_squad/backend/main.py) (Modified)
- All endpoints now receive `db: Session = Depends(get_db)`
- Replaced all `DEMO_USERS[wallet]`, `loan_metadata[id]`, `notifications_store[id]` lookups with `crud.*` calls
- Tables auto-created on startup via `Base.metadata.create_all(bind=engine)`
- Version bumped to `3.0.0`
- Health endpoint now queries actual DB counts

## Verification Results

```
✅ 9 tables created (SQLite)
✅ 6 demo users seeded
✅ FastAPI app imports cleanly (31 routes)
✅ All relationships verified
```

## How to Use

### Local Development (SQLite — default)
```bash
# Seed the database
python -m backend.seed

# Start the server
uvicorn backend.main:app --reload
```

### PostgreSQL (production)
```bash
# Set DATABASE_URL in .env
DATABASE_URL=postgresql://user:pass@localhost:5432/lendpool

# Seed
python -m backend.seed

# Or apply schema.sql directly:
psql -d lendpool -f backend/schema.sql
```

## What's Preserved
- All existing Pydantic request models in `models.py` (unchanged)
- All Algorand transaction building in `transactions.py` (unchanged)
- On-chain indexer fallback in `GET /loans`
- Legacy `/verify` endpoint (backward compat)
- `demo_data.py` constants (`SCORE_DELTAS`, `TIER_LIMITS_INR`, `INR_PER_ALGO`, `generate_receipt_text`)
