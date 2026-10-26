#!/usr/bin/env bash

set -e

# Styling Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================================${NC}"
echo -e "${CYAN}      🚀 EMPLOYEE-AGENTS RELEASE & TEST SCRIPT       ${NC}"
echo -e "${CYAN}=====================================================${NC}"

# Choose action / version bump type
echo ""
echo -e "Choose release or testing option:"
echo -e "  ${GREEN}1) patch${NC}      (Bump patch & publish to npm + GitHub)"
echo -e "  ${GREEN}2) minor${NC}      (Bump minor & publish to npm + GitHub)"
echo -e "  ${GREEN}3) major${NC}      (Bump major & publish to npm + GitHub)"
echo -e "  ${GREEN}4) current${NC}    (Publish current version to npm + GitHub)"
echo -e "  ${YELLOW}5) test-local${NC} (Build, dry-run tarball & 'npm link' locally - NO PUBLISH)"
read -p "Select option [1-5] (default: 5): " choice
choice=${choice:-5}

# ----------------------------------------------------
# OPTION 5: LOCAL TEST ONLY
# ----------------------------------------------------
if [[ "$choice" == "5" ]]; then
  echo ""
  echo -e "${CYAN}--- RUNNING LOCAL TEST BUILD ---${NC}"
  echo -e "${CYAN}1. Compiling TypeScript...${NC}"
  npm run build
  chmod +x dist/index.js

  echo -e "${CYAN}2. Inspecting tarball contents (npm pack dry-run)...${NC}"
  npm pack --dry-run

  echo -e "${CYAN}3. Registering local binary via npm link...${NC}"
  npm link

  echo ""
  echo -e "${GREEN}=====================================================${NC}"
  echo -e "${GREEN}  ✔ LOCAL TEST READY! (No changes published to npm)  ${NC}"
  echo -e "${GREEN}  You can test it right now in any directory:       ${NC}"
  echo -e "${CYAN}  $ employee-agents                                  ${NC}"
  echo -e "${CYAN}  $ employee-agents --lang id                        ${NC}"
  echo -e "${GREEN}=====================================================${NC}"
  exit 0
fi

# ----------------------------------------------------
# OPTIONS 1-4: FULL RELEASE PIPELINE
# ----------------------------------------------------

# Check for uncommitted git changes
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}Uncommitted changes detected. Staging and committing...${NC}"
  git add .
  read -p "Enter commit message [chore: prepare release]: " commit_msg
  commit_msg=${commit_msg:-"chore: prepare release"}
  git commit -m "$commit_msg"
fi

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

# Preview tarball & link locally for safety check
echo -e "${CYAN}Inspecting tarball contents...${NC}"
npm pack --dry-run
npm link

# Confirmation before pushing to the world
echo ""
echo -e "${YELLOW}Local build and npm link completed successfully.${NC}"
read -p "Proceed to publish to npmjs.com and push to GitHub? [y/N]: " confirm_publish
confirm_publish=${confirm_publish:-n}

if [[ "$confirm_publish" != "y" && "$confirm_publish" != "Y" ]]; then
  echo -e "${YELLOW}Publish aborted. Local build remains linked for your testing.${NC}"
  exit 0
fi

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
