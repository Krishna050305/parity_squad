"""Seed the database with demo users.

Run this script after creating all tables to populate initial data.

Usage:
    python -m backend.seed
"""

import sys
import os

# Ensure the project root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, SessionLocal, Base
from backend.db_models import User, LoanReceipt  # noqa: F401 — import to register models
from backend import db_models  # noqa: F401 — ensure all models registered


def seed_users(db):
    """Insert demo users if they don't already exist."""
    demo_users = [
        {
            "wallet_address": "RAVI_KUMAR_DEMO_WALLET_ADDRESS_ALGORAND58",
            "name": "Ravi Kumar",
            "role": "both",
            "trust_score": 88,
            "risk_score": 12,
            "tier": 3,
            "is_voucher": True,
            "is_guarantor": True,
            "voucher_bio": "I vouch for responsible borrowers with a track record.",
            "loans_backed_count": 12,
            "email_verified": True,
            "phone_verified": True,
            "pan_hash": "sha256_pan_hash_ravi",
            "password_hash": "demo123",
        },
        {
            "wallet_address": "SNEHA_JOSHI_DEMO_WALLET_ADDRESS_ALGORAND58",
            "name": "Sneha Joshi",
            "role": "both",
            "trust_score": 92,
            "risk_score": 8,
            "tier": 3,
            "is_voucher": True,
            "is_guarantor": False,
            "voucher_bio": "Building community one loan at a time.",
            "loans_backed_count": 18,
            "email_verified": True,
            "phone_verified": True,
            "pan_hash": "sha256_pan_hash_sneha",
            "password_hash": "demo123",
        },
        {
            "wallet_address": "AMIT_PATEL_DEMO_WALLET_ADDRESS_ALGORAND58",
            "name": "Amit Patel",
            "role": "lender",
            "trust_score": 85,
            "risk_score": 15,
            "tier": 2,
            "is_voucher": True,
            "is_guarantor": False,
            "voucher_bio": "Here to help genuine borrowers get started.",
            "loans_backed_count": 9,
            "email_verified": True,
            "phone_verified": True,
            "pan_hash": "sha256_pan_hash_amit",
            "password_hash": "demo123",
        },
        {
            "wallet_address": "PRIYANKA_SINGH_DEMO_WALLET_ALGORAND58XXX",
            "name": "Priyanka Singh",
            "role": "lender",
            "trust_score": 79,
            "risk_score": 22,
            "tier": 2,
            "is_voucher": True,
            "is_guarantor": False,
            "voucher_bio": "Peer lending made trustworthy.",
            "loans_backed_count": 6,
            "email_verified": True,
            "phone_verified": False,
            "pan_hash": None,
            "password_hash": "demo123",
        },
        {
            "wallet_address": "VENKAT_RAO_DEMO_WALLET_ADDRESS_ALGORAND58X",
            "name": "Venkat Rao",
            "role": "both",
            "trust_score": 91,
            "risk_score": 9,
            "tier": 3,
            "is_voucher": True,
            "is_guarantor": True,
            "voucher_bio": "Strong community = strong economy.",
            "loans_backed_count": 15,
            "email_verified": True,
            "phone_verified": True,
            "pan_hash": "sha256_pan_hash_venkat",
            "password_hash": "demo123",
        },
        {
            "wallet_address": "MEERA_PILLAI_DEMO_WALLET_ADDRESS_ALGORAND58",
            "name": "Meera Pillai",
            "role": "lender",
            "trust_score": 83,
            "risk_score": 17,
            "tier": 2,
            "is_voucher": True,
            "is_guarantor": False,
            "voucher_bio": "Helping hands, verified wallets.",
            "loans_backed_count": 11,
            "email_verified": True,
            "phone_verified": True,
            "pan_hash": "sha256_pan_hash_meera",
            "password_hash": "demo123",
        },
    ]

    for user_data in demo_users:
        existing = db.query(User).filter(
            User.wallet_address == user_data["wallet_address"]
        ).first()

        if existing:
            print(f"  ⏭  {user_data['name']} already exists, skipping.")
            continue

        user = User(**user_data)
        db.add(user)
        print(f"  ✅ Seeded {user_data['name']} (tier={user_data['tier']}, trust={user_data['trust_score']})")

    db.commit()


def seed_receipts(db):
    """Seed demo loan receipts for Ravi Kumar."""
    ravi = db.query(User).filter(User.wallet_address == "RAVI_KUMAR_DEMO_WALLET_ADDRESS_ALGORAND58").first()
    if not ravi:
        return

    existing_receipts = db.query(LoanReceipt).filter(LoanReceipt.borrower_id == ravi.id).count()
    if existing_receipts > 0:
        print("  ⏭  Receipts already seeded, skipping.")
        return

    # These are standalone narrative receipts (no linked loan for demo)
    # In production, receipts would always be linked to a loan
    narratives = [
        "Ravi Kumar successfully guaranteed Priya's ₹15,000 loan (medical). Repaid in full, 8 days early. 2026.",
        "Ravi Kumar backed Arvind's ₹22,000 loan (education). 3 installments paid on time, 1 paid 2 days late. Closed 2025.",
        "Ravi Kumar co-vouched for Sunita's ₹9,500 agricultural loan. Repaid across 4 installments, all on time. Closed 2025.",
    ]
    print("  ℹ  Demo receipt narratives noted (requires linked loans in production).")


def main():
    print("\n🌱 LendPool Database Seed Script")
    print("=" * 50)

    # Create all tables
    print("\n📦 Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("  ✅ All tables created.")

    # Seed data
    db = SessionLocal()
    try:
        print("\n👤 Seeding demo users...")
        seed_users(db)

        print("\n📜 Seeding demo receipts...")
        seed_receipts(db)

        print("\n✅ Seed complete!")
        print(f"   Total users: {db.query(User).count()}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
