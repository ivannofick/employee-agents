## Context

See `proposal.md` for motivation and background.

The objective is to establish the `employee-agents` codebase as a TypeScript CLI package with zero runtime dependencies on OpenSpec CLI, providing a native spec-driven multi-role engineering squad inside AI coding agents.

## Goals / Non-Goals

**Goals:**
- Provide a clean TypeScript CLI runtime targeting modern Node.js (ESM).
- Create a dedicated i18n subsystem (`src/i18n/`) with `en.ts` and `id.ts` dictionaries.
- Provide a frictionless 3-step interactive onboarding wizard (`@clack/prompts` or standard input).
- Implement universal company templates in `templates/myemployee/` including all 6 roles with `role.md` and `skill/default-skill.md`.
- Implement Antigravity driver skill template in `adapters/antigravity/`.
- Ensure non-destructive initialization for existing codebases.

**Non-Goals:**
- Building adapters for Cursor, Claude Code, Cline, and Windsurf in this initial phase (they are marked `Coming Soon`).
- Building a web dashboard or external SaaS service.

## Decisions

### 1. TypeScript + Modern ESM Runtime
- **Rationale**: Clean type-safety, fast execution, seamless distribution via `npx` or `npm`.
- **Alternatives considered**: Bash script (inflexible for complex i18n and multi-platform logic), Python (requires Python runtime on user machine which is less common in pure JS/PHP workspaces).

### 2. Standalone Blueprint Isolation (`templates/myemployee/`)
- **Rationale**: Isolates the blueprint files from the CLI compiler. The CLI generator copies files directly to the user's workspace without bundling mess.
- **Alternatives considered**: Embedding templates as string literals in TS code (hard to maintain and audit).

### 3. Role Layout: `role.md` + `skill/default-skill.md`
- **Rationale**: Clean separation of identity/persona parameters from actionable skill instructions. Allows employees to gain additional skills in the future (`skill/<skill-name>.md`) without modifying the role contract.
- **Alternatives considered**: Flat single markdown file per role (mixes identity, goals, and technical procedures into one huge unstructured doc).

### 4. Fast Task Lifecycle with `[DONE]-` Prefix
- **Rationale**: Prefix-based string matching (`file.startsWith('[DONE]-')`) is O(1) in directory scanning, saving tokens by preventing AI agents from ingesting completed task history.
- **Alternatives considered**: Archiving tasks into a subfolder `/archive/` (causes broken relative links and extra directory hopping).

## Risks / Trade-offs

- **[Risk] User initializes in non-Git directory** → *Mitigation*: The CLI checks for Git repository status and suggests `git init` if not detected.
- **[Risk] Antigravity skill path discovery differs across versions** → *Mitigation*: Places driver skill in standard `.agent/skills/myemployee/SKILL.md` which is auto-loaded by Antigravity in workspace roots.
