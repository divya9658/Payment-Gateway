-- Create Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    api_key VARCHAR(64) NOT NULL UNIQUE,
    api_secret VARCHAR(64) NOT NULL,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(id) NOT NULL,
    amount INTEGER NOT NULL CHECK (amount >= 100),
    currency VARCHAR(3) DEFAULT 'INR',
    receipt VARCHAR(255),
    notes JSONB,
    status VARCHAR(20) DEFAULT 'created',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MANDATORY SEED: Create the test merchant required for evaluation
INSERT INTO merchants (id, name, email, api_key, api_secret)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000', 
    'Test Merchant', 
    'test@example.com', 
    'key_test_abc123', 
    'secret_test_xyz789'
) ON CONFLICT (email) DO NOTHING;