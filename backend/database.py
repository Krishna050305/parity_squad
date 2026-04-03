"""Database engine, session factory, and Base for LendPool.

Supports both PostgreSQL (production) and SQLite (local dev) via
the DATABASE_URL environment variable.

Usage:
    from .database import get_db, engine, Base

    # In FastAPI endpoint:
    @app.get("/example")
    def example(db: Session = Depends(get_db)):
        ...

    # Create all tables (called at startup):
    Base.metadata.create_all(bind=engine)
"""

import os
from dotenv import load_dotenv

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# ── Database URL ────────────────────────────────────────────────
# PostgreSQL: postgresql://user:pass@localhost:5432/lendpool
# SQLite:     sqlite:///./lendpool.db  (default for local dev)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./lendpool.db",
)

# ── Engine Configuration ────────────────────────────────────────
_is_sqlite = DATABASE_URL.startswith("sqlite")

engine_kwargs = {}
if _is_sqlite:
    # SQLite needs check_same_thread=False for FastAPI's async workers
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL connection pool settings
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_pre_ping"] = True

engine = create_engine(DATABASE_URL, echo=False, **engine_kwargs)

# Enable WAL mode and foreign keys for SQLite
if _is_sqlite:
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()

# ── Session Factory ─────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Declarative Base ────────────────────────────────────────────
Base = declarative_base()


# ── Dependency for FastAPI ──────────────────────────────────────
def get_db():
    """Yield a database session, closing it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
