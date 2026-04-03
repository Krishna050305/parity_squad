# parity_squad
1. Smit Bangar
2. Krishna Lagad
3. Sarvesh Joshi
4. Jui Deshmukh

# 🏦 Lendpool
### A Community-Driven, Trust-Based Peer-to-Peer Lending Platform on Algorand  

---

## 🚀 Overview

**Lendpool** is a decentralized peer-to-peer lending platform that transforms informal community lending into a **transparent, secure, and trust-driven digital system**.

It combines:

- 🔗 Blockchain transparency (Algorand)
- 🧑‍🤝‍🧑 Community-driven trust
- 📊 Behavior-based reputation
- 🪙 On-chain loan execution

👉 to solve the real-world problem of unstructured lending in small communities.

---

## ❗ Problem Statement

In informal lending systems (WhatsApp groups, friend circles, chit funds):

- ❌ No proper tracking of loans  
- ❌ No clarity on repayments  
- ❌ No accountability  
- ❌ High chances of disputes  

👉 Result: **Loss of trust + financial inefficiency**

---

## 💡 Solution

Lendpool introduces a **trust-first decentralized lending ecosystem** where:

- Loans are posted, funded, and repaid transparently  
- Trust is established using:
  - Verification tiers  
- Community vouching  
  - Guarantor system  
- All transactions are recorded on the **Algorand blockchain**

---

## 🧠 System Architecture

### 📊 Database Schema (ER Diagram)

```mermaid
erDiagram

USERS {
  uuid id PK
  string name
  string email
  string password_hash
  string wallet_address
  int trust_score
  string community_id
  timestamp created_at
}

LOANS {
  uuid id PK
  uuid borrower_id FK
  string title
  string reason
  int amount
  int amount_funded
  float interest_rate
  int duration_days
  string status
  timestamp created_at
  timestamp closed_at
}

CONTRIBUTIONS {
  uuid id PK
  uuid loan_id FK
  uuid lender_id FK
  int amount
  string tx_hash
  string algo_note
  timestamp created_at
}

REPAYMENTS {
  uuid id PK
  uuid loan_id FK
  uuid borrower_id FK
  int amount
  string tx_hash
  string algo_note
  string behaviour_tag
  timestamp created_at
}

TRUST_EVENTS {
  uuid id PK
  uuid user_id FK
  string event_type
  int delta
  int score_after
  uuid ref_loan_id FK
  timestamp created_at
}

ATTESTATIONS {
  uuid id PK
  uuid loan_id FK
  uuid actor_id FK
  string event_type
  string message
  string tx_hash
  timestamp created_at
}

FEED_EVENTS {
  uuid id PK
  uuid user_id FK
  uuid loan_id FK
  string type
  string content
  string tx_hash
  timestamp created_at
}

USERS ||--o{ LOANS : borrows
USERS ||--o{ CONTRIBUTIONS : lends
LOANS ||--o{ CONTRIBUTIONS : funded_by
LOANS ||--o{ REPAYMENTS : repaid_via
USERS ||--o{ TRUST_EVENTS : tracked
LOANS ||--o{ ATTESTATIONS : has
LOANS ||--o{ FEED_EVENTS : generates
```

---

### 🔗 Blockchain-Centric Design

- Lenders fund loans via wallet transactions  
- Funds are stored in a **smart contract escrow**  
- Borrower receives funds only after full funding  
- Repayments:
  - Sent to smart contract  
  - Distributed **pro-rata** to lenders  

---

## ⚙️ Core Flow

```
Lender → Funds Loan → Smart Contract (Escrow)
        ↓
Borrower receives funds
        ↓
Borrower repays
        ↓
Smart contract distributes repayment to lenders
```

---

## 🔍 Transparency Layer

All transactions are:

- Stored on-chain  
- Queryable via Algorand Indexer  
- Verifiable via blockchain explorer  

✅ No hidden actions  
✅ No manipulation  
✅ Full auditability  

---

## 🧑‍推 User Flow

### 🔄 System Flow Diagram

```mermaid
flowchart TD

A[New User Visits Platform] --> B[Register Account<br>Email + OTP + ID]
B --> C[Connect Algorand Wallet]
C --> D[Complete KYC Tier]
D --> E[Choose Trust Path]

E --> F[Vouch System]
E --> G[Guarantor System]
E --> H[Self Risk]

F --> F1[2 Users Co-sign]
F1 --> F2[On-chain Attestation]
F2 --> F3[Trust Established]

G --> G1[Select Guarantor]
G1 --> G2[Guarantor Accepts]
G2 --> G3[Trust Established]

H --> H1[Lower Limit & Higher Risk]

F3 --> I[Post Loan Request]
G3 --> I
H1 --> I

I --> J[Loan Listed Publicly]
J --> K[Lenders Fund Loan]
K --> L[Funds Locked in Smart Contract]
L --> M[Borrower Receives Funds]
M --> N[Borrower Repays]
N --> O[Smart Contract Distributes Funds]
```

---

## 🪪 Trust & Verification System

### 🔥 Multi-Tier Identity Model

| Tier | Verification       | Blockchain Mechanism | Loan Limit |
|------|------------------|---------------------|-----------|
| 0    | Wallet only       | Wallet identity     | Minimal   |
| 1    | Email OTP         | Basic identity      | Low       |
| 2    | Mobile OTP        | Linked identity     | Medium    |
| 3    | Govt ID (hashed)  | On-chain hash       | High      |
| 4    | Community Vouch   | Multisig approval   | Very High |

---

### 🔐 Key Innovation

- Identity linked to wallet  
- Govt ID stored as **SHA-256 hash** on-chain  
- Vouching uses **multisignature transactions**  

👉 Ensures:

- Privacy ✅  
- Authenticity ✅  
- Tamper-proof verification ✅  

---

## 🔗 Blockchain Features

- Smart contract escrow for loans  
- ASA badges for tiers  
- Multisig approvals for vouching  
- On-chain reputation tracking  
- Immutable transaction history  

---

## 🧠 Reputation System

Tracks:

- Borrower score  
- Lender behavior  
- Repayment consistency  

Stored as:

- On-chain state  
- Trust receipts  

👉 Creates a **transparent trust graph**

---

## 💥 Key Innovations

### ⭐ Trust-Based Lending
No collateral required — trust replaces assets  

### ⭐ Guarantor Model
Social accountability replaces legal enforcement  

### ⭐ On-Chain Reputation
Transparent + immutable trust score  

### ⭐ Multi-Path Trust Entry
Flexible onboarding system  

### ⭐ Automated Repayment Distribution
Smart contract handles all payouts  

### ⭐ No Intermediaries
Fully peer-to-peer  

---

## 🏆 What Lendpool Does Differently

| Feature            | Traditional Apps             | Lendpool                            |
|------------------|-----------------------------|--------------------------------------|
| Trust Model       | Credit score / documents     | Community + behavior + blockchain    |
| Transparency      | Limited                     | Fully on-chain                       |
| Intermediary      | Required                    | None                                 |
| Loan Distribution | Platform-controlled         | Smart contract escrow                |
| Repayment         | Manual                      | Automated pro-rata                   |
| Identity          | Centralized KYC             | Decentralized + hashed               |
| Enforcement       | Legal                       | Social + reputational                |

---

## 💡 Core Differentiator

> **Lendpool transforms informal trust into a verifiable, on-chain financial system.**

---

## ⚙️ Tech Stack

- Blockchain: Algorand  
- Smart Contracts: Algorand Python (algopy)  
- Backend: Python (FastAPI)  
- Frontend: React.js (Vite)  
- Wallet: Pera Wallet  

---

## 🛠️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [AlgoKit](https://github.com/algorandfoundation/algokit-cli)
- Python 3.12+
- Node.js v22+

### Setup

1. **Bootstrap the project:**
   ```bash
   algokit project bootstrap all
   ```

2. **Start LocalNet:**
   ```bash
   algokit localnet start
   ```

3. **Build and Deploy Smart Contracts:**
   ```bash
   algokit project run build
   # Note: Deployment is configured via smart_contracts/loan_contract/deploy_config.py
   python -m smart_contracts deploy
   ```

4. **Run Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📦 Future Enhancements

- AI-based risk prediction  
- Behavioral credit scoring  
- Cross-community lending  
- Mobile app  
- Decentralized identity (DID)  

---

## 📜 License

MIT License

---

## 🙌 Acknowledgment

Built to enable **trust-driven decentralized finance for real communities**

