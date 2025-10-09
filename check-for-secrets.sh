#!/bin/bash

# Security Check Script - Scans for exposed secrets
# Run this before every commit to ensure no secrets are exposed

echo "🔍 Scanning for potential secrets in the repository..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FOUND_ISSUES=0

# Check for Supabase service keys
echo "Checking for Supabase service keys..."
if git grep -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSI" -- ':(exclude)SECURITY_INCIDENT_REMEDIATION.md' ':(exclude)check-for-secrets.sh' 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: Found Supabase service key in tracked files!${NC}"
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
    echo -e "${GREEN}✅ No service keys found${NC}"
fi

# Check for hardcoded keys in config files
echo ""
echo "Checking configuration files for hardcoded secrets..."
for file in *.toml *.json *.js *.ts; do
    if [ -f "$file" ]; then
        if grep -q "SERVICE.*ROLE.*KEY.*=.*\"eyJ" "$file" 2>/dev/null; then
            echo -e "${RED}❌ Found potential hardcoded key in: $file${NC}"
            FOUND_ISSUES=$((FOUND_ISSUES + 1))
        fi
    fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No hardcoded secrets found in config files${NC}"
fi

# Check for .env files that might be accidentally committed
echo ""
echo "Checking for accidentally committed .env files..."
if git ls-files | grep -E "^\.env($|\.)" 2>/dev/null; then
    echo -e "${RED}❌ CRITICAL: .env file is tracked in git!${NC}"
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
    echo -e "${GREEN}✅ No .env files in git${NC}"
fi

# Summary
echo ""
echo "================================"
if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Security check passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $FOUND_ISSUES security issue(s)!${NC}"
    echo -e "${YELLOW}Please fix these issues before committing.${NC}"
    exit 1
fi

