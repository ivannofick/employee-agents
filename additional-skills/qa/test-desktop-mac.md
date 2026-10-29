# Skill: Native macOS Desktop Automation (`test-desktop-mac`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `tech-analyst`)
- **Slug**: `test-desktop-mac`
- **Target**: Native macOS Desktop Applications (`.app` / `.dmg` built with SwiftUI, Cocoa, AppKit, or Mac Catalyst)

## Token-Efficient Operation ("Targeted AXUIElement Tree, Run Locally Zero-Token")
1. **Token-Safe Accessibility Inspection**: Never dump raw system-wide accessibility trees. Query only the target application process (`AXApplication`) and filter for interactive roles (`AXButton`, `AXTextField`, `AXCheckBox`, `AXPopUpButton`, `AXMenuItem`) along with `AXIdentifier` and `AXTitle`.
2. **Script-First Execution**: Write repeatable **Appium Mac2Driver** (`XCUITest` for macOS) or **Pytest + macOS Accessibility (`pyobjc-framework-ApplicationServices` / `atomacos` / `osascript`)** scripts on disk so test execution runs locally at **0 AI token cost**.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Respect existing `UITests/` or `tests/` directories if present.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/desktop-mac/
   ├── windows/             # Window Object Model (AXIdentifier, AXRole & menu bar mappings)
   ├── helpers/             # Bundle launcher (`open -a` / bundleId) & teardown hooks
   ├── fixtures/            # App bundle path (APP_BUNDLE_PATH) & test configs
   └── test_*.py            # Native macOS automation test specs
   ```

## Native macOS Automation Rules
- **Bundle & Process Targeting**: Launch or attach by `bundleId` (e.g., `com.company.app` read via `mdls -name kMDItemCFBundleIdentifier -r /Applications/<App>.app`) rather than hardcoded window positions.
- **Resilient Locators**: Prioritize `AXIdentifier` (`accessibilityIdentifier` in SwiftUI/AppKit), `AXTitle`, and `AXRole` predicates over screen coordinates `(x, y)`.
- **Accessibility Permission & Teardown**: Verify macOS Accessibility permission is granted (`System Settings -> Privacy & Security -> Accessibility`) and cleanly quit the target app (`osascript -e 'tell application id "<bundleId>" to quit'`) during teardown.
