# employee-agents: Roadmap & Releases

Official release history and upcoming milestones for `employee-agents`.

---

## Current Status: v1.0.5 (Published on npm)

`employee-agents` provides a spec-driven engineering squad for solo founders and development teams, prioritizing token efficiency, file-targeted implementation, and explicit founder approval gates.

---

## Product Roadmap

### In Development (Target: v1.1.0)
- **Modular Security Squad Extension**:
  - `security-redteam` (**Plankton**): Offensive security, penetration testing simulation, exploit PoC generation, and secret leak auditing.
  - `security-compliance` (**Gristlepuss**): Regulatory auditing, OWASP baseline checks, license compliance, and data privacy governance.
  - On-demand installation via `employee-agents add-role` without increasing base token footprint.

### Planned (v1.2.0+)
- **Interactive Workspace Dashboard**: Terminal UI to monitor squad status, pending PRDs, and active Kanban tickets.
- **Token Analytics**: Live token consumption reports comparing raw prompting vs. structured spec-driven squad workflows.
- **Custom Role Generator**: CLI command (`employee-agents create-role`) to scaffold custom personas with tailored blueprints and system prompts.

---

## Shipped Capabilities (v1.0.0 – v1.0.5)

### 1. 7-Persona Core Squad
- `tech-analyst` (**Larry**): Technical feasibility, API boundaries, and fast-track triage.
- `product-owner` (**Patrick**): Feature PRDs, Acceptance Criteria (Given-When-Then), and Master PRD synchronization.
- `ui-ux` (**Squidward**): Mobile-first aesthetics, design token tables, and Visual Acceptance Criteria (`[ ] VAC-*`).
- `tech-lead` (**Garry**): Architecture review, context-switch guard, and system cohesion.
- `project-manager` (**Sandy**): Kanban ticket orchestration and file-targeted checklists.
- `developer` (**Tn. Crab**): Surgical implementation, minimal line diffs, and mobile viewport self-tests.
- `qa` (**Stanley**): Destructive test cases, visual fidelity audits, and edge-case verification.

### 2. Context Window & Token Optimization
- **Living Master PRD (`/.myemployee/PRD.md`)**: High-level feature index prevents agents from loading full PRD contents unnecessarily.
- **Segmented Kanban Folders (`pending/`, `in-progress/`, `paused/`, `done/`)**: Isolates active work from completed tasks to minimize token consumption.
- **Lean Base Skills**: Each persona defaults to a lightweight `default-skill.md`; specialized skills are loaded on demand via `add-skill`.

### 3. Founder Control & Guardrails
- **Strict Verification Gates**: Workflows cannot self-mark tasks as complete or trigger `git push`. Only `/done-task` confirms completion.
- **Context-Switch Guard**: Garry assesses dirty worktree state and provides clean paths (finish vs. park to `tasks/paused/`) when priorities change mid-task.
- **Fast-Track Protocol**: 3-bullet technical triage and micro-PRD for rapid hotfixes.

### 4. CLI & Environment Integration
- **Universal PATH Launcher**: Automatic launcher generation in user PATH (`~/.local/bin` on macOS/Linux, `%APPDATA%\npm` / `%LOCALAPPDATA%` on Windows).
- **Workspace Cleanliness (`hide` / `show`)**: Toggle workspace visibility in IDE sidebar via `.vscode/settings.json` without lingering residue.
- **Automatic Git Protection**: Automatically ensures `/.myemployee/` is excluded in `.gitignore`.
- **Cache-Safe Update**: Self-updating routine detects stale npx caches and re-runs `@latest`.

### 5. Cross-Role Testing & Seam Handling
- **Seam Risk Verification (`[SEAM RISK]`)**: Implementers flag collateral risks affecting external callers, shared types, or downstream contracts.
- **Solo-Role Scope Expansion**: Single-persona workspaces can expand checklists to address cross-file ripple effects directly.
- **Modular Testing Skills**: On-demand testing skills (`test-web`, `test-mobile-apk`, `test-mobile-ipa`, `test-desktop-windows`, `test-desktop-mac`, `test-desktop-electron`) installable for any active role.

---

## Release History

| Version | Release Date | Highlights |
|---------|--------------|------------|
| **v1.0.5** | 2026-10-29 | Universal CLI PATH launcher, 6 cross-role testing automation skills, `[SEAM RISK]` seam handling protocol, and cache-safe self-updater. |
| **v1.0.4** | 2026-10-27 | Single-line ambient `AGENTS.md` integration, `/.myemployee/` standard folder migration, and `hide`/`show` CLI commands. |
| **v1.0.3** | 2026-10-27 | Added Larry (Tech Analyst), Kanban task subdirectories, Living Master PRD architecture, and Context-Switch Guard. |
| **v1.0.2** | 2026-10-26 | Refactored architecture specifications and extracted community acknowledgments. |
| **v1.0.1** | 2026-10-26 | Initial public release: 6-persona core squad, TypeScript setup wizard, dual-language support (EN/ID), and Antigravity slash commands. |
