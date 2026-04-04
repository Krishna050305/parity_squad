# LendPool Blockchain Architecture (Deep Technical Overview)

This document provides an in-depth technical overview of how the LendPool peer-to-peer lending platform utilizes the **Algorand Blockchain**, specifically focusing on the internal logic of the Python-based Smart Contracts (via PuyaPy / Algopy).

---

## 1. Why Algorand?

LendPool leverages Algorand for several critical reasons specifically tailored for a micro-finance, peer-to-peer trust-based lending ecosystem:
- **Low Transaction Fees (Fractions of a penny):** Extremely important so that small loans and micro-repayments aren't eaten up by gas fees.
- **Fast Finality (< 3.3 Seconds):** Ensures real-time responsiveness for users creating, funding, or verifying loans.
- **Atomic Transfers:** Algorand's built-in transaction grouping mechanism guarantees that either all parts of a transaction execute correctly, or none do.
- **Algorand Standard Assets (ASAs):** Used efficiently for Minting Tier/Trust Badges.

---

## 2. Smart Contract State Management

Every loan on LendPool is an independent smart contract instance (Application) acting as a secure escrow.

### Global State (The Loan's Truth)
The contract maintains 9 global variables that define the overarching state of the loan:
- `borrower` (Account): The wallet address receiving the funds.
- `goal_amount` (UInt64): Target loan amount in microAlgos.
- `funded_amount` (UInt64): Accumulator for funds received from lenders.
- `repaid_amount` (UInt64): Accumulator for funds paid back by the borrower.
- `status` (UInt64): State machine indicator (1=OPEN, 3=REPAYING, 4=CLOSED, 5=DEFAULTED).
- `deadline` (UInt64): The UNIX timestamp by which the loan must be funded (or repaid).
- `guarantor` (Account): A trusted third party who co-signs the loan.
- `tier_required` (UInt64): The minimum KYC trust tier required to interact.
- `tier_badge_id` (UInt64): The ASA ID of the required trust badge.

### Local State (The Lender's Ledger)
Lenders must "Opt-In" to the contract to allocate local memory on their own account.
- `contribution` (UInt64): How many microAlgos the specific lender has funded.
- `claimed` (UInt64): How many microAlgos the specific lender has successfully withdrawn after the loan is repaid, preventing double-spending.

---

## 3. Trust Tiers & Hardcoded Loan Limits

The smart contract computationally restricts borrowers based on their verified trust tier. The contract forces an `AssetHoldingGet` check to guarantee the borrower actually possesses the required KYC badge in their wallet before creation. 

The hardcoded limits in the contract are:
- **Tier 0:** Maximum `500` Algos. (Limit: `500_000_000` microAlgos)
- **Tier 1:** Maximum `2,000` Algos.
- **Tier 2:** Maximum `5,000` Algos.
- **Tier 3:** Maximum `20,000` Algos.

---

## 4. Transaction Lifecycle & Method Execution

The python `ARC4Contract` defines the exact lifecycle of the lending process:

### Phase 1: Creation (`create_loan`)
- Validates the requested `tier_required` and ensures `goal_amount` obeys the tier limit bounds.
- Validates that the sender theoretically holds the `badge_asset` in their wallet.
- Sets the `deadline` to `Current Timestamp + (duration_days * 86400)`.
- Status is set to **1 (OPEN)**.

### Phase 2: Funding (`opt_in_to_loan` and `fund_loan`)
- Lenders call `opt_in_to_loan` to initialize their `contribution` memory slot.
- `fund_loan` requires an atomic grouping with a `PaymentTransaction`. The contract enforces that the payment `receiver` is strictly the smart contract's escrow address.
- It adds the payment to the `funded_amount` and the sender's local `contribution`.
- **Auto-Release Trigger:** If `funded_amount >= goal_amount`, the contract fires an internal subroutine `_release_to_borrower()`.
  - **Internal Transaction (`itxn`):** The smart contract *itself* constructs a payment transaction sending the total accumulated funds to the `borrower`.
  - Status updates to **3 (REPAYING)**.

### Phase 3: Repayment (`repay_loan`)
- Only the `borrower` can execute this.
- Requires an atomic `PaymentTransaction` sent to the contract address.
- Increments `repaid_amount`. 
- If `repaid_amount >= goal_amount`, the loan is successfully settled, and Status updates to **4 (CLOSED)**.

### Phase 4: Claiming (`claim_repayment`)
- Triggered by Lenders only when Status is **4 (CLOSED)**.
- Validates that `contribution > 0` and `claimed == 0` (preventing reentrancy / double claiming).
- **Pro-Rata Math calculation:** `(Lender's Contribution * Total Repaid Amount) / Goal Amount`.
- Fires an `itxn.Payment` sending the mathematically guaranteed share to the lender directly.
- Marks `claimed` so the user cannot pull funds again.

### Phase 5: Risk Adjustments (`add_guarantor` & `mark_default`)
- The borrower can assign a `guarantor` address while the loan is OPEN to lower risk for lenders.
- Anyone can call `mark_default` if `status == 3 (REPAYING)` and the `deadline` timestamp has passed. This explicitly forces the status to **5 (DEFAULTED)** for the indexer and community scoring systems to detect.

---

## 5. Security Guarantees & Safeguards

- **No Centralized Control of Funds:** The LendPool platforms/servers do not hold the user's funds at any point.
- **Strict Method Safeguards:** Nearly every method begins with severe `assert` checks. For example, `fund_loan` will immediately crash and refund users if the deadline constraint has passed.
- **Double-Spend Protection:** Local State gracefully tracks withdrawal statuses to prevent lenders from draining excess funds out of the escrow account.

---

## 6. General Benefits of Blockchain Technology

Beyond the specific mechanics of Algorand, applying blockchain technology to the peer-to-peer lending space grants profound advantages over traditional web2 systems:

### 1. Decentralization & Trustlessness
Unlike traditional banks or fintech apps that require complete trust in a centralized entity to hold and distribute funds, blockchain allows lenders and borrowers to interact directly. The system operates entirely on code (smart contracts), removing human error, bias, or the risk of a central intermediary absconding with the capital.

### 2. Immutability
Once a loan is funded, a badge is minted, or a repayment is made, the record is permanently etched into the ledger. It cannot be altered, spoofed, or deleted by a malicious actor or a corrupted database.

### 3. Financial Inclusion
By relying on community trust, on-chain behavior, and simplified KYC/tiers rather than traditional FICO credit scores (which exclude billions of individuals globally), blockchain drastically lowers the barrier to entry for securing capital.

### 4. Borderless Capital
Blockchain networks are natively global. Borrowers are not restricted by local banking infrastructure, opening up liquidity from a global pool of lenders without the friction of international wire fees or complex currency conversion delays.

### 5. Automated Execution & Reduced Overhead
In the traditional financial system, clearing houses, loan officers, and debt processors ensure that contracts are followed. Blockchain automates this completely. The "code is law" premise ensures that repayment distribution happens instantly and computationally without the cost of human intermediaries.

### 6. Public Verifiability
Every transaction is part of a public node ledger. This means anyone can independently verify the solvency of a lending pool or the exact status of a loan. There are no "hidden" bad debts or fabricated financial reports.
