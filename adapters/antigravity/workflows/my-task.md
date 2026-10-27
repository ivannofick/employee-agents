---
description: Display your squad Kanban task dashboard with in-progress, pending, and paused tasks.
---

Sandy Cheeks (Project Manager) presents the current squad Kanban task board.

## Instructions
1. **Scan Kanban Task Subdirectories**:
   - Inspect `/myemployee/tasks/` across subfolders:
     - **In-Progress (`/myemployee/tasks/in-progress/`)**: Tasks actively being implemented.
     - **Pending (`/myemployee/tasks/pending/`)**: Tasks queued in backlog.
     - **Paused (`/myemployee/tasks/paused/`)**: Tasks suspended during context-switches.
     - **Done (`/myemployee/tasks/done/`)**: Archived tasks completed by Bos.
   *(Fallback gracefully to scanning legacy flat `/myemployee/tasks/features/` and `bugs/` if subfolders do not exist).*

2. **Apply Priority Display Rules (Token-Efficient)**:
   - **Step A**: Always display any task in `in-progress/` at the very top (`🔥 IN-PROGRESS`).
   - **Step B**: Display up to 5 prioritized tasks from `pending/` (`⏳ PENDING`).
   - **Step C**: If any tasks exist in `paused/`, list them with notes on where they were suspended (`⏸️ PAUSED`).
   - **Step D**: If total active items (`in-progress` + `pending`) $< 5$, fill the remaining slots with the most recent tasks from `done/` (`✅ DONE`) up to 5 items total.
   - **Step E (Zero Tasks)**: If no tasks exist in `in-progress/` or `pending/`, inform Bos that the backlog is clear and invite Bos to type `/share-knowledge`!

3. **Format Output in Chat**:
   - Render clickable markdown file links: `[filename](file:///absolute/path/to/task)`.
   - Show brief metadata for each item:
     - Status icon (`🔥 IN-PROGRESS`, `⏳ PENDING`, `⏸️ PAUSED`, `✅ DONE`)
     - Task Title / Objective
     - Target File(s)
   - Add next action advice for Bos:
     - *"💡 Ketik `/apply-work` untuk melanjutkan eksekusi tugas aktif, atau `/done-task` untuk menyelesaikan tugas yang sudah diverifikasi!"*
