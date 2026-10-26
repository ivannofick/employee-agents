# employee-agents

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.7-blue.svg)
![Antigravity](https://img.shields.io/badge/adapter-antigravity-orange.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A Virtual Software Engineering Team Framework**: Run an autonomous, multi-role engineering squad (Product Owner, UI/UX Designer, Tech Lead, Project Manager, Developer, QA Engineer) directly inside your AI coding assistant.

[Quick Start](#-quick-start) • [The Squad](#-the-squad-roster) • [Slash Commands](#-built-in-slash-commands) • [Operational Lifecycle](#-operational-lifecycle) • [Directory Structure](#-directory-structure) • [Acknowledgments](ACKNOWLEDGMENTS.md) • [Roadmap](ROADMAP.md)

</div>

---

## The Problem with "Solo" AI Coding

When you ask a standard AI coding assistant to *"build a whole feature"*, it attempts to simultaneously act as the business analyst, UI designer, system architect, developer, and tester within a single context window.

This leads to:
1. **Generic "AI Slop"**: Bloated code, uncurated color tokens, missing responsiveness, and noisy auto-generated comments.
2. **Architecture Drift**: Code written without Architectural Decision Records (ADRs) or schema integrity.
3. **Context Hallucination**: Massive token waste by repeatedly re-reading entire project histories.
4. **Brownfield Damage**: Reckless refactoring and broken lines in existing codebases.

---

## The Solution: A Virtual Engineering Squad

`employee-agents` organizes your AI into a **6-role engineering team** running natively inside your workspace. Operating on strict **Spec-Driven Development** principles, each role possesses bounded responsibilities, dedicated skill files, and clear operational gates.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      LEAD ARCHITECT / FOUNDER (User)                   │
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
      [ PHASE 1: /share-knowledge ]          [ FAST BUG PIPELINE ]
                 │                                     │
    1. Patrick (Product Owner)             1. Sandy Cheeks (PM)
       -> features/<slug>/PRD.md              -> tasks/bugs/[PENDING]-BUG-*.md
                 │                                     │
    2. Squidward (UI/UX)                   2. Garry & Tn. Crab
       -> Design tokens & wireframes          -> Surgical line fix
                 │                                (Skip Master PRD!)
    3. Garry (Tech Lead)                               │
       -> features/<slug>/DESIGN.md                    ▼
                 │                         3. Stanley (QA)
    4. Sandy Cheeks (PM)                      -> Verification & regression check
       -> tasks/features/                              │
          [PENDING]-TASK-DDMMYYYY-slug.md              ▼
                 │                         4. Sandy Cheeks (PM)
                 ▼                            -> Renames ticket to:
      [ PHASE 2: /apply-work ]                   [DONE]-BUG-DDMMYYYY-slug.md
                 │
    5. Tn. Crab (Developer)
       -> Surgical code execution
                 │
    6. Stanley (QA Engineer)
       -> Destructive & edge-case testing
                 │
                 ▼
    7. Sandy Cheeks (PM)
       -> Renames task to:
          [DONE]-TASK-DDMMYYYY-slug.md
```

---

## The Squad Roster

| Role (Directory) | Persona | Responsibility | Target Artifact |
|---|---|---|---|
| **`product-owner`** | **Patrick** | User research, user journey mapping, and Acceptance Criteria. | `/features/<slug>/PRD.md` |
| **`ui-ux`** | **Squidward** | Aesthetic systems, design tokens, micro-interactions, and responsive grids. | `/features/<slug>/UIUX.md` |
| **`tech-lead`** | **Garry** | System architecture, ADRs, schema modeling, security, and brownfield code safety. | `/features/<slug>/DESIGN.md` |
| **`project-manager`** | **Sandy Cheeks** | Work breakdown structure, sprint tracking, priority dashboard, and task lifecycles. | `/tasks/features/[PENDING]-TASK-*.md` |
| **`developer`** | **Tn. Crab** | Clean execution, cost-conscious token usage, anti-slop code, and surgical line edits. | Source code files |
| **`qa`** | **Stanley** | Destructive testing, edge-case discovery, stress simulation, and regression checks. | QA sign-offs & verification reports |

---

## Quick Start

### 1. Initialize a Workspace
Run directly in your project root:

```bash
# Direct run (English setup wizard)
npx employee-agents

# Or with Indonesian language setup wizard
npx employee-agents --lang id
```

### 2. Update an Existing Workspace
To safely upgrade an already initialized `/myemployee/` workspace to the latest squad skills, rules, and slash commands without touching your custom PRDs or tasks:

```bash
# Via terminal:
npx employee-agents update-me
# (or alias: npx employee-agents update)
```

Or trigger it directly inside your AI assistant chat room:
```text
/update-me
```

### 3. Add Skills to an Employee (On-Demand Registry)
Each role comes with a lean `default-skill.md` out of the box to preserve context window capacity. Browse our full [Additional Skills Catalog](additional-skills/README.md) to selectively level up any employee:

```bash
# Interactive CLI wizard:
npx employee-agents add-skill

# Direct installation from catalog:
npx employee-agents add-skill developer docker-containerization
```

Or trigger it interactively inside your AI assistant chat room:
```text
/add-skill
```

### 4. Scale Squad Roles (Add or Remove Roles Anytime)
Scale your squad up or down dynamically. When a role is added or removed, your `.agent/skills/myemployee/SKILL.md` controller automatically regenerates and self-heals:

```bash
# Add a role to your squad:
npx employee-agents add-role ui-ux

# Remove a role from your squad:
npx employee-agents remove-role developer
```

---

## Built-In Slash Commands (`/`)

When using Antigravity, the framework equips you with interactive slash commands in your chat room:

| Slash Command | Handler | Description |
|---|---|---|
| **`/share-knowledge`** | Patrick, Squidward, Garry, Sandy | **Phase 1: Thinking & Spec**. Aligns on goals, drafts feature PRD, UI/UX tokens, and system architecture, then logs `[PENDING]-TASK-*.md`. Zero code is written in this phase. *(Also accepts alias `/share-knowladge`)*. |
| **`/apply-work`** | Tn. Crab (Dev) & Stanley (QA) | **Phase 2: Execution**. Surgically implements active `[PENDING]-` tasks, executes QA validations, and transitions ticket to `[DONE]-`. |
| **`/my-task`** | Sandy Cheeks (PM) | Displays priority task board. Shows top 5 pending tasks (hides completed if pending >= 5), or blends with recent completed tasks up to 5 items total. |
| **`/done-task`** | Sandy Cheeks (PM) | Manually verifies sign-offs and marks a task as `[DONE]-*`. Supports targeted slug (e.g. `/done-task oauth`) or auto-detection. |
| **`/add-skill`** | Garry & Sandy | Interactive workflow to level up any employee with a new modular skill under `/myemployee/roles/<role>/skill/`. |
| **`/status-token`** | Garry (Tech Lead) | Reports the active AI model, total context window capacity (1M tokens), estimated tokens consumed, remaining quota, and efficiency advice. |
| **`/update-me`** | Garry & Sandy | Safely upgrades your squad roles, anti-slop skills, and workflows to the latest release while keeping your PRDs and tasks intact. |

---

## Directory Structure (`/myemployee/`)

Each role possesses a clean **`role.md`** defining its identity, and an extensible **`skill/`** folder containing its technical capabilities:

```text
myemployee/
├── PRD.md                         # Master Product Requirements Document (North Star)
├── config.json                    # Project configuration & active roles
│
├── features/                      # Modular Feature Specs created during /share-knowledge
│   └── <feature-slug>/
│       ├── PRD.md                 # User Stories & Acceptance Criteria (Patrick)
│       ├── UIUX.md                # Tokens, Typography & Layout (Squidward)
│       └── DESIGN.md              # Architecture, ADRs & Target Files (Garry)
│
├── tasks/                         # Task checklists managed by Sandy Cheeks (PM)
│   ├── features/                  # [PENDING]-TASK-*.md ➔ [DONE]-TASK-*.md
│   └── bugs/                      # [PENDING]-BUG-*.md ➔ [DONE]-BUG-*.md
│
└── roles/                         # Modular Role Definitions & Capabilities
    ├── product-owner/
    │   ├── role.md                # Persona: Patrick | Focus: Product Vision & User Stories
    │   └── skill/
    │       └── default-skill.md   # PRD & User Story drafting
    ├── ui-ux/
    │   ├── role.md                # Persona: Squidward | Focus: Design Systems & Anti-Slop UI
    │   └── skill/
    │       └── default-skill.md   # Modern UI guidelines & wireframes
    ├── tech-lead/
    │   ├── role.md                # Persona: Garry | Focus: System Architecture & ADRs
    │   └── skill/
    │       └── default-skill.md   # System design & stack enforcement
    ├── project-manager/
    │   ├── role.md                # Persona: Sandy Cheeks | Focus: Task Tracking & Sprints
    │   └── skill/
    │       └── default-skill.md   # Task breakdown, bug tickets, [DONE]-*
    ├── developer/
    │   ├── role.md                # Persona: Tn. Crab | Focus: Clean Code & Surgical Editing
    │   └── skill/
    │       └── default-skill.md   # Anti-slop coding & minimal line diffs
    └── qa/
        ├── role.md                # Persona: Stanley | Focus: QA & Destructive Testing
        └── skill/
            └── default-skill.md   # Regression testing & verification
```

---

## Operational Lifecycle

### 1. Two-Phase Feature Workflow (`/share-knowledge` ➔ `/apply-work`)

To prevent AI from prematurely generating unreviewed code, features strictly follow a two-phase gated process:

#### Phase 1: Thinking & Spec (`/share-knowledge`)
1. **Patrick (PO)** writes `/myemployee/features/<slug>/PRD.md` with User Stories & Acceptance Criteria.
2. **Squidward (UI/UX)** defines design tokens, layout hierarchy, and ensures zero visual slop.
3. **Garry (Tech Lead)** writes `/myemployee/features/<slug>/DESIGN.md` defining libraries, schema, and security.
4. **Sandy Cheeks (PM)** generates the task ticket on disk:
   `/myemployee/tasks/features/[PENDING]-TASK-DDMMYYYY-<slug>.md` with **mandatory target file and line ranges**:
   ```markdown
   - [ ] Implement Google OAuth Callback Handler
     - File: `src/api/auth/google/callback.ts`
   - [ ] Update User Session Store
     - File: `src/services/session.ts:L45-L60`
   ```
*Result: Specs and checklists are locked in. Zero application code has been written yet.*

#### Phase 2: Execution & Verification (`/apply-work`)
1. **Tn. Crab (Dev)** executes the checklist items surgically on the designated target files.
2. **Stanley (QA)** runs destructive checks (edge cases, timeouts, invalid data, regressions).
3. **Sandy Cheeks (PM)** verifies completion and renames the ticket:
   **`[PENDING]-` ➔ `[DONE]-TASK-DDMMYYYY-<slug>.md`**.

---

### 2. Urgent Bug Workflow (Token Saver)

When an error or regression is reported:
1. **Sandy Cheeks (PM)** immediately creates:
   `/myemployee/tasks/bugs/[PENDING]-BUG-DDMMYYYY-<slug>.md`
2. **Garry & Tn. Crab bypass reading the Master PRD**, inspect *only* the bug ticket, and apply a surgical line fix.
3. **Stanley (QA)** reproduces the fix and verifies zero regressions on existing code.
4. **Sandy Cheeks (PM)** renames the ticket to:
   **`[DONE]-BUG-DDMMYYYY-<slug>.md`**.

---

## Token Optimization & Fast Filtering

During active sessions, the AI agent filters tasks instantaneously:
```typescript
// AI scans task directory for active items
const pendingTasks = files.filter(f => f.startsWith('[PENDING]-'));
```
- Active tasks are identified in O(1) filename matching.
- Completed tasks (`[DONE]-*`) remain on disk for auditing and retrospectives without consuming context tokens during daily development.

---

## Language Protocol

- **In the Chat Room**: Team members converse warmly in conversational English or Indonesian.
- **All Written Files & Markdown Blocks**: **100% Strict English!**
  - All repository files (`PRD.md`, `DESIGN.md`, `TASK-*.md`, `BUG-*.md`, source code).
  - Any markdown preview blocks or tables rendered in chat are strictly in English.

---

## Acknowledgments & Heritage

`employee-agents` builds upon the spec-driven software development methodology pioneered by [OpenSpec](https://github.com/Fission-AI/openspec), code quality principles from [anti-slop](https://github.com/miqdadbadjuber/anti-slop), and character homages inspired by the world of SpongeBob SquarePants.

For complete attributions, inspirational roots, and legal disclaimers, please see [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md).

---

## Roadmap & Community

See our [ROADMAP.md](ROADMAP.md) for upcoming platform adapters (Cursor, Claude Code, Cline, Windsurf), role level-up skills, and autonomous squad debate features.

- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## License

MIT © [Ivan Nofick](https://github.com/ivannofick)
