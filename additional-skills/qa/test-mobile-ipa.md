# Skill: iOS IPA / Simulator Mobile Automation (`test-mobile-ipa`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `tech-analyst`)
- **Slug**: `test-mobile-ipa`
- **Target**: iOS Applications (`.ipa` on physical iPhone/iPad or `.app` bundle on macOS Xcode Simulator)

## Token-Efficient Operation ("Targeted Hierarchy Inspect, Run Locally Zero-Token")
1. **Token-Safe Hierarchy Inspection**: Do NOT dump full XCUITest XML trees into context. Use `maestro hierarchy` (filtered to interactive elements) or inspect only `accessibilityIdentifier`, `label`, and `XCUIElementTypeButton` / `XCUIElementTypeTextField` nodes.
2. **Script-First Execution**: Write repeatable **Maestro (`.yaml`)** or **Appium XCUITest** scripts to disk and execute them locally via CLI (`xcrun simctl`, `maestro test`, or `pytest`/`wdio`) so recurring test runs use **0 AI tokens**.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Follow existing `ios/UITests/`, `maestro/`, or `e2e/` directories if present.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/mobile-ios/
   ├── build/               # Target .app (Simulator) or .ipa binaries (gitignored)
   ├── screens/             # Screen Object Model (accessibilityIdentifier & predicate locators)
   ├── flows/               # Maestro YAML flows or XCUITest/Appium specs
   └── fixtures/            # Simulator UDIDs, capabilities & test accounts
   ```

## iOS Automation Rules
- **Simulator Lifecycle Management**: Use `xcrun simctl list devices booted`, `xcrun simctl install booted <path.app>`, and `xcrun simctl launch booted <bundle.id>` for fast headless/booted simulator control.
- **Locator Priority**:
  1. `accessibilityIdentifier` / `id`
  2. `-ios predicate string` (e.g., `type == 'XCUIElementTypeButton' AND label == 'Sign In'`)
  3. `-ios class chain` (never brittle full XPath queries, which are slow and fragile on XCUITest).
- **Permission Alerts**: Handle iOS system permission popups (`Allow`, `Allow While Using App`) deterministically via `autoAcceptAlerts` or explicit conditional steps.

