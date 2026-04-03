import algopy
from algopy import (
    ARC4Contract,
    Global,
    LocalState,
    Txn,
    UInt64,
    arc4,
    gtxn,
    itxn,
)

class LoanContract(ARC4Contract):
    def __init__(self) -> None:
        # Local State
        self.contribution = LocalState(UInt64)
        self.claimed = LocalState(UInt64)
        
        # Global State
        self.borrower = arc4.Address()
        self.goal_amount = UInt64(0)
        self.funded_amount = UInt64(0)
        self.repaid_amount = UInt64(0)
        self.status = UInt64(0) # 1=OPEN, 2=FUNDED, 3=REPAYING, 4=CLOSED, 5=DEFAULTED
        self.deadline = UInt64(0)
        self.guarantor = arc4.Address()
        self.tier_required = UInt64(0)
        self.tier_badge_id = UInt64(0)

    @arc4.abimethod(create="require")
    def create_loan(
        self,
        goal_amount: UInt64,
        duration_days: UInt64,
        tier_required: UInt64,
        badge_asa_id: UInt64,
    ) -> None:
        self.borrower = arc4.Address(Txn.sender)
        self.goal_amount = goal_amount
        self.funded_amount = UInt64(0)
        self.repaid_amount = UInt64(0)
        self.status = UInt64(1)  # OPEN
        self.deadline = Global.latest_timestamp + duration_days * UInt64(86400)
        self.tier_required = tier_required
        self.tier_badge_id = badge_asa_id
        # self.guarantor is already initialized to zero address

    @arc4.abimethod
    def fund_loan(self, payment: gtxn.PaymentTransaction) -> None:
        assert self.status == UInt64(1), "Loan is not OPEN"
        assert Global.latest_timestamp < self.deadline, "Loan deadline has passed"
        assert payment.receiver == Global.current_application_address, "Payment must be to the contract"

        self.funded_amount += payment.amount
        self.contribution[Txn.sender] = self.contribution.get(Txn.sender, UInt64(0)) + payment.amount

        if self.funded_amount >= self.goal_amount:
            self._release_to_borrower()

    def _release_to_borrower(self) -> None:
        itxn.Payment(
            receiver=self.borrower.native,
            amount=self.goal_amount,
            fee=0,
        ).submit()
        self.status = UInt64(3)  # REPAYING

    @arc4.abimethod
    def repay_loan(self, payment: gtxn.PaymentTransaction) -> None:
        assert self.status == UInt64(3), "Loan is not REPAYING"
        assert payment.sender == self.borrower.native, "Only borrower can repay"
        assert payment.receiver == Global.current_application_address, "Payment must be to the contract"

        self.repaid_amount += payment.amount
        if self.repaid_amount >= self.goal_amount:
            self.status = UInt64(4)  # CLOSED

    @arc4.abimethod
    def claim_repayment(self) -> None:
        assert self.status == UInt64(4), "Loan is not CLOSED"
        
        contribution = self.contribution.get(Txn.sender, UInt64(0))
        assert contribution > 0, "No contribution found"
        assert self.claimed.get(Txn.sender, UInt64(0)) == 0, "Already claimed"

        # Calculate pro-rata share: (contribution * repaid_amount) // goal_amount
        share = (contribution * self.repaid_amount) // self.goal_amount
        
        itxn.Payment(
            receiver=Txn.sender,
            amount=share,
            fee=0,
        ).submit()
        
        self.claimed[Txn.sender] = share

    @arc4.abimethod
    def add_guarantor(self, guarantor: arc4.Address) -> None:
        assert self.status == UInt64(1), "Loan is not OPEN"
        assert Txn.sender == self.borrower.native, "Only borrower can add guarantor"
        self.guarantor = guarantor

    @arc4.abimethod
    def mark_default(self) -> None:
        assert self.status == UInt64(3), "Loan is not REPAYING"
        assert Global.latest_timestamp > self.deadline, "Deadline has not passed"
        self.status = UInt64(5)  # DEFAULTED

    @arc4.abimethod(readonly=True)
    def get_loan_info(self) -> arc4.DynamicArray[arc4.UInt64]:
        # Returns (goal_amount, funded_amount, repaid_amount, status)
        res = arc4.DynamicArray[arc4.UInt64]()
        res.append(arc4.UInt64(self.goal_amount))
        res.append(arc4.UInt64(self.funded_amount))
        res.append(arc4.UInt64(self.repaid_amount))
        res.append(arc4.UInt64(self.status))
        return res
