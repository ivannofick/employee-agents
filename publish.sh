#!/usr/bin/env bash

set -e

# Styling Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CURRENT_VERSION=$(node -p "require('./package.json').version")
PATCH_VERSION=$(node -p "const v=require('./package.json').version.split('.').map(Number); \`\${v[0]}.\${v[1]}.\${v[2]+1}\`")
MINOR_VERSION=$(node -p "const v=require('./package.json').version.split('.').map(Number); \`\${v[0]}.\${v[1]+1}.0\`")
MAJOR_VERSION=$(node -p "const v=require('./package.json').version.split('.').map(Number); \`\${v[0]+1}.0.0\`")

echo -e "${CYAN}=====================================================${NC}"
echo -e "${CYAN}      EMPLOYEE-AGENTS RELEASE & TEST SCRIPT          ${NC}"
echo -e "${CYAN}      Current Version: v${CURRENT_VERSION}                     ${NC}"
echo -e "${CYAN}=====================================================${NC}"

# Choose action / version bump type
echo ""
echo -e "Choose release or testing option:"
echo -e "  ${GREEN}1) patch${NC}      (v${PATCH_VERSION} - Bump patch & publish to npm + GitHub)"
echo -e "  ${GREEN}2) minor${NC}      (v${MINOR_VERSION} - Bump minor & publish to npm + GitHub)"
echo -e "  ${GREEN}3) major${NC}      (v${MAJOR_VERSION} - Bump major & publish to npm + GitHub)"
echo -e "  ${GREEN}4) current${NC}    (v${CURRENT_VERSION} - Publish current version as-is to npm + GitHub)"
echo -e "  ${YELLOW}5) test-local${NC} (v${CURRENT_VERSION} - Clean uninstall, build & install globally - NO PUBLISH)"
read -p "Select option [1-5] (default: 5): " choice
choice=${choice:-5}

# ----------------------------------------------------
# OPTION 5: LOCAL TEST ONLY
# ----------------------------------------------------
if [[ "$choice" == "5" ]]; then
  echo ""
  echo -e "${CYAN}--- RUNNING CLEAN LOCAL TEST & DIRECT INSTALL ---${NC}"
  echo -e "Choose local testing mode:"
  echo -e "  ${GREEN}1) Local templates${NC} (Recommended: use templates from this local workspace - test unpushed changes)"
  echo -e "  ${YELLOW}2) Remote GitHub${NC}   (Simulate real npm user: download latest templates from GitHub main)"
  read -p "Select test mode [1-2] (default: 1): " test_mode
  test_mode=${test_mode:-1}

  echo -e "${CYAN}1. Removing previously installed local/global versions...${NC}"
  npm uninstall -g employee-agents 2>/dev/null || true
  npm unlink -g employee-agents 2>/dev/null || true

  # Remove possible stale symlinks in global npm bin
  GLOBAL_BIN="$(npm root -g)/../bin"
  if [[ -f "$GLOBAL_BIN/employee-agents" || -L "$GLOBAL_BIN/employee-agents" ]]; then
    rm -f "$GLOBAL_BIN/employee-agents"
  fi

  echo -e "${CYAN}2. Clearing npx and npm cache...${NC}"
  rm -rf ~/.npm/_npx 2>/dev/null || true
  npm cache clean --force 2>/dev/null || true

  echo -e "${CYAN}3. Compiling TypeScript...${NC}"
  npm run build
  chmod +x dist/index.js

  echo -e "${CYAN}4. Installing directly from local directory (npm install -g .)...${NC}"
  npm install -g .

  mkdir -p ~/.employee-agents

  if [[ "$test_mode" == "1" ]]; then
    echo -e "${CYAN}5. Configuring Local Workspace Template override...${NC}"
    rm -f ~/.employee-agents/force-remote
    echo "$PWD" > ~/.employee-agents/dev-root
    echo -e "${GREEN}  ✔ Using local workspace templates from: $PWD${NC}"
  else
    echo -e "${CYAN}5. Configuring Remote GitHub download mode...${NC}"
    rm -f ~/.employee-agents/dev-root
    touch ~/.employee-agents/force-remote
    echo -e "${YELLOW}  ✔ Set to remote mode! Will download live blueprints from GitHub.${NC}"
  fi

  echo ""
  echo -e "${GREEN}=====================================================${NC}"
  echo -e "${GREEN}  ✔ LOCAL INSTALL READY! Clean cache & freshly installed${NC}"
  echo -e "${GREEN}  Installed binary: $(which employee-agents || echo "global binary")${NC}"
  echo -e "${GREEN}  Mode: $([[ "$test_mode" == "1" ]] && echo "Local Workspace Templates" || echo "Remote GitHub Download")${NC}"
  echo -e "${GREEN}  You can test it right now in any directory:       ${NC}"
  echo -e "${CYAN}  $ employee-agents                                  ${NC}"
  echo -e "${CYAN}  $ employee-agents --lang id                        ${NC}"
  echo -e "${GREEN}=====================================================${NC}"
  exit 0
fi

# Clean up any local dev overrides before publish
rm -f ~/.employee-agents/dev-root ~/.employee-agents/force-remote

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
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    if ! git rev-parse "v$CURRENT_VERSION" >/dev/null 2>&1; then
      echo -e "${YELLOW}Creating Git tag v$CURRENT_VERSION...${NC}"
      git tag -a "v$CURRENT_VERSION" -m "chore(release): v$CURRENT_VERSION"
    fi
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
