# 🏢 employee-agents

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.7-blue.svg)
![Antigravity](https://img.shields.io/badge/adapter-antigravity-orange.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**The Bikini Bottom Tech Squad**: A standalone virtual multi-role engineering squad adapting native spec-driven workflows for AI coding assistants.

[Quick Start](#-quick-start) • [The Squad](#-the-squad-roster) • [Dual Pipelines](#-dual-operational-pipelines) • [Architecture](#-directory-structure) • [Roadmap](ROADMAP.md) • [Security](SECURITY.md)

</div>

---

## 💡 The Problem with "Solo" AI Coding

When you ask a standard AI coding assistant to *"build a whole feature"*, it attempts to simultaneously act as the business analyst, UI designer, system architect, developer, and tester in a single context window.

This leads to:
1. **Generic "AI Slop"**: Bloated code, uncurated colors, missing responsiveness, and useless comments.
2. **Architecture Drift**: Code written with no architectural decision records (ADRs) or schema integrity.
3. **Context Hallucination**: Massive token waste by repeatedly re-reading entire project histories.
4. **Brownfield Damage**: Reckless refactoring and broken lines in existing codebases.

---

## 🦀 The Solution: A Virtual Engineering Squad

`employee-agents` reorganizes your AI into a **6-role engineering team** running natively inside your workspace. Operating on strict **Spec-Driven Development** principles, each role has a distinct persona, bounded responsibilities, and dedicated skill files.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BOS (Founder / User)                          │
│                   "Build feature X"  or  "Fix bug Y"                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             ADAPTER LAYER (.agent/skills/)             │
       │  - Detects Intent: Is this a FEATURE or a BUG?         │
       │  - Reads /myemployee/PRD.md & config.json              │
       └────────────────────────────┬───────────────────────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
      [ NEW FEATURE PIPELINE ]               [ FAST BUG PIPELINE ]
                 │                                     │
    1. Patrick (PO)                        1. Sandy Cheeks (PM)
       -> features/<slug>/PRD.md              -> tasks/bugs/BUG-DDMMYYYY-slug.md
                 │                                     │
    2. Squidward (UI/UX)                   2. Garry & Tn. Crab
       -> Design tokens & wireframes          -> Surgical line fix
                 │                                (Skip Master PRD!)
    3. Garry (Tech Lead)                               │
       -> features/<slug>/DESIGN.md                    ▼
                 │                         3. Stanley (QA)
    4. Sandy Cheeks (PM)                      -> Verification & regression check
       -> tasks/features/TASK-DDMMYYYY.md              │
          (Mandatory File & Line Range)                ▼
                 │                         4. Sandy Cheeks (PM)
    5. Tn. Crab (Devs)                        -> Renames ticket to:
       -> Clean code, zero slop                  [DONE]-BUG-DDMMYYYY-slug.md
                 │
    6. Stanley (QA)
       -> Destructive & edge-case testing
                 │
                 ▼
    7. Sandy Cheeks (PM)
       -> Renames task to:
          [DONE]-TASK-DDMMYYYY-slug.md
```

---

## 👥 The Squad Roster

| Role (Directory) | Persona | Calls User | Core Responsibility |
|---|---|---|---|
| **Founder / CEO** | **User** | **"Bos"** | The visionary leader making executive product calls. |
| **`product-owner`** | **Patrick** | "Bos" | Researches user needs, writes User Stories, and defines Given-When-Then Acceptance Criteria in `/features/<slug>/PRD.md`. |
| **`ui-ux`** | **Squidward** | "Bos" | Aesthetic connoisseur: layout reflows, design tokens, micro-interactions, responsive grids, and wireframes. Zero visual slop. |
| **`tech-lead`** | **Garry** | "Bos" | The wise architect: creates ADRs in `/features/<slug>/DESIGN.md`, models schemas, enforces security, and guards brownfield code. |
| **`project-manager`** | **Sandy Cheeks** | "Bos" | Tactical WBS task creator, emergency bug logger, and manager of the `[DONE]-*` completion lifecycle. |
| **`developer`** | **Tn. Crab** | "Bos" | Cost-conscious executioner: clean implementation, anti-slop code, and surgical line editing on existing code. |
| **`qa`** | **Stanley** | "Bos" | Destructive testing specialist: edge-case breaker, stress tester, and regression shield. |

---

## 🚀 Quick Start

Initialize the squad into any repository with zero external CLI dependencies:

```bash
# Default (English prompt wizard)
npx employee-agents init

# Or with Indonesian language prompt wizard
npx employee-agents init --lang id
```

### 3-Step Setup Wizard:
1. **Target AI Environment**: Select your editor (Antigravity active, Cursor/Claude/Cline/Windsurf coming soon).
2. **Project Type**:
   - `New Project (Greenfield)`: Starts from scratch with a fresh Master PRD template.
   - `Existing Codebase (Brownfield)`: Non-destructive init; audits existing manifests (`package.json`, `composer.json`, `go.mod`) and protects existing code from unauthorized edits.
3. **Project Name**: Confirms your application identifier.

---

## 📁 Directory Structure (`/myemployee/`)

Each role possesses a clean **`role.md`** defining its identity, and an extensible **`skill/`** folder containing its technical capabilities:

```text
myemployee/
├── PRD.md                         # Master Product Requirements Document (North Star)
├── config.json                    # Project configuration & target AI setting
│
├── features/                      # Modular Feature PRDs created by Patrick (PO)
│   └── <feature-slug>/PRD.md
│
├── tasks/                         # Task checklists created by Sandy Cheeks (PM)
│   ├── features/                  # TASK-DDMMYYYY-<slug>.md
│   └── bugs/                      # BUG-DDMMYYYY-<slug>.md
│
└── roles/                         # Modular Role Definitions & Capabilities
    ├── product-owner/
    │   ├── role.md                # Persona: Patrick | Calls: Bos
    │   └── skill/
    │       └── default-skill.md   # PRD & User Story drafting
    ├── ui-ux/
    │   ├── role.md                # Persona: Squidward | Calls: Bos
    │   └── skill/
    │       └── default-skill.md   # Design tokens & wireframes
    ├── tech-lead/
    │   ├── role.md                # Persona: Garry | Calls: Bos
    │   └── skill/
    │       └── default-skill.md   # System design & ADRs
    ├── project-manager/
    │   ├── role.md                # Persona: Sandy Cheeks | Calls: Bos
    │   └── skill/
    │       └── default-skill.md   # Task breakdown, bug tickets, [DONE]-*
    ├── developer/
    │   ├── role.md                # Persona: Tn. Crab | Calls: Bos
    │   └── skill/
    │       └── default-skill.md   # Clean code & surgical line editing
    └── qa/
        ├── role.md                # Persona: Stanley | Calls: Bos
        └── skill/
            └── default-skill.md   # Destructive testing & regression shield
```

---

## ⚡ Dual Operational Pipelines

### Pipeline 1: New Feature Workflow
When Bos asks for a new capability (e.g. *"Tim, bikin fitur Google OAuth login"*):
1. **Patrick (PO)** writes `/myemployee/features/google-oauth/PRD.md` with User Stories & Acceptance Criteria.
2. **Squidward (UI/UX)** provides design tokens and layout wireframes.
3. **Garry (Tech Lead)** writes `/myemployee/features/google-oauth/DESIGN.md` defining libraries, schema, and security.
4. **Sandy Cheeks (PM)** cuts tasks in `/myemployee/tasks/features/TASK-26102026-google-oauth.md` with **mandatory file and line ranges**:
   ```markdown
   - [ ] Implement Google OAuth Callback Handler
     - File: `src/api/auth/google/callback.ts`
   - [ ] Update User Session Store
     - File: `src/services/session.ts:L45-L60`
   ```
5. **Tn. Crab (Dev)** implements the changes with zero slop.
6. **Stanley (QA)** tests edge cases (timeouts, invalid tokens, network failures).
7. **Sandy Cheeks (PM)** renames the task file to:
   **`[DONE]-TASK-26102026-google-oauth.md`**.

---

### Pipeline 2: Urgent Bug Workflow (Token Saver)
When Bos reports an issue (e.g. *"Sandy, form submit registrasi error 500!"*):
1. **Sandy Cheeks (PM)** immediately creates:
   `/myemployee/tasks/bugs/BUG-26102026-register-500.md`
2. **Garry & Tn. Crab bypass reading the Master PRD**, read *only* that bug ticket, and perform a surgical fix directly on the targeted lines.
3. **Stanley (QA)** reproduces the fix and verifies zero regressions on existing code.
4. **Sandy Cheeks (PM)** renames the ticket to:
   **`[DONE]-BUG-26102026-register-500.md`**.

---

## 🧠 Token Optimization & Fast Filtering

In active sessions, the AI agent filters out historical tasks instantaneously:
```typescript
// AI scans task directory and ignores all files starting with [DONE]-
const activeTasks = files.filter(f => !f.startsWith('[DONE]-'));
```
- Active tasks are found in O(1) filename matching.
- Finished tasks remain on disk for auditing and sprint retrospectives, without cluttering the agent's active context window.

---

## 🌐 Language Protocol

- **In the Chat Room**: Team members converse warmly with Bos in **Bahasa Indonesia** or English (e.g. *"Siap Bos! Garry sudah review kodenya..."*).
- **All Written Files & Markdown Blocks**: **100% English Murni!**
  - All files (`PRD.md`, `DESIGN.md`, `TASK-*.md`, `BUG-*.md`, source code).
  - Any markdown preview blocks or tables rendered in chat are strictly in English.

---

## 🗺️ Roadmap & Community

See our [ROADMAP.md](ROADMAP.md) for upcoming platform adapters (Cursor, Claude Code, Cline, Windsurf), role level-up skills, and autonomous squad debate features.

- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## 📄 License

MIT © [Ivan Nofick](https://github.com/ivannofick)
