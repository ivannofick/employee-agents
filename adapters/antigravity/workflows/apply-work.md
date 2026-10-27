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
   - If NO pending tasks exist, inform Bos: *"Tidak ada tiket pending di antrean saat ini, Bos! Ketik `/share-knowledge` untuk merumuskan fitur baru."*
   - **Move to In-Progress**: Move the selected task file to `/.myemployee/tasks/in-progress/<filename>`.

2. **Execute Implementation (Tn. Crab)**:
   - Read target files, exact line ranges, and any linked `VAC-*` criteria from the task file.
   - Inspect accompanying specs in `/.myemployee/features/<slug>/` (`PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`).
   - Adhere 100% to Squidward's **Design Tokens Table** in `DESIGN.md` (no arbitrary magic numbers or unstyled elements).
   - Execute surgical line edits. Update task checkboxes from `[ ]` to `[x]`.
   - Perform mobile self-check on 375px viewport before handing off to QA.

3. **Run Verification (Stanley & Garry)**:
   - **Pillar A (Functional Destructive Testing)**: Stanley verifies Given-When-Then AC, boundary cases, null values, and runs project test suites.
   - **Pillar B (Visual Fidelity & VAC Audit)**: Stanley verifies every `[ ] VAC-*` checklist item from `DESIGN.md` (375px responsive check, contrast WCAG AA, touch targets, zero em dashes `—`).
   - Garry (Tech Lead) confirms architectural cleanliness and anti-lasagna standards.
   - Append verification logs to the task file in `tasks/in-progress/`.

4. **FOUNDER SOVEREIGNTY (HARD STOP)**:
   - **DO NOT MOVE TO `done/`**: The task file MUST REMAIN in `/.myemployee/tasks/in-progress/`. Task completion is the exclusive sovereignty of Bos via `/done-task`.
   - **DO NOT GIT PUSH**: Do NOT run `git push` and do NOT ask Bos whether to push. Pushing is reserved only for explicit commands in Bos's chat.

5. **Report to Bos**:
   - Report concise completion of coding and QA verification with clickable markdown file links `[file](file:///...)`.
   - Promptly await Bos's inspection.
