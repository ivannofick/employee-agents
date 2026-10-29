# Skill: Electron Desktop Application Automation (`test-desktop-electron`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `ui-ux`, `tech-analyst`)
- **Slug**: `test-desktop-electron`
- **Target**: Cross-Platform Electron Desktop Applications (`.app` on macOS, `.exe` on Windows, AppImage on Linux, or local Electron source repo)

## Token-Efficient Operation ("Accessibility Locators Only, Run Locally Zero-Token")
1. **Never Dump Raw Renderer HTML**: Inspect only interactive DOM/Accessibility nodes (`getByRole`, `getByLabel`, `data-testid`) inside the Electron `BrowserWindow` rather than dumping full HTML trees.
2. **Script-First Execution**: Write deterministic **Playwright Electron (`_electron.launch()`)** test suites on disk so repeated runs execute locally via `npx playwright test` at **0 AI token cost**.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Follow existing `e2e/` or `tests/` directories if present.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/desktop-electron/
   ├── windows/             # Window/Page Object Model for Electron BrowserWindows & IPC helpers
   ├── fixtures/            # Executable path config (ELECTRON_APP_PATH) & mock user data dirs
   └── *.electron.spec.ts   # Playwright Electron automation specs
   ```

## Electron Automation Rules
- **Binary vs. Repo Launch**:
  - **Black-Box (Packaged Binary Only)**: Launch via `_electron.launch({ executablePath: process.env.ELECTRON_APP_PATH })` pointing to `/Applications/<App>.app/Contents/MacOS/<App>` (macOS) or `C:\\...\\<App>.exe` (Windows).
  - **White-Box (With Source Repo)**: Launch via `_electron.launch({ args: ['dist/main.js'] })`.
- **Main Process & Renderer Coordination**: Use `electronApp.firstWindow()` to obtain the active `Page`, and `electronApp.evaluate(({ app }) => ...)` when inspecting native menus, dialogs, or IPC state.
- **Isolated User Data & Clean Teardown**: Pass a temporary `--user-data-dir` per test run to prevent local storage collisions and always call `await electronApp.close()` in `afterEach`.

