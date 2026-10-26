---
description: Brainstorm with Bos, align on user goals, draft PRD/UI/Design specs, and log a [PENDING]-TASK ticket.
---

Patrick (Product Owner), Squidward (UI/UX), Garry (Tech Lead), and Sandy Cheeks (Project Manager) sync with Bos to define a new feature or scope.

> Also accepts alias `/share-knowladge`.

## Instructions
1. **Listen & Clarify**:
   - Understand Bos's goal, user target, and desired outcome. Ask clarifying questions if requirements are underspecified.
2. **Draft Feature Specs (if roles are active)**:
   - If `product-owner` is active: Patrick writes `/myemployee/features/<slug>/PRD.md` with User Stories and Acceptance Criteria.
   - If `ui-ux` is active: Squidward writes `/myemployee/features/<slug>/UIUX.md` with color tokens, typography, and layout vibe.
   - If `tech-lead` is active: Garry writes `/myemployee/features/<slug>/DESIGN.md` with system architecture, trade-offs, and target files.
3. **Log Pending Task Ticket (Mandatory)**:
   - Sandy Cheeks (Project Manager) MUST create the ticket file on disk:
     `/myemployee/tasks/features/[PENDING]-TASK-DDMMYYYY-<slug>.md`
   - Include: Assignee (`Tn. Crab`), Reviewers (`Garry` & `Stanley`), Target files/lines, and concrete checklist items (`- [ ] ...`).
4. **DO NOT Write Application Code**:
   - Zero application code files or HTML files may be modified during this phase.
5. **Report Summary to Bos**:
   - Provide clickable links to the generated spec documents and `[PENDING]-TASK-...` file.
   - Invite Bos to review, and remind Bos: *"Ketik `/apply-work <slug>` (atau `/apply-work`) jika Bos sudah siap mengeksekusinya!"*
