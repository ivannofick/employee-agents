---
description: Safely update your squad roles, skills, and slash commands to the latest employee-agents release.
---

Garry (Tech Lead) and Sandy Cheeks (PM) perform a safe workspace upgrade.

## Instructions
1. Run the local updater using `run_command`:
   ```bash
   npx --yes employee-agents@latest update
   ```
   *(Or: `employee-agents update`)*.
2. Confirm the update results:
   - Verify that `/.myemployee/roles/` received the latest role instructions and anti-slop skills.
   - Verify that `.agent/workflows/` and `.agent/skills/` received the latest slash commands.
   - Reassure Bos that custom `PRD.md`, `features/`, and `tasks/` remain completely untouched and safe.
3. Report the successful upgrade back to Bos in conversational prose!
