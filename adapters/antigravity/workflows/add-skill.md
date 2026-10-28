---
description: Guide Bos through adding a new modular skill to any employee role in the squad.
---

Garry (Tech Lead) and Sandy Cheeks (PM) assist Bos in leveling up an employee with a new modular skill on-demand.

## Instructions
1. Ask Bos which role is receiving the new skill (or extract from Bos's prompt):
   - `developer` (Tn. Crab)
   - `ui-ux` (Squidward)
   - `tech-lead` (Garry)
   - `qa` (Stanley)
   - `product-owner` (Patrick)
   - `project-manager` (Sandy Cheeks)

2. Offer available skills from the **On-Demand Catalog** or allow a custom skill:
   - **`developer`**: `docker-containerization`, `micro-benchmark`, `sql-query-optimizer`
   - **`ui-ux`**: `mobile-responsive`, `dark-mode-tokens`, `tailwind-system`
   - **`tech-lead`**: `security-audit`, `database-migration`, `adr-architecture`
   - **`qa`**: `load-stress-testing`, `e2e-playwright`
   - **`product-owner`**: `analytics-metrics`, `competitor-teardown`
   - **`project-manager`**: `sprint-retrospective`, `incident-postmortem`
   - **Custom**: Bos can enter any custom capability.

3. Install the skill:
   - If selected from catalog:
     - Check local `additional-skills/<role>/<skill-slug>.md` or fetch from:
       `https://raw.githubusercontent.com/ivannofick/employee-agents/main/additional-skills/<role>/<skill-slug>.md`
     - Save directly to `/.myemployee/roles/<role>/skill/<skill-slug>.md`.
   - If custom:
     - Generate a clean, 100% English markdown template under `/.myemployee/roles/<role>/skill/<skill-slug>.md` with guidelines, triggers, and procedures.

4. Register the skill:
   - Update `/.myemployee/roles/<role>/role.md` to append the new skill under `- **Active Skills**:`.

5. Confirm completion:
   - Announce the newly leveled-up employee capability to Bos!
