"""
One-off script to mint Tier 0-4 badges on LocalNet.

Usage:
    python scripts/mint_badges.py
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from algokit_utils import AlgorandClient
from backend.badge_minting import mint_tier_badge, update_env_with_badges


def main():
    print("=" * 60)
    print("LendPool — Minting Tier 0-4 Badges on LocalNet")
    print("=" * 60)

    # Connect to LocalNet
    client = AlgorandClient.default_localnet()
    algod = client.client.algod

    # Use the localnet dispenser as the badge creator/manager
    dispenser = client.account.localnet_dispenser()
    creator_address = dispenser.address
    creator_private_key = dispenser.private_key

    print(f"\nCreator address: {creator_address[:12]}...")
    print(f"Network: LocalNet (http://localhost:4001)\n")

    badge_ids = {}

    for tier in range(5):
        print(f"\n--- Minting Tier {tier} Badge ---")
        asa_id = mint_tier_badge(
            tier=tier,
            creator_address=creator_address,
            creator_signer=creator_private_key,
            algod_client=algod,
        )
        badge_ids[tier] = asa_id

    # Update .env with badge IDs
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    update_env_with_badges(badge_ids, env_path)

    # Print summary
    print("\n" + "=" * 60)
    print("Badge Minting Complete!")
    print("=" * 60)
    print("\nASA IDs:")
    for tier, asa_id in badge_ids.items():
        print(f"  TIER{tier}_BADGE_ID = {asa_id}")
    print(f"\nAll IDs saved to {env_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()
