import os
import dotenv
from pathlib import Path
from algokit_utils import AlgorandClient
from algokit_utils.applications.app_factory import (
    AppFactory, 
    AppFactoryParams,
    AppFactoryCreateMethodCallParams
)

# Load environment
dotenv.load_dotenv()

# Setup client for LocalNet
client = AlgorandClient.default_localnet()

# Setup deployer
deployer = client.account.localnet_dispenser()

# Path to the arc56.json file
app_spec_path = (
    Path(__file__).parent / "loan_contract" / "LoanContract.arc56.json"
)

# Use AppFactory
factory = AppFactory(
    AppFactoryParams(
        algorand=client,
        app_spec=app_spec_path.read_text(),
        default_sender=deployer.address,
    )
)

# Deploy specifying the create_loan method and arguments
# goal_amount=1000000 (1 ALGO), duration_days=30, tier_required=1, badge_asa_id=0
app_client, result = factory.deploy(
    on_schema_break="replace",
    on_update="update",
    create_params=AppFactoryCreateMethodCallParams(
        method="create_loan",
        args=[1_000_000, 30, 1, 0]
    )
)

print(f"APP_ID={app_client.app_id}")
print(f"LoanContract deployed with App ID: {app_client.app_id}")
