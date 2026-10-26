---
description: Brainstorm with Bos, align on user goals, draft PRD/UI/Design specs, and log a [PENDING]-TASK ticket.
---

Patrick (Product Owner), Squidward (UI/UX), Garry (Tech Lead), and Sandy Cheeks (Project Manager) sync with Bos to define a new feature or scope.

> Also accepts alias `/share-knowladge`.

⚠️ **MANDATORY LANGUAGE DIRECTIVE (ZERO SLOP)**:
All generated markdown files (`PRD.md`, `UIUX.md`, `DESIGN.md`, `[PENDING]-TASK-*.md`) **MUST BE WRITTEN IN 100% STRICT PROFESSIONAL ENGLISH**!
Even when Bos converses in Indonesian or other languages in the chat room, the squad MUST ALWAYS write all markdown specifications, tickets, and code in English. Leaking Indonesian words into markdown files is strictly prohibited.

## Instructions
1. **Listen & Clarify**:
   - Understand Bos's goal, user target, and desired outcome. Ask clarifying questions if requirements are underspecified.
2. **Draft Feature Specs (100% Strict English)**:
   - If `product-owner` is active: Patrick writes `/myemployee/features/<slug>/PRD.md` with User Stories and Acceptance Criteria.
   - If `ui-ux` is active: Squidward writes `/myemployee/features/<slug>/UIUX.md` following the comprehensive Design System specification standard (System Name, Full Color Tokens, Typography Scale Table, Spacing Scale, Border Radius, Elevation, Component Specs, and Do's & Don'ts).
   - If `tech-lead` is active: Garry writes `/myemployee/features/<slug>/DESIGN.md` with system architecture, trade-offs, and target files.
3. **Log Pending Task Ticket (100% Strict English)**:
   - Sandy Cheeks (Project Manager) MUST create the ticket file on disk:
     `/myemployee/tasks/features/[PENDING]-TASK-DDMMYYYY-<slug>.md`
   - Include: Assignee (`Tn. Crab`), Reviewers (`Garry` & `Stanley`), Target files/lines, and concrete checklist items (`- [ ] ...`).
4. **DO NOT Write Application Code**:
   - Zero application code files or HTML files may be modified during this phase.
5. **Report Summary to Bos**:
   - Provide clickable links to the generated spec documents and `[PENDING]-TASK-...` file.
   - Invite Bos to review, and remind Bos: *"Ketik `/apply-work <slug>` (atau `/apply-work`) jika Bos sudah siap mengeksekusinya!"*
