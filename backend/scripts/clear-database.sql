-- Clear all data from all tables while preserving schema
-- Run this script to remove all data but keep the database structure
-- Usage: psql -U your_username -d invoiceme -f clear-database.sql

-- Clear data in order of dependencies (child tables first, then parent tables)
-- CASCADE ensures that all dependent data is also cleared

-- 1. Payments (references invoices)
TRUNCATE TABLE payments CASCADE;

-- 2. Invoice Line Items (references invoices)
TRUNCATE TABLE invoice_line_items CASCADE;

-- 3. Invoices (references customers and companies)
TRUNCATE TABLE invoices CASCADE;

-- 4. Customers (references companies)
TRUNCATE TABLE customers CASCADE;

-- 5. Company Memberships (references users and companies)
TRUNCATE TABLE company_memberships CASCADE;

-- 6. Users (no dependencies from other tables)
TRUNCATE TABLE users CASCADE;

-- 7. Companies (no dependencies from other tables)
TRUNCATE TABLE companies CASCADE;

-- Verify tables are empty (optional - uncomment to check)
-- SELECT 'payments' as table_name, COUNT(*) as row_count FROM payments
-- UNION ALL
-- SELECT 'invoice_line_items', COUNT(*) FROM invoice_line_items
-- UNION ALL
-- SELECT 'invoices', COUNT(*) FROM invoices
-- UNION ALL
-- SELECT 'customers', COUNT(*) FROM customers
-- UNION ALL
-- SELECT 'company_memberships', COUNT(*) FROM company_memberships
-- UNION ALL
-- SELECT 'users', COUNT(*) FROM users
-- UNION ALL
-- SELECT 'companies', COUNT(*) FROM companies;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'All data cleared successfully. Schema preserved.';
END $$;

