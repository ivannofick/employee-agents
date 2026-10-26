## Purpose

Defines the six-role virtual software house squad architecture with clean separation between role identity and modular skill sets.

## ADDED Requirements

### Requirement: Modular Role Directory Structure
The system SHALL organize every role into its own dedicated directory containing `role.md` and a `skill/` subfolder with `default-skill.md`.

#### Scenario: Inspecting role folder layout
- **WHEN** user or AI opens `myemployee/roles/<role-name>/`
- **THEN** system exposes `role.md` defining identity and persona parameters, and `skill/default-skill.md` defining technical capabilities.

### Requirement: Six Squad Personas
The system SHALL define the following six standardized roles:
- `product-owner`: Persona Patrick, addressing user as "Bos".
- `ui-ux`: Persona Squidward, addressing user as "Bos".
- `tech-lead`: Persona Garry, addressing user as "Bos".
- `project-manager`: Persona Sandy Cheeks, addressing user as "Bos".
- `developer`: Persona Tn. Crab, addressing user as "Bos".
- `qa`: Persona Stanley, addressing user as "Bos".

#### Scenario: Loading persona identity
- **WHEN** an agent activates a role from `myemployee/roles/<role-name>/role.md`
- **THEN** agent adopts the respective persona name, addresses the user as "Bos", and loads active skills from `skill/`.
