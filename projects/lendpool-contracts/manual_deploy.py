import algokit_utils
from pathlib import Path
import json

# Setup
PROJECT_ROOT = Path(__file__).parent
ARTIFACT_PATH = PROJECT_ROOT / "smart_contracts" / "artifacts" / "loan_contract" / "LoanContract.arc56.json"

def main():
    # Initialize Client (LocalNet)
    algorand = algokit_utils.AlgorandClient.default_localnet()
    
    # Use LocalNet dispenser for deployment
    deployer = algorand.account.localnet_dispenser()
    print(f"Deploying from: {deployer.address}")
    
    # Get app factory by passing the PATH directly
    # In algokit-utils v4, the AppFactory can handle a Path object
    factory = algorand.client.get_app_factory(
        app_spec=ARTIFACT_PATH,
        default_sender=deployer.address
    )
    
    # Deploy
    print(f"Loading ARC56 from {ARTIFACT_PATH}...")
    print("Deploying...")
    
    try:
        # Use simple deployment params
        result = factory.deploy(
            on_update=algokit_utils.OnUpdate.AppendApp,
            on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
            create_params={
                "args": [1_000_000, 30, 0, 0] # goal_amount, duration_days, tier_required, badge_asa_id
            }
        )
        
        app_client = result.app_client
        
        print("\n" + "="*40)
        print(f"DEPLOYMENT SUCCESSFUL")
        print(f"App Name: {app_client.app_name}")
        print(f"App ID: {app_client.app_id}")
        print(f"App Address: {app_client.app_address}")
        print("="*40)
        
    except Exception as e:
        print(f"Deployment failed: {e}")

if __name__ == "__main__":
    main()
