-- ============================================================
-- LendPool PostgreSQL Schema
-- ============================================================
-- Compatible with PostgreSQL 14+
-- For SQLite, use the SQLAlchemy models (db_models.py) which
-- auto-create compatible tables.
-- ============================================================

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(58) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('borrower', 'lender', 'both')),
    mobile VARCHAR(15),
    email VARCHAR(255),

    -- KYC State
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    pan_hash VARCHAR(64),
    aadhaar_hash VARCHAR(64),
    tier INTEGER DEFAULT 0 CHECK (tier BETWEEN 0 AND 4),
    tier_badge_asa_id BIGINT,

    -- Score System
    trust_score DECIMAL(5,2) DEFAULT 50.0 CHECK (trust_score BETWEEN 0 AND 100),
    risk_score DECIMAL(5,2) DEFAULT 50.0 CHECK (risk_score BETWEEN 0 AND 100),

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    -- Community Role
    is_voucher BOOLEAN DEFAULT FALSE,
    is_guarantor BOOLEAN DEFAULT FALSE,
    voucher_bio TEXT,
    loans_backed_count INTEGER DEFAULT 0,

    -- Auth
    password_hash VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_trust_score ON users(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- ============================================================
-- LOANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id BIGINT UNIQUE,

    borrower_id UUID NOT NULL REFERENCES users(id),

    -- Loan Parameters
    purpose TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('agriculture', 'medical', 'education', 'housing', 'business', 'other')),
    goal_microalgos BIGINT NOT NULL,
    funded_microalgos BIGINT DEFAULT 0,
    repaid_microalgos BIGINT DEFAULT 0,
    tier_required INTEGER DEFAULT 0,

    -- Schedule
    tenure_months INTEGER,
    installment_frequency VARCHAR(20) CHECK (installment_frequency IN ('weekly', 'biweekly', 'monthly')),
    installment_count INTEGER,
    installment_amount_microalgos BIGINT,
    schedule_locked_at TIMESTAMP,

    -- Status: 1=OPEN, 2=FUNDED, 3=REPAYING, 4=CLOSED, 5=DEFAULTED
    status INTEGER DEFAULT 1,

    -- Dates
    created_at TIMESTAMP DEFAULT NOW(),
    funded_at TIMESTAMP,
    repayment_started_at TIMESTAMP,
    closed_at TIMESTAMP,
    deadline TIMESTAMP,
    duration_days INTEGER,

    -- Trust Path
    trust_path VARCHAR(20) CHECK (trust_path IN ('vouch', 'guarantor', 'solo')),

    -- On-Chain Receipt
    receipt_narrative TEXT,
    receipt_generated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loans_app_id ON loans(app_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower ON loans(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_category ON loans(category);

-- ============================================================
-- INSTALLMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,

    installment_no INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount_microalgos BIGINT NOT NULL,

    -- Status
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'paid', 'paid_late', 'overdue')),
    paid_at TIMESTAMP,
    days_late INTEGER DEFAULT 0,
    txn_id VARCHAR(52),

    -- Reminders
    reminder_7day_sent BOOLEAN DEFAULT FALSE,
    reminder_1day_sent BOOLEAN DEFAULT FALSE,

    UNIQUE(loan_id, installment_no)
);

CREATE INDEX IF NOT EXISTS idx_installments_loan ON installments(loan_id);
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON installments(due_date);
CREATE INDEX IF NOT EXISTS idx_installments_status ON installments(status);

-- ============================================================
-- LENDER_CONTRIBUTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS lender_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    lender_id UUID NOT NULL REFERENCES users(id),

    amount_microalgos BIGINT NOT NULL,
    contributed_at TIMESTAMP DEFAULT NOW(),
    txn_id VARCHAR(52),

    -- Repayment tracking
    claimed_amount_microalgos BIGINT DEFAULT 0,
    claimed_at TIMESTAMP,

    UNIQUE(loan_id, lender_id)
);

CREATE INDEX IF NOT EXISTS idx_contributions_loan ON lender_contributions(loan_id);
CREATE INDEX IF NOT EXISTS idx_contributions_lender ON lender_contributions(lender_id);

-- ============================================================
-- VOUCHES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS vouches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    borrower_id UUID NOT NULL REFERENCES users(id),
    voucher_id UUID NOT NULL REFERENCES users(id),

    payment_amount_inr INTEGER DEFAULT 500,
    payment_txn_id VARCHAR(52),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'voided')),

    created_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,

    UNIQUE(loan_id, voucher_id)
);

-- ============================================================
-- GUARANTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS guarantors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    borrower_id UUID NOT NULL REFERENCES users(id),
    guarantor_id UUID NOT NULL REFERENCES users(id),

    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'forfeited')),
    requested_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    on_chain_txn_id VARCHAR(52),

    -- Impact tracking
    borrower_outcome VARCHAR(20),
    trust_impact_applied BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_wallet VARCHAR(58) NOT NULL,
    sender_wallet VARCHAR(58),

    type VARCHAR(50) NOT NULL CHECK (type IN (
        'guarantor_request', 'guarantor_approved', 'guarantor_declined',
        'loan_funded', 'installment_due', 'installment_overdue',
        'loan_repaid', 'vouch_request', 'score_updated'
    )),

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Related entities
    loan_id UUID REFERENCES loans(id),
    related_user_id UUID REFERENCES users(id),

    -- State
    is_read BOOLEAN DEFAULT FALSE,
    requires_action BOOLEAN DEFAULT FALSE,
    action_taken VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_wallet);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_wallet, is_read) WHERE is_read = FALSE;

-- ============================================================
-- SCORE_EVENTS TABLE (Audit Trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS score_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    event_type VARCHAR(50) NOT NULL,
    trust_delta DECIMAL(5,2),
    risk_delta DECIMAL(5,2),
    trust_score_before DECIMAL(5,2),
    risk_score_before DECIMAL(5,2),
    trust_score_after DECIMAL(5,2),
    risk_score_after DECIMAL(5,2),

    related_loan_id UUID REFERENCES loans(id),
    applied_at TIMESTAMP DEFAULT NOW(),
    applied_by VARCHAR(50) DEFAULT 'system'
);

-- ============================================================
-- LOAN_RECEIPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS loan_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID UNIQUE NOT NULL REFERENCES loans(id),
    borrower_id UUID NOT NULL REFERENCES users(id),

    narrative TEXT NOT NULL,
    algo_txn_id VARCHAR(52),

    -- Structured fields
    amount_inr INTEGER,
    purpose_category VARCHAR(50),
    tenure_days INTEGER,
    on_time_count INTEGER,
    late_count INTEGER,
    total_lenders INTEGER,
    guarantor_name VARCHAR(255),
    voucher_names TEXT[],

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED DATA — Demo Users
-- ============================================================
INSERT INTO users (wallet_address, name, role, trust_score, risk_score, tier,
                   is_voucher, is_guarantor, voucher_bio, loans_backed_count,
                   email_verified, phone_verified, pan_hash, password_hash) VALUES
('RAVI_KUMAR_DEMO_WALLET_ADDRESS_ALGORAND58', 'Ravi Kumar', 'both', 88, 12, 3,
 TRUE, TRUE, 'I vouch for responsible borrowers with a track record.', 12,
 TRUE, TRUE, 'sha256_pan_hash_ravi', 'demo123'),

('SNEHA_JOSHI_DEMO_WALLET_ADDRESS_ALGORAND58', 'Sneha Joshi', 'both', 92, 8, 3,
 TRUE, FALSE, 'Building community one loan at a time.', 18,
 TRUE, TRUE, 'sha256_pan_hash_sneha', 'demo123'),

('AMIT_PATEL_DEMO_WALLET_ADDRESS_ALGORAND58', 'Amit Patel', 'lender', 85, 15, 2,
 TRUE, FALSE, 'Here to help genuine borrowers get started.', 9,
 TRUE, TRUE, 'sha256_pan_hash_amit', 'demo123'),

('PRIYANKA_SINGH_DEMO_WALLET_ALGORAND58XXX', 'Priyanka Singh', 'lender', 79, 22, 2,
 TRUE, FALSE, 'Peer lending made trustworthy.', 6,
 TRUE, FALSE, NULL, 'demo123'),

('VENKAT_RAO_DEMO_WALLET_ADDRESS_ALGORAND58X', 'Venkat Rao', 'both', 91, 9, 3,
 TRUE, TRUE, 'Strong community = strong economy.', 15,
 TRUE, TRUE, 'sha256_pan_hash_venkat', 'demo123'),

('MEERA_PILLAI_DEMO_WALLET_ADDRESS_ALGORAND58', 'Meera Pillai', 'lender', 83, 17, 2,
 TRUE, FALSE, 'Helping hands, verified wallets.', 11,
 TRUE, TRUE, 'sha256_pan_hash_meera', 'demo123')
ON CONFLICT (wallet_address) DO NOTHING;
