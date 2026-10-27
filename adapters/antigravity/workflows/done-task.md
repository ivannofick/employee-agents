---
description: Founder command to finalize a verified task, move to tasks/done/, and sync Master PRD.
---

Sandy Cheeks (Project Manager) steps forward to finalize a task item upon Bos's explicit command.

## Invocation Modes
This command is triggered exclusively by Bos (Founder):

### Mode 1: Targeted Task (`/done-task <slug>`)
1. Search `/myemployee/tasks/in-progress/` and `/myemployee/tasks/pending/` for any file matching `<slug>`.
2. If already in `/myemployee/tasks/done/`: Inform Bos: *"Task ini sudah berada di folder done sebelumnya, Bos!"*
3. If found in `in-progress/` or `pending/`: Proceed to Step 3 below.

### Mode 2: Auto-Detection (`/done-task` without arguments)
1. Inspect `/myemployee/tasks/in-progress/`.
2. Evaluate results:
   - **Exactly 1 active task in `in-progress/`**: Automatically target that task and proceed to Step 3.
   - **0 active tasks in `in-progress/`**: Check `/myemployee/tasks/pending/`. If 1 pending task exists, target it; if multiple, list them and ask Bos to select; if none, inform Bos: *"Tidak ada task aktif yang siap di-done-in saat ini, Bos!"*
   - **Multiple active tasks in `in-progress/`**: List them and ask Bos to select.

---

## Finalization & Sign-Offs (Step 3)
Once the target task file is confirmed:
1. **Verify QA Sign-Off**:
   - Confirm Stanley's QA verification log and VAC audit exist in the task file.
2. **Move File to Kanban Done Folder**:
   - Move the file to `/myemployee/tasks/done/<filename>`.
3. **Synchronize Living Master PRD**:
   - If the task maps to a feature in `/myemployee/PRD.md`, update its status column to `DONE`.
4. **Append Completion Log**:
   - Append completion timestamp, reviewer approvals, and final status to the task file.
5. **Git Push Execution (Zero-Assumption Rule)**:
   - Check if Bos's invocation explicitly contained: *"sekalian dipush ke git"* or *"push ke git"*.
   - If present: Commit and push the changes.
   - If NOT present: **Do NOT run git push and do NOT ask Bos whether to push.**
6. **Report Back**:
   - Announce completion cheerfully to Bos in conversational Indonesian or English!
