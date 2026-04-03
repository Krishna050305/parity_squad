from algopy import ARC4Contract, UInt64, Account, Txn, Asset, op
from algopy.arc4 import abimethod

class TestContract(ARC4Contract):
    @abimethod
    def test(self, asset: Asset) -> None:
        balance, opted_in = op.AssetHoldingGet.asset_balance(Txn.sender, asset)
        assert opted_in, "Not opted in"
        assert balance > 0, "No balance"
