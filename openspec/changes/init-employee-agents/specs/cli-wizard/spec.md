## Purpose

Provides a clean interactive terminal wizard to initialize the employee-agents framework into any new or existing project with zero friction.

## ADDED Requirements

### Requirement: Interactive Onboarding Prompts
The CLI SHALL present an interactive setup wizard asking for target AI environment, project type, and project name without forcing default selections.

#### Scenario: Running init wizard with default English
- **WHEN** user executes `employee-agents init`
- **THEN** system displays prompts in English with free selection for AI environments, project type (New vs Existing), and project name.

#### Scenario: Running init wizard with Indonesian language flag
- **WHEN** user executes `employee-agents init --lang id` or `-l id`
- **THEN** system displays prompts translated into Bahasa Indonesia while keeping generated files in English.

### Requirement: Non-destructive Initialization
The system SHALL NOT overwrite or delete existing user source code or dependency manifests when initializing in an existing codebase.

#### Scenario: Initializing in existing project
- **WHEN** user selects `Existing Codebase` during wizard execution
- **THEN** system creates `/myemployee/` and the adapter without modifying any existing application files.
