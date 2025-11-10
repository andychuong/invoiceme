#!/bin/bash

# Script to clear all data from Railway PostgreSQL database
# This script uses Railway CLI to connect and run the SQL script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Railway Database Clear Script                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed.${NC}"
    echo -e "${YELLOW}Install it with: npm i -g @railway/cli${NC}"
    echo -e "${YELLOW}Or: brew install railway${NC}"
    exit 1
fi

# Check if we're in a Railway project
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not linked to a Railway project.${NC}"
    echo -e "${YELLOW}Linking to Railway project...${NC}"
    railway link
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to link to Railway project.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}⚠️  WARNING: This will delete ALL data from the Railway database!${NC}"
echo -e "${YELLOW}The schema (tables, columns, constraints) will be preserved.${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Getting database connection details from Railway...${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SQL_SCRIPT="$SCRIPT_DIR/clear-database.sql"

# Check if SQL script exists
if [ ! -f "$SQL_SCRIPT" ]; then
    echo -e "${RED}❌ SQL script not found: $SQL_SCRIPT${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Connecting to Railway database and clearing data...${NC}"
echo ""

# Method 1: Try using railway connect postgres
# This opens an interactive session, so we'll use railway run instead

# Method 2: Use railway run with psql
railway run psql $DATABASE_URL -f "$SQL_SCRIPT"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ Successfully cleared all data from Railway!      ║${NC}"
    echo -e "${GREEN}║  Schema is preserved and ready for new data.         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ Error clearing database.                          ║${NC}"
    echo -e "${RED}║  Please check the error messages above.               ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Alternative methods:${NC}"
    echo -e "${YELLOW}1. Use Railway web console: railway connect postgres${NC}"
    echo -e "${YELLOW}2. See RAILWAY_CLEAR_DB.md for more options${NC}"
    exit 1
fi

