#!/bin/bash

# Smoke test script for InvoiceMe deployment
# Usage: ./scripts/smoke-test.sh [backend-url] [frontend-url]

set -e

BACKEND_URL="${1:-http://localhost:8080}"
FRONTEND_URL="${2:-http://localhost:3000}"

echo "🚀 Starting smoke tests..."
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test backend health
echo -e "${YELLOW}Testing Backend Health...${NC}"
if curl -f -s "$BACKEND_URL/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    exit 1
fi

# Test backend info endpoint
echo -e "${YELLOW}Testing Backend Info...${NC}"
if curl -f -s "$BACKEND_URL/actuator/info" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend info endpoint accessible${NC}"
else
    echo -e "${YELLOW}⚠ Backend info endpoint not available (optional)${NC}"
fi

# Test frontend
echo -e "${YELLOW}Testing Frontend...${NC}"
if curl -f -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}✗ Frontend is not accessible${NC}"
    exit 1
fi

# Test API endpoint (if available)
echo -e "${YELLOW}Testing API Endpoint...${NC}"
if curl -f -s "$BACKEND_URL/api" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API endpoint is accessible${NC}"
else
    echo -e "${YELLOW}⚠ API endpoint test skipped (may require authentication)${NC}"
fi

echo ""
echo -e "${GREEN}✅ All smoke tests passed!${NC}"

