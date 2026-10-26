# employee-agents: Roadmap & Release History

> How `employee-agents` evolves from a Bikini Bottom-themed multi-agent framework into an industry-standard virtual tech squad system across every major AI IDE.

---

## 🧭 Vision

The goal of `employee-agents` is to provide solo developers and engineering leaders with a self-sufficient, autonomous engineering team. Instead of asking one generic model to write architecture, tasks, code, design, and tests all at once (which leads to hallucinations and "AI slop"), `employee-agents` enforces separation of concerns through 6 specialized personas operating on native spec-driven principles.

---

## 📍 Where We Are (Current: v1.0.0)

The **v1.0.0** release establishes the complete core architecture:

- **Bikini Bottom Squad Roster**:
  - `product-owner`: **Patrick** (PRD & User Story Specification)
  - `ui-ux`: **Squidward** (Aesthetics, Design Tokens, Anti-Slop UI)
  - `tech-lead`: **Garry** (System Architecture, ADRs, Code Review Standards)
  - `project-manager`: **Sandy Cheeks** (Task WBS, Bug Tickets, `[DONE]-*` Lifecycle)
  - `developer`: **Tn. Crab** (Clean Code Implementation, Surgical Line Editing)
  - `qa`: **Stanley** (Destructive Testing, Edge Cases, Regression Shield)
- **Role Architecture**: Standardized `role.md` identity files coupled with modular `skill/default-skill.md` capability definitions.
- **Dual Operational Pipelines**:
  - **Feature Pipeline**: PRD ➔ UI/UX ➔ Architecture Design ➔ File:Line Tasks ➔ Build ➔ QA ➔ `[DONE]-*`.
  - **Fast Bug Pipeline**: Direct bug logging bypassing Master PRD ➔ Targeted surgical fix ➔ Regression QA ➔ `[DONE]-*`.
- **Frictionless Interactive CLI**:
  - Native TypeScript ESM executable (`employee-agents init`).
  - No locked default answers; free selection for AI environment and project type.
  - Dedicated modular i18n subsystem (`src/i18n/`) supporting English (default) and Indonesian (`--lang id`).
- **Initial Platform Adapter**: Native **Antigravity** driver skill at `.agent/skills/myemployee/SKILL.md`.

---

## 🗺️ Upcoming Releases & Milestones

```
  v1.0.0 (Current)        v1.1.0                  v1.2.0                  v2.0.0
 ┌────────────────┐     ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
 │ Core Squad     │ ──▶ │ Multi-IDE      │ ──▶ │ Skill Store    │ ──▶ │ Autonomous     │
 │ Antigravity    │     │ Adapters       │     │ & Level-Ups    │     │ Squad Debate   │
 │ Dual Pipelines │     │ (Cursor/Claude)│     │                │     │ & Verification │
 └────────────────┘     └────────────────┘     └────────────────┘     └────────────────┘
```

### v1.1.0: Multi-Platform Adapter Expansion
- [ ] **Cursor IDE Adapter (`adapters/cursor/`)**:
  - Native `.cursor/rules/myemployee.mdc` driver rule.
  - Automatic context injection of `/myemployee/PRD.md`.
- [ ] **Claude Code Adapter (`adapters/claude/`)**:
  - Native `CLAUDE.md` entrypoint hooking into `/myemployee/roles/`.
- [ ] **Cline / Roo Code Adapter (`adapters/cline/`)**:
  - `.clinerules` and `.roomodes` custom persona definitions for Patrick, Garry, Sandy, etc.
- [ ] **Windsurf Adapter (`adapters/windsurf/`)**:
  - `.windsurfrules` driver mapping.

### v1.2.0: Modular Employee Skills ("Level Up" System)
- [ ] **Secondary Skills per Role**:
  - Patrick: `skill/market-research.md`, `skill/user-feedback-analysis.md`.
  - Squidward: `skill/design-system-generator.md`, `skill/accessibility-wcag-audit.md`.
  - Garry: `skill/security-threat-modeling.md`, `skill/db-index-optimization.md`.
  - Tn. Crab: `skill/docker-containerization.md`, `skill/micro-benchmark.md`.
  - Stanley: `skill/load-testing.md`, `skill/e2e-playwright.md`.
- [ ] **Custom Role Scaffolder (`employee-agents add-role <name>`)**:
  - CLI command to add custom specialized roles (e.g., DevOps/SRE, Data Scientist).

### v1.3.0: Automated Token & Task Analytics
- [ ] **`employee-agents status` CLI command**:
  - Visual terminal dashboard showing active tasks vs completed `[DONE]-*` tasks.
  - Estimated token savings from `[DONE]-` prefix filtering.
  - Sprint velocity calculation based on task completion timestamps.

### v2.0.0: Autonomous Squad Deliberation & Checks-and-Balances
- [ ] **Inter-Agent Checks & Balances**:
  - Garry can actively challenge Patrick on unrealistic scopes before tasks are cut.
  - Stanley can autonomously trigger test runs and reject pull requests if edge cases fail.
  - Squidward can flag CSS/HTML slop in code review.

---

## 📋 Release History

| Version | Release Date | Summary of Changes |
|---------|--------------|--------------------|
| **v1.0.0** | 2026-10-26 | Initial public release. 6 squad roles, dual feature/bug pipelines, TypeScript CLI wizard, i18n support, and Antigravity adapter. |
