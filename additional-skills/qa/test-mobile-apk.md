# Skill: Android APK Mobile Automation (`test-mobile-apk`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `tech-analyst`)
- **Slug**: `test-mobile-apk`
- **Target**: Android Applications (`.apk` / `.aab`) on Emulator or USB Real Device (Black-Box or White-Box)

## Token-Efficient Operation ("Filter XML Hierarchy, Run Locally Zero-Token")
1. **Token-Safe UI Inspection**: When inspecting a live Android screen without source code, NEVER dump the entire raw `uiautomator` XML into context. Filter only interactive nodes with non-empty `resource-id`, `text`, or `content-desc`:
   ```bash
   adb shell uiautomator dump /sdcard/view.xml && adb shell cat /sdcard/view.xml | grep -oE '(resource-id|text|content-desc)="[^"]+"'
   ```
2. **Script-First Execution**: Author reusable **Maestro (`.yaml`)** or **Appium UiAutomator2** scripts on disk so test execution runs locally via CLI (`maestro test` or `npx wdio`) at **0 AI token cost**.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Respect existing `maestro/`, `appium/`, or `e2e/` folders if present.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/mobile-android/
   ├── apk/                 # Target .apk binaries (gitignored)
   ├── screens/             # Screen Object Model (resource-id & accessibility locators)
   ├── flows/               # Maestro YAML flows or Appium test specs
   └── fixtures/            # Test credentials & device capabilities
   ```

## Android Automation Rules
- **Package & Activity Discovery**: Detect package name and launch activity from the `.apk` or active device via `adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'`.
- **Resilient Locators**: Target `resource-id` (`id`), `content-desc` (accessibility id), or visible text. Avoid raw screen `(x, y)` tap coordinates so tests survive different phone resolutions.
- **Deterministic Device State**: Clear app state (`adb shell pm clear <package>` or `clearState: true` in Maestro) before critical auth/onboarding flows.

