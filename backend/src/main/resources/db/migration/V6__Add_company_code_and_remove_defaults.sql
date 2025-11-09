-- Add company_code to companies table for sharing with employees
ALTER TABLE companies ADD COLUMN company_code UUID UNIQUE DEFAULT gen_random_uuid();

-- Create index on company_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_companies_company_code ON companies(company_code);

-- Remove the default admin user and company (if they exist)
-- Users will now sign up and create their own companies
DELETE FROM company_memberships WHERE user_id = '00000000-0000-0000-0000-000000000001';
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';
DELETE FROM companies WHERE id = '00000000-0000-0000-0000-000000000001';

