#!/bin/bash

# Script to clear all data from the database while preserving the schema
# This will remove all data but keep the database structure intact

# Database configuration (matches application-local.properties)
DB_NAME="invoiceme"
DB_USER="andychuong"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  WARNING: This will delete ALL data from the database!${NC}"
echo -e "${YELLOW}The schema (tables, columns, constraints) will be preserved.${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Clearing all data from database: ${DB_NAME}...${NC}"

# Run the SQL script
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/clear-database.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Successfully cleared all data!${NC}"
    echo -e "${GREEN}Schema is preserved and ready for new data.${NC}"
else
    echo ""
    echo -e "${RED}❌ Error clearing database. Please check the error messages above.${NC}"
    exit 1
fi

