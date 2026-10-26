# Skill: E2E Playwright Automation

## Metadata
- **Owner**: Stanley (QA Engineer)
- **Slug**: e2e-playwright
- **Purpose**: Resilient headless browser test automation across critical user journeys.

## Operational Rules & Guidelines
1. **User-Visible Locators**: Locate elements via user-visible text, roles, and labels (`getByRole`, `getByLabel`), never brittle CSS class chains.
2. **Deterministic State**: Each test must isolate its state (unique user credentials or database fixtures) to prevent order-dependent test failures.
3. **No Arbitrary Sleeps**: Prohibit hardcoded `sleep(5000)`. Rely strictly on Playwright web-first auto-waiting assertions (`await expect(locator).toBeVisible()`).
4. **Failure Artifacts**: Auto-capture screenshots and trace files upon test failure.

## Procedures
- Step 1: Define key user paths from Patrick's PRD Acceptance Criteria.
- Step 2: Implement test suite with page object models where appropriate.
- Step 3: Run headless test runs across Chromium, Firefox, and WebKit.
- Step 4: Include E2E test status in task sign-off checklist.
