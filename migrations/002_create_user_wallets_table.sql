
CREATE TABLE IF NOT EXISTS trustops_user_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL 
        REFERENCES trustops_users(id)
        ON DELETE CASCADE,
    
    address VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_trustops_user_wallets_user_address
        UNIQUE(user_id, address)

);


CREATE INDEX IF NOT EXISTS idx_trustops_user_wallets_address 
    ON trustops_user_wallets(address);