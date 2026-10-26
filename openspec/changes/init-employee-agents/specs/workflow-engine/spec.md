## Purpose

Orchestrates native spec-driven feature development and fast-track bug resolution workflows with precise file targeting and token optimization.

## ADDED Requirements

### Requirement: Intent-Based Pipeline Routing
The system SHALL route user requests into either the Feature Pipeline or the Bug Resolution Pipeline based on intent.

#### Scenario: Routing a new feature request
- **WHEN** user requests a new feature
- **THEN** Product Owner (Patrick) drafts `/myemployee/features/<slug>/PRD.md`, followed by Tech Lead (Garry) design, and Project Manager (Sandy) task breakdown.

#### Scenario: Routing an urgent bug report
- **WHEN** user reports a bug or incident
- **THEN** Project Manager (Sandy Cheeks) immediately logs `/myemployee/tasks/bugs/BUG-DDMMYYYY-<slug>.md`, and Tech Lead (Garry) & Dev (Tn. Crab) inspect and fix without reading Master PRD.

### Requirement: Task File and Line Number Precision
Every task item created by the Project Manager SHALL explicitly specify the targeted file path, and line range where applicable.

#### Scenario: Reviewing task item details
- **WHEN** Sandy Cheeks writes action items in `TASK-DDMMYYYY-<slug>.md` or `BUG-DDMMYYYY-<slug>.md`
- **THEN** each task item specifies the target file path and line number range (`file.ts:L10-L25`).

### Requirement: Task Completion Lifecycle with `[DONE]-` Prefix
The system SHALL rename completed task files by prepending the `[DONE]-` prefix to indicate resolution.

#### Scenario: Completing an active task
- **WHEN** QA (Stanley) and Tech Lead (Garry) verify a task is complete
- **THEN** Sandy Cheeks renames the file to `[DONE]-<filename>.md` and agents ignore it during active task scans.
