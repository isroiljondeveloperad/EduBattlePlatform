-- Premium subscription tables
CREATE TABLE IF NOT EXISTS subscription_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_proof TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add premium status to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscription_requests_user_id ON subscription_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_status ON subscription_requests(status);
CREATE INDEX IF NOT EXISTS idx_users_premium ON users(is_premium);

-- Function to check if user premium is expired
CREATE OR REPLACE FUNCTION check_premium_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.premium_expires_at IS NOT NULL AND NEW.premium_expires_at < NOW() THEN
    NEW.is_premium = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically expire premium
DROP TRIGGER IF EXISTS trigger_check_premium_expiry ON users;
CREATE TRIGGER trigger_check_premium_expiry
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_premium_expiry();
