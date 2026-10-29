# Skill: Native Windows Desktop Automation (`test-desktop-windows`)

## Metadata
- **Scope**: Cross-Role Global Skill (`qa`, `developer`, `tech-lead`, `tech-analyst`)
- **Slug**: `test-desktop-windows`
- **Target**: Native Windows Desktop Applications (`.exe` / `.msi` built with Win32, WPF, WinForms, or WinUI / UWP)

## Token-Efficient Operation ("UIA Control Identifiers Only, Run Locally Zero-Token")
1. **Token-Safe Window Inspection**: Never dump thousands of lines of raw UI trees. Query only top-level window titles and interactive controls (`AutomationId`, `Name`, `ControlType` such as `Button`, `Edit`, `ComboBox`, `MenuItem`).
2. **Script-First Execution**: Generate standalone **Pywinauto (`backend="uia"`)** or **FlaUI (.NET)** test files on disk so execution runs locally (`pytest` / `dotnet test`) at **0 AI token cost**.

## Adaptive Test Foldering Convention
1. **Existing Repo Convention First**: Follow the repository's existing test directory if present.
2. **Standalone QA Repo / New Project Structure**:
   ```text
   tests/desktop-windows/
   ├── windows/             # Window Object Model (AutomationId & ControlType mappings)
   ├── helpers/             # App launcher, process cleanup & screenshot-on-failure hooks
   ├── fixtures/            # Executable paths (APP_EXE_PATH) & test input files
   └── test_*.py            # Native Windows desktop automation test specs
   ```

## Native Windows Automation Rules
- **UIA Backend First**: Use Python `pywinauto` with `Application(backend="uia").start(exe_path)` or `connect(title_re="...")` (or `FlaUI.UIA3` in C#/.NET).
- **Resilient Locators**: Locate controls by `auto_id` (`AutomationId`) and `control_type` (e.g., `dlg.child_window(auto_id="btnSubmit", control_type="Button")`) rather than screen pixel coordinates so tests never break when windows move or resize.
- **Wait & Cleanup Discipline**: Always use explicit readiness waits (`wait("visible enabled", timeout=10)`) and cleanly terminate or close spawned `.exe` processes in test teardown fixtures.
