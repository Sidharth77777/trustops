
CREATE TABLE IF NOT EXISTS trustops_siwe_nonces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    address VARCHAR(255) NOT NULL,

    nonce VARCHAR(255) UNIQUE NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trustops_siwe_nonces_address
    ON trustops_siwe_nonces(address);

CREATE INDEX IF NOT EXISTS idx_trustops_siwe_nonces_expires_at
    ON trustops_siwe_nonces(expires_at);