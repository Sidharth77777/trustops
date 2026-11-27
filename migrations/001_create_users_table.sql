
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS trustops_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE,
    name VARCHAR(50),
    password_hash TEXT,

    image TEXT,
    google_id VARCHAR(255) UNIQUE,

    role VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK(role in ('USER', 'ADMIN')),

    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verification_token_hash TEXT UNIQUE,

    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret TEXT,

    token_version INTEGER NOT NULL DEFAULT 0,

    reset_token_hash TEXT UNIQUE,
    reset_password_expires TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS idx_trustops_users_reset_password_expires 
    ON trustops_users(reset_password_expires);
