import os
import sys

# add parent dir so we can import backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.badge_minting import mint_tier_badge
from dotenv import load_dotenv

def main():
    load_dotenv()
    print("Minting Tier 0-3 ASAs...")
    tier_ids = {}
    
    for tier in range(4):
        aid = mint_tier_badge(tier)
        tier_ids[f"TIER{tier}_BADGE_ID"] = aid
        print(f"Tier {tier} Badge ASA ID: {aid}")
        
    print("\nSaving to .env...")
    env_lines = []
    
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            env_lines = f.readlines()
            
    # filter out existing tier badge IDs
    env_lines = [line for line in env_lines if not line.startswith("TIER") and not line.startswith("BADGE")]
    
    # Ensure there's a trailing newline before appending
    if env_lines and not env_lines[-1].endswith("\n"):
        env_lines[-1] += "\n"
        
    for k, v in tier_ids.items():
        env_lines.append(f"{k}={v}\n")
        
    with open(env_path, "w") as f:
        f.writelines(env_lines)
        
    print("Pre-minting complete!")

if __name__ == "__main__":
    main()
