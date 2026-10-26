## Why

Developers using AI coding agents often face generic "AI slop", chaotic instructions, lack of quality control, and confusion over project architecture. While systems like `anti-slop` provide valuable linting and rules, complex real-world software development requires a structured engineering hierarchy with specialized separation of concerns (Product Owner, UI/UX Designer, Tech Lead, Project Manager, Developers, QA).

`employee-agents` solves this by introducing a standalone, virtual tech squad framework ("Bikini Bottom Tech Squad") that natively adapts the rigorous principles of Spec-Driven Development (like OpenSpec) without requiring any external CLI dependencies.

## What Changes

- **Core Package & TypeScript CLI**: Build an interactive CLI (`employee-agents init`) powered by modern TypeScript and Node.js.
- **Dedicated i18n Component**: Modular translation subsystem (`src/i18n/`) supporting default English and `--lang id` for Indonesian CLI prompts.
- **Interactive Wizard (Frictionless)**: 3-question setup (Target AI Environment with "(Coming Soon)" labels, Project Type: New vs Existing, and Project Name).
- **Universal Company Workspace (`/myemployee/`)**:
  - `PRD.md`: Master Product Requirements Document (Greenfield vision or Brownfield baseline).
  - `config.json`: Project settings and active environment.
  - `features/`: Dedicated directory for Patrick's (PO) modular Feature PRDs.
  - `tasks/`: Dedicated directory for Sandy Cheeks' (PM) task breakdowns (`TASK-DDMMYYYY-<slug>.md`) and bug tickets (`BUG-DDMMYYYY-<slug>.md`).
  - `roles/`: Six modular role directories, each containing `role.md` (Persona identity & calling user "Bos") and `skill/default-skill.md`.
- **Squad Roster**:
  - **Founder / Leader**: Bos (The user)
  - **Product Owner (PO)**: Patrick (`product-owner/`)
  - **UI/UX Designer**: Squidward (`ui-ux/`)
  - **Technical Lead**: Garry (`tech-lead/`)
  - **Project Manager (PM)**: Sandy Cheeks (`project-manager/`)
  - **Developer / Tech Team**: Tn. Crab (`developer/`)
  - **QA Engineer**: Stanley (`qa/`)
- **Intent Routing & Token Optimization**:
  - Feature pipeline vs Bug pipeline (bugs skip Master PRD and jump straight to surgical code fixes).
  - Mandatory target file and line range specification (`path/to/file.ts:L10-L25`).
  - Completed tasks are renamed with the `[DONE]-*` prefix for instant zero-token filtering.
- **Multi-Environment Adapter Architecture**: Isolated `adapters/` directory starting with `adapters/antigravity/` generating `.agent/skills/myemployee/SKILL.md`.

## Capabilities

### New Capabilities
- `cli-wizard`: Interactive terminal onboarding wizard with environment selection, project type (new vs existing), language flag, and non-destructive initialization.
- `role-system`: Six-role company squad directory architecture with clean identity definitions (`role.md`) and modular skill sets (`skill/default-skill.md`).
- `workflow-engine`: Dual-pipeline operational workflow (Feature PRD/Design vs Fast Bug Ticket), file/line precision enforcement, and `[DONE]-*` task lifecycle.
- `adapter-antigravity`: Antigravity skill connector and prompt driver that routes user intent to `/myemployee/`.

### Modified Capabilities
<!-- None: This is a greenfield creation of the employee-agents framework. -->

## Impact
- Initializes a new TypeScript CLI project in the workspace (`package.json`, `tsconfig.json`, `src/`).
- Adds modular blueprints in `templates/myemployee/` and `adapters/antigravity/`.
- Enables any repository to be initialized with `/myemployee/` and `.agent/skills/myemployee/`.
