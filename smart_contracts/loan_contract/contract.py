import algopy
from algopy import ARC4Contract, GlobalState, LocalState, UInt64, Account, Global, Txn, gtxn, itxn
from algopy.arc4 import abimethod

class LoanContract(ARC4Contract):
    def __init__(self) -> None:
        self.borrower = GlobalState(Account)
        self.goal_amount = GlobalState(UInt64)
        self.funded_amount = GlobalState(UInt64)
        self.repaid_amount = GlobalState(UInt64)
        self.status = GlobalState(UInt64)
        self.deadline = GlobalState(UInt64)
        self.guarantor = GlobalState(Account)
        self.tier_required = GlobalState(UInt64)
        self.tier_badge_id = GlobalState(UInt64)

        self.contribution = LocalState(UInt64)
        self.claimed = LocalState(UInt64)

    @abimethod(allow_actions=["NoOp"], create="require")
    def create_loan(
        self,
        goal_amount: UInt64,
        duration_days: UInt64,
        tier_required: UInt64,
        badge_asa_id: UInt64,
    ) -> None:
        self.borrower.value = Txn.sender
        self.goal_amount.value = goal_amount
        self.funded_amount.value = UInt64(0)
        self.repaid_amount.value = UInt64(0)
        self.status.value = UInt64(1)  # 1=OPEN
        self.deadline.value = Global.latest_timestamp + (duration_days * 86400)
        self.guarantor.value = Global.zero_address
        self.tier_required.value = tier_required
        self.tier_badge_id.value = badge_asa_id

    @abimethod(allow_actions=["OptIn"])
    def opt_in_to_loan(self) -> None:
        self.contribution[Txn.sender] = UInt64(0)
        self.claimed[Txn.sender] = UInt64(0)

    @abimethod(allow_actions=["NoOp", "OptIn"])
    def fund_loan(self, payment: gtxn.PaymentTransaction) -> None:
        assert self.status.value == 1, "Loan is not OPEN"
        assert Global.latest_timestamp < self.deadline.value, "Funding deadline passed"
        assert payment.receiver == Global.current_application_address, "Payment must be sent to the smart contract"
        
        self.funded_amount.value += payment.amount
        
        current_contrib = self.contribution.get(Txn.sender, default=UInt64(0))
        self.contribution[Txn.sender] = current_contrib + payment.amount
        
        if self.funded_amount.value >= self.goal_amount.value:
            self._release_to_borrower()

    @algopy.subroutine
    def _release_to_borrower(self) -> None:
        itxn.Payment(
            receiver=self.borrower.value,
            amount=self.goal_amount.value,
            fee=0
        ).submit()
        self.status.value = UInt64(3)  # REPAYING

    @abimethod
    def repay_loan(self, payment: gtxn.PaymentTransaction) -> None:
        assert self.status.value == 3, "Loan is not REPAYING"
        assert Txn.sender == self.borrower.value, "Only borrower can repay"
        assert payment.receiver == Global.current_application_address, "Payment to contract"
        
        self.repaid_amount.value += payment.amount
        
        if self.repaid_amount.value >= self.goal_amount.value:
            self.status.value = UInt64(4)  # CLOSED

    @abimethod
    def claim_repayment(self) -> None:
        assert self.status.value == 4, "Loan is not CLOSED"
        
        contrib = self.contribution.get(Txn.sender, default=UInt64(0))
        claimed = self.claimed.get(Txn.sender, default=UInt64(0))
        
        assert contrib > 0, "No contribution found"
        assert claimed == 0, "Already claimed"
        
        share = (contrib * self.repaid_amount.value) // self.goal_amount.value
        
        itxn.Payment(
            receiver=Txn.sender,
            amount=share,
            fee=0
        ).submit()
        
        self.claimed[Txn.sender] = share

    @abimethod
    def add_guarantor(self, guarantor: Account) -> None:
        assert self.status.value == 1, "Loan must be OPEN"
        assert Txn.sender == self.borrower.value, "Only borrower can add guarantor"
        self.guarantor.value = guarantor

    @abimethod
    def mark_default(self) -> None:
        assert self.status.value == 3, "Loan must be REPAYING"
        assert Global.latest_timestamp > self.deadline.value, "Deadline not passed"
        self.status.value = UInt64(5)  # DEFAULTED

    @abimethod(readonly=True)
    def get_loan_info(self) -> tuple[UInt64, UInt64, UInt64, UInt64]:
        return (self.goal_amount.value, self.funded_amount.value, self.repaid_amount.value, self.status.value)
