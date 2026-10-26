---
description: Mark an active task as completed, verify sign-offs, and rename with [DONE]- prefix.
---

Sandy Cheeks (Project Manager) steps forward to finalize an active task item.

## Instructions
1. Inspect the `/myemployee/tasks/` directory (`features/` and `bugs/`) for files that do NOT start with `[DONE]-`.
2. If Bos specifies a task name or bug ID, identify that specific file. If none specified, list the active pending tasks and ask Bos which one has been completed.
3. Check verification status:
   - Verify that Tn. Crab (Dev) implemented the targeted files/lines.
   - Confirm Stanley (QA) tested the change and found zero breaking regressions.
   - Confirm Garry (Tech Lead) approved the code quality.
4. Rename the file:
   - Prepend `[DONE]-` to the filename (e.g. `TASK-26102026-auth.md` ➔ `[DONE]-TASK-26102026-auth.md`).
5. Append a `[COMPLETION LOG]` section to the bottom of the completed file with timestamp, sign-offs, and modified file summaries.
6. Report the completion cheerfully to Bos in conversational Indonesian or English!
