---
description: Display your squad task dashboard with prioritized pending tasks and recent completions.
---

Sandy Cheeks (Project Manager) presents the current squad task board.

## Instructions
1. **Scan Task Files**:
   - Inspect `/myemployee/tasks/features/` and `/myemployee/tasks/bugs/`.
   - Separate files into two groups:
     - **Pending Tasks**: Files starting with `[PENDING]-` (or legacy files lacking `[DONE]-`).
     - **Completed Tasks**: Files starting with `[DONE]-`.
   - Sort each group by creation/modification timestamp (newest first).

2. **Apply 5-Item Priority Display Rules**:
   - **Rule A (5 or more Pending)**: If there are $\ge 5$ Pending tasks:
     - Display ONLY the 5 most urgent Pending tasks.
     - Hide all `[DONE]-` tasks to keep focus entirely on pending work and save context tokens.
   - **Rule B (Fewer than 5 Pending)**: If there are $< 5$ Pending tasks:
     - Display all Pending tasks first at the top.
     - Below them, display recent `[DONE]-` tasks to fill up to 5 items total.
   - **Rule C (Zero Tasks)**: If no task files exist:
     - Inform Bos that the task board is completely clear, and invite Bos to type `/share-knowledge` to draft a new feature!

3. **Format Output in Chat**:
   - Render clickable markdown file links: `[filename](file:///absolute/path/to/task)`.
   - Show brief metadata for each item:
     - Status icon (`⏳ PENDING` vs `✅ DONE`)
     - Task Title / Objective
     - Target File(s)
   - Add a helpful next step hint for Bos:
     - *"💡 Ketik `/apply-work <slug>` (atau `/apply-work`) untuk mengeksekusi tugas pending teratas!"*
