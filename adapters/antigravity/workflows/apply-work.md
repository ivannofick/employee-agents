---
description: Execute a pending task ticket from tasks/pending/, move to in-progress/, and verify with QA.
---

Tn. Crab (Developer), Stanley (QA), and Sandy Cheeks (Project Manager) execute and verify pending task tickets.

 **MANDATORY LANGUAGE DIRECTIVE (ZERO SLOP)**:
All written code, code comments, task checklist updates, and verification logs **MUST BE 100% STRICT ENGLISH**! Never write Indonesian comments or documentation.

## Instructions

1. **Identify and Claim the Target Task**:
   - Inspect `/.myemployee/tasks/pending/` for task tickets (fallback to legacy `/.myemployee/tasks/features/` or `bugs/` if subfolders do not exist).
   - If Bos specified a slug or task name (e.g., `/apply-work payment`), find matching file.
   - If Bos ran `/apply-work` without arguments, select the oldest or highest priority task in `tasks/pending/`.
   - If NO pending tasks exist, inform Bos: *"No pending tasks found in the queue, Bos! Run `/share-knowledge` to plan a new feature."*
   - **Move to In-Progress**: Move the selected task file to `/.myemployee/tasks/in-progress/<filename>`.

2. **Execute Pre-Implementation Unit Test Gate (`## 2. Unit Test Plan`)**:
   - Inspect `## 1. Objective & Context` and `## 2. Unit Test Plan` in the active task file.
   - **If `Task Type` is `logic` or `ui-interactive`**:
     - When `qa` (Stanley) is active: **Stanley** writes the unit test file(s) asserting the expected behavior from `Objective & Context` BEFORE any application source code is modified, and updates `## 2. Unit Test Plan` checkboxes from `[ ]` to `[x]`.
     - When `qa` (Stanley) is NOT active: **Tn. Crab (Self-TDD)** writes the unit test file(s) first before editing application source code, and updates `## 2. Unit Test Plan` checkboxes from `[ ]` to `[x]`.
   - **If `Task Type` is `style-only` or `docs-config`**: Confirm `## 2. Unit Test Plan` is marked `N/A (Bypassed)` and proceed to Step 3.

3. **Execute Implementation (`## 3. Implementation Checklist` — Tn. Crab)**:
   - Read target files, exact line ranges, and any linked `VAC-*` criteria from the task file.
   - **PHYSICAL CODE WRITING MANDATORY (ZERO FAKE WORK / ZERO PHANTOM PROGRESS)**:
     - **Tn. Crab** MUST physically create and edit code files on disk via tool calls for all items in `## 3. Implementation Checklist`.
     - NEVER mark checkboxes as `[x]` without physically writing the code to disk. Marking checklist items without file edits is strictly prohibited.
   - **Strict Anti-Slop UI Craftsmanship**:
     - If the task touches Frontend/UI files, enforce genuine human-grade craftsmanship:
       - **ZERO fake status pills or pulsing dots** (e.g. 'Local Engine Online', 'System Active', `animate-pulse`, `animate-ping`).
       - **ZERO decorative sparkle icons** (`Sparkles`, `Wand2`) on search, inspect, or submit buttons.
       - **ZERO neon gradients or glow drop-shadows** (e.g. purple-to-blue, rose-to-indigo, sky-to-indigo, `shadow-sky-500/20`). Solid, intentional backgrounds only.
       - **ZERO fake SaaS badges or telemetry fluff** ('Pro SaaS', 'Daemon: Connected 14ms', fake token counters, floating eyebrow badges on tabs).
       - **ZERO em dashes (`—`)** in UI copy.
   - Inspect accompanying specs in `/.myemployee/features/<slug>/` (`PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`).
   - Adhere 100% to Squidward's **Design Tokens Table** in `DESIGN.md` (no arbitrary magic numbers or unstyled elements).
   - Execute surgical line edits until all unit tests in `## 2. Unit Test Plan` pass. Update `## 3. Implementation Checklist` checkboxes from `[ ]` to `[x]`.
   - **Cross-File Impact**: If modifying code impacts upstream/downstream callers, type contracts, or shared state outside the ticket scope, flag `[SEAM RISK]` in the task file (or in solo mode, expand `## 3. Implementation Checklist` directly).
   - Perform mobile self-check on 375px viewport before handing off to QA.

4. **Run Verification (`## 4. Verification & Audit Log` — Stanley & Garry)**:
   - **REAL TERMINAL EXECUTION MANDATORY (ZERO FAKE LOGS)**: Every pass/fail claim in `## 4. Verification & Audit Log` MUST come from an actual terminal command executed via tool calls. NEVER fabricate or hallucinate execution logs (e.g., claiming "pytest passed in 0.21s" or "Vite compiled in 53ms" without physically running the command). If test files or test runner do not exist, run real setup/test commands or state the true status honestly.
   - **Pillar A (Functional Destructive Testing)**: Stanley verifies Given-When-Then AC, boundary cases, null values, and runs project test suites confirming all unit tests pass.
   - **Pillar B (Visual Fidelity & VAC Audit)**: Stanley verifies every `[ ] VAC-*` checklist item from `DESIGN.md` (375px responsive check, contrast WCAG AA, touch targets, zero em dashes `—`).
   - **Pillar C (Unscripted Seam & Collateral Probe — Beyond the Checklist)**: Actively inspect adjacent callers, shared state, integration seams, and any `[SEAM RISK]` flagged during implementation for unstated assumptions that could fail in production.
   - Garry (Tech Lead) confirms architectural cleanliness and anti-lasagna standards.
   - Append verification logs under `## 4. Verification & Audit Log` in the task file in `tasks/in-progress/`.

5. **FOUNDER SOVEREIGNTY (HARD STOP)**:
   - **DO NOT MOVE TO `done/`**: The task file MUST REMAIN in `/.myemployee/tasks/in-progress/`. Task completion is the exclusive sovereignty of Bos via `/done-task`.
   - **DO NOT GIT PUSH**: Do NOT run `git push` and do NOT ask Bos whether to push. Pushing is reserved only for explicit commands in Bos's chat.

6. **Report to Bos**:
   - Report concise completion of unit tests, coding, and QA verification with clickable markdown file links `[file](file:///...)`.
   - Promptly await Bos's inspection.
