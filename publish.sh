#!/usr/bin/env bash

set -e

# Styling Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================================${NC}"
echo -e "${CYAN}      🚀 EMPLOYEE-AGENTS AUTOMATED RELEASE SCRIPT    ${NC}"
echo -e "${CYAN}=====================================================${NC}"

# Check for uncommitted git changes
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}Uncommitted changes detected. Staging and committing...${NC}"
  git add .
  read -p "Enter commit message [chore: prepare release]: " commit_msg
  commit_msg=${commit_msg:-"chore: prepare release"}
  git commit -m "$commit_msg"
fi

# Choose version bump type
echo ""
echo -e "Choose release version bump type:"
echo -e "  ${GREEN}1) patch${NC} (1.0.0 -> 1.0.1) [Bug fixes / minor adjustments]"
echo -e "  ${GREEN}2) minor${NC} (1.0.0 -> 1.1.0) [New features / capabilities]"
echo -e "  ${GREEN}3) major${NC} (1.0.0 -> 2.0.0) [Breaking architectural changes]"
echo -e "  ${GREEN}4) current${NC} (Publish current version without bumping)"
read -p "Select option [1-4] (default: 1): " choice
choice=${choice:-1}

case $choice in
  1)
    echo -e "${YELLOW}Bumping patch version...${NC}"
    npm version patch -m "chore(release): v%s"
    ;;
  2)
    echo -e "${YELLOW}Bumping minor version...${NC}"
    npm version minor -m "chore(release): v%s"
    ;;
  3)
    echo -e "${YELLOW}Bumping major version...${NC}"
    npm version major -m "chore(release): v%s"
    ;;
  4)
    echo -e "${YELLOW}Publishing current version...${NC}"
    ;;
  *)
    echo -e "${RED}Invalid selection. Aborted.${NC}"
    exit 1
    ;;
esac

# Recompile TypeScript
echo -e "${CYAN}Compiling TypeScript and setting executable binary permissions...${NC}"
npm run build
chmod +x dist/index.js

# Publish to npm registry
echo -e "${CYAN}Publishing package to npmjs.com (--access public)...${NC}"
npm publish --access public

# Push to GitHub with tags
echo -e "${CYAN}Pushing release commits and tags to GitHub...${NC}"
git push && git push --tags

echo ""
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}  🎉 SUCCESS! Package published to npm & GitHub!     ${NC}"
echo -e "${GREEN}  Test it anywhere: npx employee-agents              ${NC}"
echo -e "${GREEN}=====================================================${NC}"
