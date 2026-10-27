# employee-agents: Published Releases & Capabilities Log

> Official record of published releases and shipped capabilities in `employee-agents`. This document is updated strictly upon each verified release.

---

## Current Release Status: v1.0.4 (In Preparation / Ready to Ship)

`employee-agents` provides solo founders and engineering leaders with a self-sufficient, disciplined engineering squad operating on native spec-driven workflows and strict token hygiene.

---

## Shipped & Proven Capabilities

### 1. 7-Persona Bikini Bottom Squad Roster
- `tech-analyst`: **Larry the Lobster** (Technical Feasibility, API Boundaries & Fast-Track Triage)
- `product-owner`: **Patrick** (Feature PRD, Given-When-Then AC & Master PRD Synchronization)
- `ui-ux`: **Squidward** (Mobile-First Aesthetics, Design Tokens & Testable Visual Acceptance Criteria)
- `tech-lead`: **Garry** (System Architecture, Anti-Lasagna Code Review & Context-Switch Guard)
- `project-manager`: **Sandy Cheeks** (Kanban Task Management, File:Line Targeting & Dashboard)
- `developer`: **Tn. Crab** (Design-Adherent Implementation, Surgical Line Editing & 375px Mobile Self-Testing)
- `qa`: **Stanley** (Destructive Functional Testing, Visual Fidelity VAC Audits & Anti-Slop Gate)

### 2. Living Master PRD Architecture (`/.myemployee/PRD.md`)
- Living document containing the Founder Goal and an auto-updating Feature Index table with 1–2 sentence executive summaries per feature.
- Dramatically cuts context window token consumption by preventing agents from reading all feature PRDs.

### 3. Kanban Task Management Subdirectories
- Structure:
  - `/.myemployee/tasks/pending/` (Backlog of new tasks)
  - `/.myemployee/tasks/in-progress/` (Active task being coded)
  - `/.myemployee/tasks/paused/` (Tasks suspended during priority pivots)
  - `/.myemployee/tasks/done/` (Archived completed tasks)
- Eliminates context window pollution caused by scanning completed tasks in a single flat directory.

### 4. Testable Mobile-First Design Standard (`DESIGN.md`)
- Enforces design starting from Compact viewports (360px–375px) with fluid expansion rules for larger screens.
- Mandates CSS Design Tokens Tables, Component State Matrices, and binary Visual Acceptance Criteria (`[ ] VAC-*`) checklists.

### 5. Strict Founder Sovereignty over Task Completion & Git Push
- Workflows (`/apply-work`) are forbidden from auto-marking tasks `[DONE]` or prompting/running `git push`.
- Only the founder via `/done-task` has the authority to move tasks to `done/`.
- Git push is executed only when the prompt explicitly includes "sekalian dipush ke git" or "push ke git".

### 6. Operational Edge-Case Handlers
- **30-Second Fast-Track Protocol**: Larry provides a 3-bullet feasibility check and Patrick generates a 10-line Micro-PRD when the founder demands immediate coding.
- **Context-Switch Guard**: Garry reports repo state and provides 2 clean paths (wrap in 1 min vs park to `tasks/paused/`) when priorities shift from Bug A to Feature B mid-stream.

### 7. Interactive CLI Wizard & Modular i18n
- Native TypeScript ESM executable (`employee-agents init`) with zero locked default answers.
- Modular i18n architecture supporting English (`--lang en`) and Bahasa Indonesia (`--lang id`).
- Native Antigravity driver skill and slash command suite (`/share-knowledge`, `/apply-work`, `/done-task`, `/my-task`, `/add-skill`, `/update-me`).

### 8. Ambient Guardrail, Dotfolder Standard & Clean Sidebar Mode (v1.0.4)
- **Universal Ambient Governance**: Automatically smart-appends root `AGENTS.md` with an ultra-lean 1-sentence Single Source of Truth (SSOT) pointer to `.agent/skills/myemployee/SKILL.md` (via non-destructive delimiter tags `<!-- employee-agents:start -->...<!-- employee-agents:end -->`), eliminating rule bloat and duplication.
- **Casual Prompt Triage**: Intercepts casual user chat without slash commands, summoning Larry (Tech Analyst) and Patrick (Product Owner) as front-desk to prepare pending Kanban task tickets rather than dumping unverified code.
- **Multi-Skill Coexistence**: Seamlessly coexists with external agent skills and tools (OpenSpec, Antislop, linters) without interference.
- **Dotfolder Standard (`/.myemployee/`)**: Standardized workspace folder to `/.myemployee/` with seamless backward-compatibility auto-migration from legacy `myemployee/` directories.
- **IDE Sidebar Toggle**: Provides non-destructive `employee-agents hide` and `employee-agents show` commands. `hide` conceals `/.myemployee` and `.vscode` itself via `.vscode/settings.json` (`files.exclude`). `show` restores visibility and automatically cleans up `.vscode/settings.json` and the `.vscode/` directory when empty (zero residue).

---

## Release History Log

| Version | Release Date | Summary of Changes |
|---------|--------------|--------------------|
| **v1.0.4** | 2026-10-27 | Ambient Guardrail, Dotfolder Standard & Clean Sidebar Mode: Added universal SSOT `AGENTS.md` pointer, broad action semantic triggers in `SKILL.md`, Front-Desk casual prompt triage, multi-skill coexistence, `/.myemployee/` dotfolder standard with auto-migration, and `hide`/`show` CLI commands with auto-hiding `.vscode` and zero-residue cleanup. |
| **v1.0.3** | 2026-10-27 | Squad Architecture Reform: Added Larry the Lobster (Tech Analyst), Kanban task subfolders, Living Master PRD sync, Mobile-First testable `DESIGN.md` with VAC checklists, Founder sovereignty on `[DONE]` and Git push, Garry's Context-Switch Guard, and streamlined roadmap. |
| **v1.0.2** | 2026-10-26 | Refactored artifacts (`DESIGN.md`, `ARCHITECTURE.md`), enforced strict English specification standards, and extracted `ACKNOWLEDGMENTS.md`. |
| **v1.0.1** | 2026-10-26 | Perdana rilis (Initial public release): 6-role Bikini Bottom squad, gated task lifecycle, TypeScript CLI wizard, i18n support, and Antigravity slash commands. |

