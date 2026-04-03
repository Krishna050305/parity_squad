# LendPool P2P Platform: Technical Overview

LendPool is a peer-to-peer (P2P) lending platform built on the Algorand blockchain. This document provides a technical walkthrough of the architecture, smart contracts, and integration layers for the benefit of Algorand mentors.

---

## 🏗️ Architecture Overview

The project follows a modern dApp architecture:
- **Smart Contracts**: Written in **Algorand Python (Algopy)** using the ARC4 standard.
- **Backend**: A **FastAPI** service that serves as an indexer/aggregator, fetching real-time global state directly from the blockchain using `algokit-utils` v4.
- **Frontend**: A **React + Vite** dashboard providing a premium UI for interacting with the contract via `txnlab/use-wallet` and `algosdk`.

---

## 📜 Smart Contract (`smart_contracts/loan_contract/contract.py`)

The `LoanContract` serves as the escrow and source of truth for every loan.

### **Global State**
- `borrower`: Address of the person taking the loan.
- `goal_amount`: Total microALGOs requested.
- `funded_amount`: Current total microALGOs contributed by lenders.
- `status`: State machine value (1=OPEN, 2=FUNDED, 3=REPAYING, 4=CLOSED, 5=DEFAULTED).
- `deadline`: Unix timestamp for the funding/repayment period.

### **Core Methods (ARC4)**
- **`create_loan(...)`**: Initializes the state. Sets the borrower and terms.
- **`fund_loan(payment)`**: 
  - Validates that the payment transaction is directed to the contract address.
  - Updates the `funded_amount` and tracks the lender's contribution in **Local State**.
  - Automatically transitions the state to `REPAYING` once the goal is met.
- **`repay_loan(payment)`**: 
  - Accepts full repayment from the borrower.
  - Transitions the state to `CLOSED`.
- **`claim_repayment()`**: 
  - Implementation of a **Pull-based Claim** mechanism.
  - Calculates the lender's pro-rata share based on their local state contribution.
  - Uses an **Inner Transaction** to send the share back to the lender.

---

## ⚙️ Backend Logic (`backend/main.py`)

The backend bridges the gap between raw blockchain state and the frontend.

- **`get_loan_state(app_id)`**:
  - Uses `algokit_utils.AlgorandClient` (v4) to fetch the global state.
  - Correctly parses `AppState` objects and encodes the 32-byte address fields into human-readable Algorand addresses.
  - Handles CORS and error resilience.

---

## 🎨 Frontend Dashboard (`frontend/src/Home.tsx`)

The React application uses a custom integration approach to bypass client-generation blockers in the hackathon environment.

- **`fetchLoanData`**: Polling mechanism that syncs the UI with the Backend every 5 seconds.
- **`handleFund`**: 
  - Manually constructs an `AtomicTransactionComposer` (ATC).
  - Composes a `PaymentTransaction` (lender -> contract) and a `MethodCall` (fund_loan) in a single atomic group.
- **`handleClaim`**: 
  - Calls the `claim_repayment` method.
  - Requests a 2000 microALGO fee to cover the inner transaction cost (Fee Pooling).

---

## 🚀 Deployment & Config

- **`sdk_deploy.py`**: A low-level deployment script using `algokit-utils` to deploy the contract and capture the `APP_ID` without relying on the typed client generator.
- **`.env`**: Centralized configuration for `ALGOD_PORT`, `INDEXER_PORT`, and the active `APP_ID`.

---

## 🛠️ Discussion Points for Mentors
1. **Local State Efficiency**: We use Local State to track individual lender contributions, enabling decentralized claims.
2. **State Machine Safety**: The contract strictly enforces status transitions to prevent double-funding or early claims.
3. **Frontend Resilience**: Manual ATC composition was chosen to ensure cross-wallet compatibility and bypass builder environment limitations.
