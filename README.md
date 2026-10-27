# employee-agents

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.7-blue.svg)
![Antigravity](https://img.shields.io/badge/adapter-antigravity-orange.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A Virtual Software Engineering Team Framework**: Run an autonomous, 7-role engineering squad (Technical Analyst, Product Owner, UI/UX Designer, Tech Lead, Project Manager, Developer, QA Engineer) directly inside your AI coding assistant.

[Quick Start](#-quick-start) • [The Squad](#-the-squad-roster) • [Slash Commands](#-built-in-slash-commands) • [Operational Lifecycle](#-operational-lifecycle) • [Directory Structure](#-directory-structure) • [Token Footprint](TOKEN_FOOTPRINT.md) • [Acknowledgments](ACKNOWLEDGMENTS.md) • [Roadmap](ROADMAP.md)

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

`employee-agents` organizes your AI into a **7-role engineering team** running natively inside your workspace. Operating on strict **Spec-Driven Development** principles, each role possesses bounded responsibilities, dedicated skill files, and clear operational gates.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      LEAD ARCHITECT / FOUNDER (User)                   │
│         "Build feature X"  •  "Fix bug Y"  •  "Langsung sekarang!"     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │             ADAPTER LAYER (.agent/skills/)             │
       │  - Reads Living Master PRD (/myemployee/PRD.md)        │
       │  - Evaluates Intent: Feature, Bug, or Fast-Track       │
       └────────────────────────────┬───────────────────────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
      [ PHASE 1: /share-knowledge ]          [ FAST-TRACK / BUG PIPELINE ]
                 │                                     │
    1. Larry (Technical Analyst)             1. Larry (Technical Analyst)
       -> Feasibility & Data Boundaries         -> 30-Sec Feasibility Check
                 │                                     │
    2. Patrick (Product Owner)               2. Patrick & Sandy
       -> features/<slug>/PRD.md                -> Micro-PRD (10-15 lines)
       -> Syncs Master PRD                      -> tasks/pending/TASK-*.md
                 │                                     │
    3. Squidward (UI/UX)                               ▼
       -> Mobile-First Tokens & VAC          [ PHASE 2: /apply-work ]
                 │                                     │
    4. Garry (Tech Lead)                     3. Sandy Cheeks (PM)
       -> Architecture & Anti-Lasagna           -> Moves to: tasks/in-progress/
                 │                                     │
    5. Sandy Cheeks (PM)                     4. Tn. Crab (Developer)
       -> tasks/pending/TASK-*.md               -> Surgical token-adherent code
                 │                                     │
                 ▼                           5. Stanley (QA Engineer)
      [ PHASE 2: /apply-work ]                  -> Destructive tests & VAC audit
                 │                                     │
    6. Sandy moves task to:                            ▼
       tasks/in-progress/                    [ PHASE 3: /done-task ]
                 │                                     │
    7. Tn. Crab implements code              6. Founder Sign-Off (HARD STOP)
                 │                              -> Sandy moves to: tasks/done/
    8. Stanley audits VAC & QA                  -> Updates PRD to DONE
                 │                                     │
                 ▼                                     ▼
      [ PHASE 3: /done-task ]               [ Zero Auto-Push Guarantee ]
    9. Founder signs off task               (Push strictly gated on prompt)
       -> Sandy moves to: tasks/done/
       -> Updates Master PRD status
```

---

## The Squad Roster

| Role (Directory) | Persona | Responsibility | Target Artifact |
|---|---|---|---|
| **`tech-analyst`** | **Larry the Lobster** | Technical feasibility, data payload boundaries, and fast-track triage. | Feasibility review & co-authoring PRDs |
| **`product-owner`** | **Patrick** | User research, user journey mapping, Given-When-Then AC, and Master PRD sync. | `/features/<slug>/PRD.md` & `/PRD.md` |
| **`ui-ux`** | **Squidward** | Mobile-first aesthetic systems, CSS design tokens, and testable VAC checklists. | `/features/<slug>/DESIGN.md` |
| **`tech-lead`** | **Garry** | System architecture, ADRs, anti-lasagna code review, and context-switch guard. | `/features/<slug>/ARCHITECTURE.md` |
| **`project-manager`** | **Sandy Cheeks** | Kanban task management (`pending/`, `in-progress/`, `paused/`, `done/`), `File:Line` targeting. | `/tasks/pending/TASK-*.md` |
| **`developer`** | **Tn. Crab** | Token-adherent clean code execution, surgical line editing, and 375px mobile self-testing. | Source code files |
| **`qa`** | **Stanley** | Destructive functional testing, visual fidelity VAC audits, and anti-slop shield. | QA sign-offs & verification reports |

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
npx employee-agents add-role tech-analyst

# Remove a role from your squad:
npx employee-agents remove-role developer
```

---

## Built-In Slash Commands (`/`)

When using Antigravity, the framework equips you with interactive slash commands in your chat room:

| Slash Command | Handler | Description |
|---|---|---|
| **`/share-knowledge`** | Larry, Patrick, Squidward, Garry, Sandy | **Phase 1: Thinking & Spec**. Aligns on goals, evaluates technical feasibility, drafts feature PRD, Mobile-First tokens & VAC, and architecture, then logs `tasks/pending/TASK-*.md` and updates Living Master PRD. Zero code is written in this phase. *(Also accepts alias `/share-knowladge`)*. |
| **`/apply-work`** | Sandy (PM), Tn. Crab (Dev), Stanley (QA) | **Phase 2: Execution**. Moves target task to `tasks/in-progress/`, surgically implements code, and executes QA & VAC audits. Task stays in `in-progress/` (zero auto-done, zero nagging for git push). |
| **`/done-task`** | Sandy Cheeks (PM) | **Phase 3: Founder Sign-Off**. Founder's dedicated command to mark a verified task complete. Moves task from `tasks/in-progress/` to `tasks/done/` and updates Master PRD feature status to `DONE`. |
| **`/my-task`** | Sandy Cheeks (PM) | **Kanban Dashboard**. Inspects `tasks/` and displays active in-progress ticket, prioritized pending tasks, and paused tickets. Preserves tokens by ignoring `done/`. |
| **`/add-skill`** | Garry & Sandy | Interactive workflow to level up any employee with a new modular skill under `/myemployee/roles/<role>/skill/`. |
| **`/status-token`** | Garry (Tech Lead) | Reports the active AI model, total context window capacity (1M tokens), estimated tokens consumed, remaining quota, and efficiency advice. |
| **`/update-me`** | Garry & Sandy | Safely upgrades your squad roles, anti-slop skills, and workflows to the latest release while keeping your PRDs and tasks intact. |

---

## Directory Structure (`/myemployee/`)

Each role possesses a clean **`role.md`** defining its identity, and an extensible **`skill/`** folder containing its technical capabilities:

```text
myemployee/
├── PRD.md                         # Living Master PRD (Founder Goal & Auto-Updating Feature Index)
├── config.json                    # Project configuration & active roles
│
├── features/                      # Modular Feature Specs created during /share-knowledge
│   └── <feature-slug>/
│       ├── PRD.md                 # User Stories & Acceptance Criteria (Patrick)
│       ├── DESIGN.md              # Mobile-First Tokens, State Matrix & VAC Checklists (Squidward)
│       └── ARCHITECTURE.md        # Architecture, ADRs & Anti-Lasagna Boundaries (Garry)
│
├── tasks/                         # Kanban task subdirectories managed by Sandy Cheeks (PM)
│   ├── pending/                   # Backlog tickets awaiting execution
│   ├── in-progress/               # Active task currently being coded by Tn. Crab
│   ├── paused/                    # Suspended tasks during priority shifts
│   └── done/                      # Verified tasks archived by founder via /done-task
│
└── roles/                         # Modular Role Definitions & Capabilities
    ├── tech-analyst/
    │   ├── role.md                # Persona: Larry | Focus: Technical Feasibility & Fast-Track
    │   └── skill/
    │       └── default-skill.md   # API boundaries, schema triage & fast-track checks
    ├── product-owner/
    │   ├── role.md                # Persona: Patrick | Focus: Product Vision & User Stories
    │   └── skill/
    │       └── default-skill.md   # PRD & User Story drafting, Master PRD sync
    ├── ui-ux/
    │   ├── role.md                # Persona: Squidward | Focus: Mobile-First Systems & VAC
    │   └── skill/
    │       └── default-skill.md   # 375px compact layout, design tokens, VAC checklists
    ├── tech-lead/
    │   ├── role.md                # Persona: Garry | Focus: System Architecture & ADRs
    │   └── skill/
    │       └── default-skill.md   # Anti-lasagna architecture, context-switch guard
    ├── project-manager/
    │   ├── role.md                # Persona: Sandy Cheeks | Focus: Kanban Task Management
    │   └── skill/
    │       └── default-skill.md   # Kanban tracking, file:line targeting, dashboard
    ├── developer/
    │   ├── role.md                # Persona: Tn. Crab | Focus: Clean Code & Surgical Editing
    │   └── skill/
    │       └── default-skill.md   # Token-adherent coding & 375px visual self-testing
    └── qa/
        ├── role.md                # Persona: Stanley | Focus: QA & VAC Auditing
        └── skill/
            └── default-skill.md   # Destructive testing & Visual Acceptance Criteria audit
```

---

## Operational Lifecycle

### 1. Three-Phase Feature Workflow (`/share-knowledge` ➔ `/apply-work` ➔ `/done-task`)

To prevent AI from prematurely generating unreviewed code, features strictly follow a three-phase gated process:

#### Phase 1: Thinking & Spec (`/share-knowledge`)
1. **Larry (Tech Analyst)** evaluates technical feasibility, data schemas, and API boundaries.
2. **Patrick (PO)** writes `/myemployee/features/<slug>/PRD.md` with User Stories & Acceptance Criteria, and syncs an executive summary to the Living Master PRD (`/myemployee/PRD.md`).
3. **Squidward (UI/UX)** writes `/myemployee/features/<slug>/DESIGN.md` defining Mobile-First design tokens (360px–375px), state matrices, and binary Visual Acceptance Criteria (`[ ] VAC-*`).
4. **Garry (Tech Lead)** writes `/myemployee/features/<slug>/ARCHITECTURE.md` defining libraries, schema, security, and target files with zero boilerplate lasagna.
5. **Sandy Cheeks (PM)** generates the task ticket on disk in `/myemployee/tasks/pending/TASK-DDMMYYYY-<slug>.md` with **mandatory target file and line ranges**:
   ```markdown
   - [ ] Implement Google OAuth Callback Handler
     - File: `src/api/auth/google/callback.ts`
   - [ ] Update User Session Store
     - File: `src/services/session.ts:L45-L60`
   - [ ] VAC-01: Verify 375px Compact Layout
     - File: `src/components/auth/AuthModal.tsx`
   ```
*Result: Specs, tokens, and VAC checklists are locked on disk. Zero application code has been written yet.*

#### Phase 2: Execution & Verification (`/apply-work`)
1. **Sandy Cheeks (PM)** moves the target task file from `tasks/pending/` to `tasks/in-progress/`.
2. **Tn. Crab (Dev)** executes the checklist items surgically on designated target files, adhering strictly to design tokens and testing at 375px mobile viewport.
3. **Stanley (QA)** runs destructive functional checks and audits each Visual Acceptance Criteria (`[ ] VAC-*`) item.
4. **Founder Sovereignty Hard Stop**: The task file **remains in `tasks/in-progress/`**. AI is strictly forbidden from auto-marking tasks done or asking about git push.

#### Phase 3: Founder Sign-Off (`/done-task`)
1. Founder reviews the squad's work and triggers `/done-task <slug>`.
2. **Sandy Cheeks (PM)** moves the task file from `tasks/in-progress/` to `tasks/done/`.
3. Sandy updates the feature status in `/myemployee/PRD.md` to `DONE`.
4. Git push is executed **only if the founder prompt explicitly commands** *"sekalian dipush ke git"* or *"push ke git"*.

---

### 2. Fast-Track & Urgent Bug Protocols

- **30-Second Fast-Track**: When the founder requests immediate coding (*"Langsung kerjakan sekarang!"*), Larry provides a 3-bullet technical feasibility triage, Patrick writes a lean 10–15 line Micro-PRD on disk, Sandy creates `tasks/pending/TASK-*.md`, and Tn. Crab begins implementation immediately without context drift.
- **Urgent Bug Workflow**: Sandy logs the bug ticket directly in `tasks/pending/TASK-DDMMYYYY-<slug>.md` with `[BUG]` tag. Garry and Tn. Crab bypass reading the Master PRD, inspect *only* the targeted bug ticket, and apply surgical line edits. Stanley reproduces and verifies the fix with zero regressions.
- **Context-Switch Guard**: When the founder shifts priorities mid-stream (e.g. pivoting from Bug A to Feature B), Garry reports repository status and presents 2 clean options: wrap up in 1 minute or park active work into `/myemployee/tasks/paused/`.

---

## Token Efficiency & Footprint

`employee-agents` uses a **lean, modular architecture**: each persona's operational rules are isolated in a compact `role.md` and `skill/default-skill.md`. Monolithic framework bloat is avoided through lazy role loading, Kanban subfolder isolation, and Living Master PRD index tables.

### 📊 Estimated Context Consumption Ranges

| Operational Scenario | Active Personas / Artifacts | Estimated Context Range |
|---|---|---|
| **Quick Component or Bugfix** *(e.g. Button component)* | Tn. Crab (Developer) + 1 active task ticket | **~500 – 1,200 tokens** |
| **Urgent Bug Pipeline** *(Targeted line hotfix)* | Tn. Crab (Developer) + 1 targeted bug ticket | **~400 – 900 tokens** |
| **Phase 1: Feature Spec & Thinking** *(`/share-knowledge`)* | Larry, Patrick, Squidward, Garry | **~2,500 – 4,000 tokens** |
| **Phase 2: Feature Execution** *(`/apply-work`)* | Tn. Crab (Dev) + Stanley (QA) | **~900 – 2,000 tokens** |
| **All 7 Roles Combined (Base Footprint)** | All 7 personas (`role.md` + `default-skill.md`) | **~4,500 – 5,500 tokens** *(< 0.6% of 1M context)* |

> 📖 **Deep Dive**: For complete breakdown methodology, architectural drivers, and comparisons with monolithic multi-agent frameworks, see **[TOKEN_FOOTPRINT.md](TOKEN_FOOTPRINT.md)**.

---

## Language Protocol

- **In the Chat Room**: Team members converse warmly in conversational English or Indonesian.
- **All Written Files & Markdown Blocks**: **100% Strict English!**
  - All repository files (`PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, `TASK-*.md`, source code).
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
