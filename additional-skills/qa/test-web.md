# Skill: Web & API Automation Testing (`test-web`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `ui-ux`, `tech-analyst`)
- **Slug**: `test-web`
- **Target**: Live Websites, Staging/Localhost Web Apps (`http://` / `https://`), and REST/GraphQL APIs (White-Box or Black-Box without app repo)

## Token-Efficient Operation ("Write Script Once, Run Locally Zero-Token")
1. **Never Dump Raw HTML**: Do NOT paste full page DOM/HTML into chat. Inspect only interactive accessibility elements (`role`, `label`, `placeholder`, `data-testid`, `href`) to save 90%+ tokens.
2. **Script-First Execution**: Generate deterministic Playwright/Cypress test scripts on disk so repeated test runs execute locally via CLI (`npx playwright test`) at **0 AI token cost**.
3. **Concise Failure Logs**: When running test suites, read only failing assertion summaries and stack trace lines rather than dumping verbose pass logs.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Always check if the workspace already has `e2e/`, `tests/`, `cypress/`, or `__tests__/` and follow the existing structure.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/
   ├── unit/                # Fast isolated unit tests (*.test.ts)
   ├── integration/         # API contract & payload tests (*.api.spec.ts)
   └── web/                 # Web E2E automation (Playwright / Cypress)
       ├── pages/           # Page Object Model (POM) locators & actions
       ├── fixtures/        # Auth states, test data & environment configs
       └── *.e2e.spec.ts    # User journey test specs
   ```

## Anti-Flaky Engineering Rules
- **Resilient Locators**: Prioritize `getByRole()`, `getByLabel()`, `getByText()`, or explicit `data-testid` attributes over brittle CSS/XPath chains (`div > div:nth-child(3)`).
- **Zero Hardcoded Sleeps**: Never use `waitForTimeout(5000)` or `sleep()`. Use web-first auto-waiting assertions (`await expect(locator).toBeVisible()`).
- **Black-Box URL Configuration**: Read target `BASE_URL` from environment variables (`process.env.BASE_URL`) so the same suite runs against localhost, staging, or production.

