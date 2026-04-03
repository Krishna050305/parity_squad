"""
ASA Tier Badge Minting for LendPool.

Trust/KYC tier system:
  Tier 0: wallet connected → 500 ALGO limit
  Tier 1: email OTP verified → 2,000 ALGO limit
  Tier 2: mobile OTP verified → 5,000 ALGO limit
  Tier 3: Aadhaar/PAN hash on-chain → 20,000 ALGO limit
  Tier 4: 2+ community vouch (multisig) → 50,000 ALGO limit
"""

import os
import dotenv
from algosdk.transaction import AssetCreateTxn, AssetTransferTxn, wait_for_confirmation
from algokit_utils import AlgorandClient

dotenv.load_dotenv()

# Borrow limits per tier (in microALGO)
TIER_LIMITS = {
    0: 500_000_000,      # 500 ALGO
    1: 2_000_000_000,    # 2,000 ALGO
    2: 5_000_000_000,    # 5,000 ALGO
    3: 20_000_000_000,   # 20,000 ALGO
    4: 50_000_000_000,   # 50,000 ALGO
}

TIER_DESCRIPTIONS = {
    0: "Wallet Connected",
    1: "Email OTP Verified",
    2: "Mobile OTP Verified",
    3: "Gov ID (Aadhaar/PAN) Verified",
    4: "Community Vouched (Multisig)",
}


def mint_tier_badge(tier: int, creator_address: str, creator_signer, algod_client) -> int:
    """
    Mint a new ASA tier badge on Algorand.

    Args:
        tier: Tier level (0-4)
        creator_address: Address of the badge creator/manager
        creator_signer: Transaction signer for the creator
        algod_client: Algod client instance

    Returns:
        The ASA ID of the newly created badge
    """
    assert 0 <= tier <= 4, f"Invalid tier: {tier}. Must be 0-4."

    sp = algod_client.suggested_params()

    txn = AssetCreateTxn(
        sender=creator_address,
        sp=sp,
        total=1_000_000,
        decimals=0,
        default_frozen=False,
        asset_name=f"LendPool Tier {tier}",
        unit_name=f"LP-T{tier}",
        manager=creator_address,
        reserve=None,
        freeze=None,       # No freeze authority
        clawback=None,      # No clawback authority
        url=f"https://lendpool.io/tier/{tier}",
        note=f"LendPool KYC Tier {tier} Badge - {TIER_DESCRIPTIONS[tier]}".encode(),
    )

    signed_txn = txn.sign(creator_signer)
    tx_id = algod_client.send_transaction(signed_txn)
    result = wait_for_confirmation(algod_client, tx_id, 4)
    asa_id = result["asset-index"]

    print(f"  Tier {tier} badge minted: ASA ID = {asa_id}")
    print(f"    Name: LendPool Tier {tier} | Unit: LP-T{tier}")
    print(f"    Description: {TIER_DESCRIPTIONS[tier]}")
    print(f"    Borrow limit: {TIER_LIMITS[tier] // 1_000_000} ALGO")

    return asa_id


def opt_in_to_badge(asa_id: int, account_address: str, account_signer, algod_client) -> None:
    """
    Opt-in an account to receive a tier badge ASA.
    """
    sp = algod_client.suggested_params()

    txn = AssetTransferTxn(
        sender=account_address,
        sp=sp,
        receiver=account_address,
        amt=0,
        index=asa_id,
    )

    signed_txn = txn.sign(account_signer)
    tx_id = algod_client.send_transaction(signed_txn)
    wait_for_confirmation(algod_client, tx_id, 4)
    print(f"  Account {account_address[:8]}... opted in to ASA {asa_id}")


def send_badge(asa_id: int, sender_address: str, sender_signer, recipient_address: str, algod_client) -> None:
    """
    Send a tier badge (1 unit) to a recipient.
    """
    sp = algod_client.suggested_params()

    txn = AssetTransferTxn(
        sender=sender_address,
        sp=sp,
        receiver=recipient_address,
        amt=1,
        index=asa_id,
    )

    signed_txn = txn.sign(sender_signer)
    tx_id = algod_client.send_transaction(signed_txn)
    wait_for_confirmation(algod_client, tx_id, 4)
    print(f"  Sent 1 badge (ASA {asa_id}) to {recipient_address[:8]}...")


def update_env_with_badges(badge_ids: dict[int, int], env_path: str = ".env") -> None:
    """
    Update the .env file with tier badge ASA IDs.

    Args:
        badge_ids: dict mapping tier number to ASA ID
        env_path: path to .env file
    """
    # Read existing .env content
    existing_lines = []
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            existing_lines = f.readlines()

    # Remove any existing TIER*_BADGE_ID lines
    filtered = [line for line in existing_lines if not line.startswith("TIER") or "BADGE_ID" not in line]

    # Ensure trailing newline
    if filtered and not filtered[-1].endswith("\n"):
        filtered[-1] += "\n"

    # Add badge IDs
    for tier in sorted(badge_ids.keys()):
        filtered.append(f"TIER{tier}_BADGE_ID={badge_ids[tier]}\n")

    with open(env_path, "w") as f:
        f.writelines(filtered)

    print(f"\n  Updated {env_path} with badge ASA IDs")
