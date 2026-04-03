import os
import algokit_utils
from algosdk.transaction import AssetCreateTxn, AssetTransferTxn, wait_for_confirmation

def mint_tier_badge(tier: int, recipient_address: str = None) -> int:
    """Create ASA for specific tier. If recipient provided, also transfer 1 token."""
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")
    sp = algorand.client.algod.suggested_params()
    
    # Check if we already have it in environment
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    asset_id_str = os.getenv(f"TIER{tier}_BADGE_ID")
    asset_id = int(asset_id_str) if asset_id_str else None
    
    if not asset_id:
        # Create ASA
        txn = AssetCreateTxn(
            sender=deployer.address,
            sp=sp,
            total=1_000_000,
            decimals=0,
            default_frozen=False,
            asset_name=f"LendPool Tier {tier}",
            unit_name=f"LP-T{tier}",
            manager=deployer.address,
            reserve=deployer.address,
            freeze=None,
            clawback=None,
        )
        stxn = txn.sign(deployer.private_key)
        txid = algorand.client.algod.send_transaction(stxn)
        res = wait_for_confirmation(algorand.client.algod, txid, 4)
        asset_id = res["asset-index"]
    
    if recipient_address:
        # To transfer in Algorand, the receiver MUST opt-in to the asset first.
        # This script assumes opt-in has been performed by the recipient wallet.
        transfer_txn = AssetTransferTxn(
            sender=deployer.address,
            sp=sp,
            receiver=recipient_address,
            amt=1,
            index=asset_id
        )
        t_stxn = transfer_txn.sign(deployer.private_key)
        algorand.client.algod.send_transaction(t_stxn)
        
    return asset_id
