"""Generate a new Algorand TestNet deployer account and save to file."""
from algosdk import account, mnemonic

private_key, address = account.generate_account()
phrase = mnemonic.from_private_key(private_key)

# Write to a file so nothing gets truncated
with open("deployer_account.txt", "w") as f:
    f.write(f"ADDRESS={address}\n")
    f.write(f"MNEMONIC={phrase}\n")
    f.write(f"ADDRESS_LENGTH={len(address)}\n")

print("Account saved to deployer_account.txt")
