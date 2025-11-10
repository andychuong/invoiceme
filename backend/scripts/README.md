# Database Scripts

Scripts for managing the InvoiceMe database.

## Clear Database Script

### Local Development

See [README.md](./README.md) for local database clearing instructions.

### Railway (Production/Staging)

See [RAILWAY_CLEAR_DB.md](./RAILWAY_CLEAR_DB.md) for complete Railway instructions.

**Quick Start for Railway:**

```bash
cd backend/scripts
./clear-db-railway.sh
```

Or use Railway CLI directly:

```bash
# Connect to Railway database
railway connect postgres

# Then run SQL commands from clear-database.sql
```

---

## Clear Database Script (Local)

### Purpose
Clears all data from the database while preserving the schema (tables, columns, constraints, indexes).

### Usage

#### Option 1: Using the Shell Script (Recommended)

```bash
cd backend/scripts
./clear-db.sh
```

The script will:
- Prompt for confirmation
- Clear all data from all tables
- Preserve the database schema
- Show success/error messages

#### Option 2: Using psql Directly

```bash
psql -U andychuong -d invoiceme -f backend/scripts/clear-database.sql
```

Or with password prompt:
```bash
psql -h localhost -p 5432 -U andychuong -d invoiceme -f backend/scripts/clear-database.sql
```

#### Option 3: Using psql Interactive Mode

```bash
psql -U andychuong -d invoiceme
```

Then copy and paste the contents of `clear-database.sql`.

### What Gets Cleared

The script clears data from these tables (in order):
1. `payments`
2. `invoice_line_items`
3. `invoices`
4. `customers`
5. `company_memberships`
6. `users`
7. `companies`

### What Gets Preserved

- All tables
- All columns and data types
- All constraints (primary keys, foreign keys, unique constraints)
- All indexes
- All sequences
- Database schema structure

### Customizing Database Connection

Edit `clear-db.sh` and update these variables:
```bash
DB_NAME="invoiceme"
DB_USER="andychuong"
DB_HOST="localhost"
DB_PORT="5432"
```

Or set environment variables:
```bash
export PGDATABASE=invoiceme
export PGUSER=andychuong
export PGHOST=localhost
export PGPORT=5432
```

### Safety

- The script prompts for confirmation before running
- Uses `TRUNCATE` with `CASCADE` to safely clear related data
- Only affects data, never the schema
- Can be run multiple times safely

### Troubleshooting

**Error: "permission denied"**
- Make sure the script is executable: `chmod +x clear-db.sh`
- Check database user permissions

**Error: "database does not exist"**
- Verify database name in `clear-db.sh` or connection string
- Create database if needed: `createdb invoiceme`

**Error: "password authentication failed"**
- Check username and password
- Use `psql` with `-W` flag to prompt for password
- Or set `PGPASSWORD` environment variable

### Example Output

```
⚠️  WARNING: This will delete ALL data from the database!
The schema (tables, columns, constraints) will be preserved.

Are you sure you want to continue? (yes/no): yes

Clearing all data from database: invoiceme...
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
TRUNCATE TABLE
NOTICE:  All data cleared successfully. Schema preserved.

✅ Successfully cleared all data!
Schema is preserved and ready for new data.
```

