---
description: Mark an active task as completed, verify sign-offs, and rename with [DONE]- prefix.
---

Sandy Cheeks (Project Manager) steps forward to finalize a task item.

## Invocation Modes
This command supports two invocation patterns:

### Mode 1: Targeted Task (`/done-task <slug>`)
*(Example: `/done-task google-oauth` or `/done-task BUG-26102026-register-500`)*
1. Search `/myemployee/tasks/` (`features/` and `bugs/`) for any file whose name contains `<slug>`.
2. Check if the matching file already starts with `[DONE]-`:
   - If already completed: Inform Bos: *"Task ini sudah ditandai selesai sebelumnya, Bos!"*
   - If pending: Proceed to Step 3 below.

### Mode 2: Auto-Detection (`/done-task` without arguments)
1. Scan `/myemployee/tasks/` (`features/` and `bugs/`) for files starting with `[PENDING]-` (or lacking `[DONE]-`).
2. Evaluate results:
   - **0 active tasks found**: Report to Bos: *"Semua task sudah beres, tidak ada task aktif yang pending saat ini, Bos!"*
   - **Exactly 1 active task found**: Automatically target that task, display its name to Bos, and proceed to Step 3.
   - **Multiple active tasks found**: Display a numbered list of all active pending tasks and ask Bos: *"Ada beberapa task aktif yang pending. Mau saya tandai selesai yang nomor berapa atau sebutkan namanya, Bos?"* Block until Bos selects.

---

## Finalization & Sign-Offs (Step 3)
Once the target task file is confirmed:
1. **Verify Implementation**:
   - Confirm that Tn. Crab (Dev) implemented the targeted files and line ranges specified in the task checklist.
   - Confirm that Stanley (QA) verified the changes and found zero regressions or breaking edge-cases.
   - Confirm that Garry (Tech Lead) approved the architectural integrity.
2. **Rename File**:
   - If the file starts with `[PENDING]-`, replace `[PENDING]-` with `[DONE]-` (e.g., `[PENDING]-TASK-26102026-auth.md` ➔ `[DONE]-TASK-26102026-auth.md`).
   - If the file does not have `[PENDING]-`, prepend `[DONE]-`.
3. **Append Completion Log**:
   - Add a `[COMPLETION LOG]` section to the bottom of the task file with timestamp, sign-offs, and summary of changes.
4. **Report Back**:
   - Announce the completion cheerfully to Bos in conversational Indonesian or English!
