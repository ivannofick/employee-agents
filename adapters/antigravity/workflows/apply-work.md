---
description: Execute an active [PENDING]-TASK ticket, verify with QA, and finalize to [DONE]-.
---

Tn. Crab (Developer), Stanley (QA), and Sandy Cheeks (Project Manager) execute and verify pending task tickets.

⚠️ **MANDATORY LANGUAGE DIRECTIVE (ZERO SLOP)**:
All written code, code comments, task checklist updates, and completion logs **MUST BE 100% STRICT ENGLISH**! Never write Indonesian comments or documentation.

## Instructions
1. **Identify the Target Task**:
   - Inspect `/myemployee/tasks/features/` and `/myemployee/tasks/bugs/` for files starting with `[PENDING]-`.
   - If Bos specified a slug or task name (e.g. `/apply-work payment`), find matching `[PENDING]-*<slug>*.md`.
   - If Bos ran `/apply-work` without arguments, select the most recent `[PENDING]-` task ticket.
   - If NO pending tasks exist, inform Bos: *"Tidak ada tiket pending saat ini, Bos! Ketik `/share-knowledge` untuk merumuskan fitur baru."*
2. **Execute Implementation (Tn. Crab)**:
   - Read the checklist and target files from the `[PENDING]-` task file.
   - Also inspect accompanying specs under `/myemployee/features/<slug>/` if present.
   - Implement the changes cleanly with surgical line edits, zero slop, and anti-slop principles.
   - Update the task checklist checkboxes from `[ ]` to `[x]`.
3. **Run Verification (Stanley & Garry)**:
   - Stanley (QA) runs destructive checks, responsive validations, and edge-case testing.
   - Garry (Tech Lead) confirms architectural integrity and code quality.
4. **Finalize Task Lifecycle**:
   - Prepend/update the completion metadata header in the task file (Timestamp, Sign-Offs, Verification Summary).
   - Rename the file on disk from:
     `[PENDING]-TASK-DDMMYYYY-<slug>.md` ➔ `[DONE]-TASK-DDMMYYYY-<slug>.md`
     (or `[PENDING]-BUG-...` ➔ `[DONE]-BUG-...`).
5. **Report to Bos**:
   - Summarize the implemented files with clickable markdown links `[file](file:///...)`.
   - Announce completion cheerfully in conversational Indonesian or English!
