"""
LoanContract — P2P Lending Smart Contract for LendPool
=======================================================
Escrow-based lending contract on Algorand.
The contract is the escrow and the source of truth. No backend ever touches funds.

State machine: OPEN(1) -> FUNDED(2) -> REPAYING(3) -> CLOSED(4) or DEFAULTED(5)
"""

from algopy import (
    ARC4Contract,
    GlobalState,
    LocalState,
    Txn,
    UInt64,
    Global,
    gtxn,
    itxn,
    arc4,
)


# State machine: OPEN(1) -> FUNDED(2) -> REPAYING(3) -> CLOSED(4) or DEFAULTED(5)

class LoanInfo(arc4.Struct):
    goal_amount: arc4.UInt64
    funded_amount: arc4.UInt64
    repaid_amount: arc4.UInt64
    status: arc4.UInt64

class LoanContract(ARC4Contract):
    """A P2P lending escrow contract. Lenders fund the loan, borrower repays,
    lenders claim their pro-rata share via pull model."""

    def __init__(self) -> None:
        # ── Global State ──
        self.borrower = GlobalState(arc4.Address(), key="borrower")
        self.goal_amount = GlobalState(UInt64(0), key="goal_amount")
        self.funded_amount = GlobalState(UInt64(0), key="funded_amount")
        self.repaid_amount = GlobalState(UInt64(0), key="repaid_amount")
        self.status = GlobalState(UInt64(0), key="status")
        self.deadline = GlobalState(UInt64(0), key="deadline")
        self.guarantor = GlobalState(arc4.Address(), key="guarantor")
        self.tier_required = GlobalState(UInt64(0), key="tier_required")
        self.tier_badge_id = GlobalState(UInt64(0), key="tier_badge_id")

        # ── Local State (per lender wallet) ──
        self.contribution = LocalState(UInt64, key="contribution")
        self.claimed = LocalState(UInt64, key="claimed")

    # ═══════════════════════════════════════════════════════════════
    # 1. CREATE LOAN — called only at app creation
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod(create="require")
    def create_loan(
        self,
        goal_amount: arc4.UInt64,
        duration_days: arc4.UInt64,
        tier_required: arc4.UInt64,
        badge_asa_id: arc4.UInt64,
    ) -> None:
        """Initialize a new loan request. Only callable during app creation."""
        self.borrower.value = arc4.Address(Txn.sender)
        self.goal_amount.value = goal_amount.native
        self.funded_amount.value = UInt64(0)
        self.repaid_amount.value = UInt64(0)
        self.status.value = UInt64(1)
        self.deadline.value = Global.latest_timestamp + duration_days.native * UInt64(86400)
        self.guarantor.value = arc4.Address()  # empty until set
        self.tier_required.value = tier_required.native
        self.tier_badge_id.value = badge_asa_id.native

    # ═══════════════════════════════════════════════════════════════
    # 2. FUND LOAN — lender sends ALGO to the escrow
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod(allow_actions=["OptIn"])
    def fund_loan(self, payment: gtxn.PaymentTransaction) -> None:
        """Lender funds the loan. Payment must go to the app address.
        The lender opts in so local state is available."""
        assert self.status.value == UInt64(1), "Loan is not open for funding"
        assert Global.latest_timestamp < self.deadline.value, "Funding deadline has passed"
        assert payment.receiver == Global.current_application_address, "Payment must go to app"
        assert payment.amount > UInt64(0), "Must send a positive amount"

        # Track lender contribution in local state
        self.contribution[Txn.sender] = self.contribution.get(Txn.sender, default=UInt64(0)) + payment.amount
        self.funded_amount.value += payment.amount

        # Auto-release when goal is met
        if self.funded_amount.value >= self.goal_amount.value:
            self._release_to_borrower()

    # ═══════════════════════════════════════════════════════════════
    # 3. RELEASE TO BORROWER — private helper (inner txn)
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod(allow_actions=["NoOp"])
    def release_funds(self) -> None:
        """Manual release funds to borrower. Only callable when fully funded."""
        assert self.status.value == UInt64(1), "Loan is not in OPEN status"
        assert self.funded_amount.value >= self.goal_amount.value, "Loan not fully funded"
        self._release_to_borrower()

    def _release_to_borrower(self) -> None:
        """Send goal_amount to borrower via inner transaction and set status to REPAYING."""
        itxn.Payment(
            amount=self.goal_amount.value,
            receiver=self.borrower.value.native,
            fee=0,
        ).submit()
        self.status.value = UInt64(3)

    # ═══════════════════════════════════════════════════════════════
    # 4. REPAY LOAN — borrower sends ALGO back to escrow
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod()
    def repay_loan(self, payment: gtxn.PaymentTransaction) -> None:
        """Borrower repays the loan. Payment must go to the app address."""
        assert self.status.value == UInt64(3), "Loan is not in repayment phase"
        assert Txn.sender == self.borrower.value.native, "Only borrower can repay"
        assert payment.receiver == Global.current_application_address, "Payment must go to app"
        assert payment.amount > UInt64(0), "Must send a positive amount"

        self.repaid_amount.value += payment.amount

        if self.repaid_amount.value >= self.goal_amount.value:
            self.status.value = UInt64(4)

    # ═══════════════════════════════════════════════════════════════
    # 5. CLAIM REPAYMENT — pull model, no loops
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod()
    def claim_repayment(self) -> None:
        """Lender claims their pro-rata share of repaid funds.
        Pull model: each lender calls this individually."""
        assert self.status.value == UInt64(4), "Loan is not closed yet"

        lender_contribution = self.contribution[Txn.sender]
        already_claimed = self.claimed.get(Txn.sender, default=UInt64(0))
        assert already_claimed == UInt64(0), "Already claimed"
        assert lender_contribution > UInt64(0), "No contribution found"

        # Pro-rata share: (contribution * repaid_amount) // goal_amount
        share = (lender_contribution * self.repaid_amount.value) // self.goal_amount.value

        itxn.Payment(
            amount=share,
            receiver=Txn.sender,
            fee=0,
        ).submit()

        self.claimed[Txn.sender] = UInt64(1)

    # ═══════════════════════════════════════════════════════════════
    # 6. ADD GUARANTOR — borrower sets a guarantor
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod()
    def add_guarantor(self, guarantor: arc4.Address) -> None:
        """Borrower can add a guarantor while the loan is still open."""
        assert Txn.sender == self.borrower.value.native, "Only borrower can add guarantor"
        assert self.status.value == UInt64(1), "Can only add guarantor when loan is OPEN"
        self.guarantor.value = guarantor

    # ═══════════════════════════════════════════════════════════════
    # 7. MARK DEFAULT — anyone can call after deadline
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod()
    def mark_default(self) -> None:
        """Mark the loan as defaulted if repayment deadline has passed."""
        assert self.status.value == UInt64(3), "Loan must be in REPAYING status"
        assert Global.latest_timestamp > self.deadline.value, "Deadline has not passed yet"
        self.status.value = UInt64(5)

    # ═══════════════════════════════════════════════════════════════
    # 8. GET LOAN INFO — read-only view
    # ═══════════════════════════════════════════════════════════════
    @arc4.abimethod(readonly=True)
    def get_loan_info(self) -> LoanInfo:
        """Returns loan information."""
        return LoanInfo(
            goal_amount=arc4.UInt64(self.goal_amount.value),
            funded_amount=arc4.UInt64(self.funded_amount.value),
            repaid_amount=arc4.UInt64(self.repaid_amount.value),
            status=arc4.UInt64(self.status.value),
        )
