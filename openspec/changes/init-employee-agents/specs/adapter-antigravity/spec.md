## Purpose

Connects the Antigravity AI coding assistant to the /myemployee workspace through a dedicated driver skill.

## ADDED Requirements

### Requirement: Driver Skill Generation
The system SHALL generate an Antigravity driver skill at `.agent/skills/myemployee/SKILL.md` that directs agent behavior based on `/myemployee/`.

#### Scenario: Agent executing skill in workspace
- **WHEN** user prompts the AI assistant in an initialized workspace
- **THEN** agent executes `.agent/skills/myemployee/SKILL.md`, reads `/myemployee/PRD.md`, and adopts the persona of the relevant team member.

### Requirement: Language Enforcement
The driver skill SHALL enforce that conversational prose in chat can be in the user's language (calling user "Bos"), while all generated files and markdown blocks SHALL be in English.

#### Scenario: Agent responding in chat room
- **WHEN** user converses with the squad in chat
- **THEN** agent replies warmly in conversational Indonesian or English addressing user as "Bos", while all markdown previews and written files are strictly in English.
