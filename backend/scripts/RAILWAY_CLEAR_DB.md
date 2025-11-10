# Clearing Database on Railway

Guide for clearing all data from the Railway PostgreSQL database while preserving the schema.

## Prerequisites

- Railway CLI installed (`railway --version`)
- Logged into Railway (`railway login`)
- Project linked to Railway (`railway link`)

## Method 1: Using Railway CLI (Recommended)

### Step 1: Get Database Connection String

```bash
# Navigate to your project
cd backend

# Link to Railway project (if not already linked)
railway link

# Get the PostgreSQL connection string
railway variables
```

Look for these environment variables:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

Or get the full connection string:
```bash
railway variables | grep POSTGRES
```

### Step 2: Connect to Railway Database

**Option A: Using Railway CLI Connect**

```bash
# Connect to the database service
railway connect postgres
```

This will open a PostgreSQL shell. Then run:

```sql
-- Copy and paste the contents of clear-database.sql
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoice_line_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE company_memberships CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE companies CASCADE;
```

**Option B: Using Railway CLI with psql**

```bash
# Get connection string and run script
railway run psql $DATABASE_URL -f scripts/clear-database.sql
```

Or if Railway provides separate variables:

```bash
railway run psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f scripts/clear-database.sql
```

### Step 3: Run the Script Directly

```bash
# From the backend directory
cd backend

# Run the SQL script using Railway CLI
railway run psql $DATABASE_URL < scripts/clear-database.sql
```

---

## Method 2: Using Railway Web Console

### Step 1: Get Database Connection Details

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Click on your PostgreSQL service
4. Go to the **Variables** tab
5. Note down:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### Step 2: Connect Using psql Locally

```bash
# Install PostgreSQL client if needed
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Connect to Railway database
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE

# Enter password when prompted (from Railway variables)
```

### Step 3: Run the Script

Once connected, run:

```sql
\i scripts/clear-database.sql
```

Or copy and paste the SQL commands directly.

---

## Method 3: Using Railway One-Off Command

### Create a One-Off Service

1. In Railway dashboard, create a new service
2. Select "Empty Service"
3. Add the PostgreSQL service as a dependency
4. Set the command to:

```bash
psql $DATABASE_URL -f /app/scripts/clear-database.sql
```

Or use a custom script:

```bash
# Create railway-clear-db.sh
#!/bin/bash
echo "⚠️  WARNING: This will delete ALL data!"
read -p "Type 'yes' to continue: " confirm
if [ "$confirm" = "yes" ]; then
  psql $DATABASE_URL -f /app/scripts/clear-database.sql
  echo "✅ Database cleared successfully!"
else
  echo "❌ Operation cancelled."
fi
```

---

## Method 4: Using Railway CLI with Environment Variables

### Step 1: Export Railway Variables

```bash
# Get variables from Railway
railway variables > railway-vars.txt

# Source them (be careful with passwords)
export $(railway variables | grep -E '^(PGHOST|PGPORT|PGDATABASE|PGUSER|PGPASSWORD)=' | xargs)
```

### Step 2: Run Script Locally

```bash
# Make sure you have the connection details
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f backend/scripts/clear-database.sql
```

---

## Method 5: Using Railway CLI Shell

### Interactive Method

```bash
# Connect to Railway shell
railway shell

# Once in the shell, connect to PostgreSQL
psql $DATABASE_URL

# Then run the SQL commands
\i scripts/clear-database.sql
```

---

## Quickest Method: One-Line Command

If you just want to clear the database quickly:

```bash
# From backend directory
cd backend

# Run this command (it will prompt for confirmation)
railway run psql $DATABASE_URL <<EOF
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoice_line_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE company_memberships CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE companies CASCADE;
EOF
```

Or use the script:

```bash
cd backend/scripts
./clear-db-railway.sh
```

---

## Quick Reference: Railway CLI Commands

```bash
# Login to Railway
railway login

# Link to project
railway link

# View all variables
railway variables

# Connect to PostgreSQL service
railway connect postgres

# Run a command in Railway environment
railway run <command>

# Open Railway shell
railway shell
```

---

## Safety Checklist

Before running the clear script on Railway:

- [ ] **Backup your data** (if needed)
- [ ] **Verify you're on the correct environment** (not production if you have multiple)
- [ ] **Confirm the database name** matches your expectations
- [ ] **Test on a staging environment first** (if available)
- [ ] **Have a rollback plan** (database backup)

---

## Verification

After clearing, verify the database is empty:

```sql
-- Connect to database
railway connect postgres

-- Check row counts
SELECT 'payments' as table_name, COUNT(*) as row_count FROM payments
UNION ALL
SELECT 'invoice_line_items', COUNT(*) FROM invoice_line_items
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'company_memberships', COUNT(*) FROM company_memberships
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'companies', COUNT(*) FROM companies;
```

All counts should be 0.

---

## Troubleshooting

### Error: "railway: command not found"
```bash
# Install Railway CLI
npm i -g @railway/cli
# or
brew install railway
```

### Error: "database does not exist"
- Check `PGDATABASE` variable in Railway
- Verify you're connected to the correct project

### Error: "password authentication failed"
- Check `PGUSER` and `PGPASSWORD` in Railway variables
- Ensure you have the correct credentials

### Error: "connection refused"
- Check `PGHOST` and `PGPORT` variables
- Verify the PostgreSQL service is running in Railway

### Error: "permission denied"
- Ensure your Railway user has access to the database
- Check database user permissions

---

## Alternative: Railway Web SQL Editor

Some Railway plans include a web SQL editor:

1. Go to Railway Dashboard
2. Select your PostgreSQL service
3. Look for "Query" or "SQL Editor" tab
4. Paste the SQL commands from `clear-database.sql`
5. Execute

---

## Recommended Approach

**For Production/Staging:**
1. Use Method 1 (Railway CLI) for safety
2. Always verify connection details first
3. Test on staging before production
4. Keep backups

**For Development:**
1. Use Method 2 (Web Console) for simplicity
2. Or Method 1 for consistency

---

## Example: Complete Workflow

```bash
# 1. Navigate to backend
cd backend

# 2. Link to Railway (if needed)
railway link

# 3. Verify connection
railway variables | grep PG

# 4. Connect and run script
railway connect postgres
# Then paste SQL commands or:
\i scripts/clear-database.sql

# 5. Verify
SELECT COUNT(*) FROM users;  -- Should return 0
SELECT COUNT(*) FROM companies;  -- Should return 0
```

---

**⚠️ WARNING**: This will permanently delete all data. The schema will be preserved, but all records will be lost. Make sure you have backups if needed!

