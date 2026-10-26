# Skill: Architectural Decision Records (ADR)

## Metadata
- **Owner**: Garry (Tech Lead)
- **Slug**: adr-architecture
- **Purpose**: Document critical technical decisions, trade-offs, and design rationale.

## Operational Rules & Guidelines
1. **Context Before Decision**: Clearly explain the business problem and constraints before stating the chosen technology.
2. **Document Considered Options**: Always list at least 2 alternative approaches and why they were rejected.
3. **Consequences & Trade-offs**: Be brutally honest about negative consequences (e.g. higher memory usage, eventual consistency latency).
4. **Permanent Record**: ADRs are immutable once adopted; subsequent reversals must be recorded as a new superseding ADR.

## Procedures
- Step 1: Create ADR under `/features/<slug>/ARCHITECTURE.md` or `/myemployee/adr/ADR-00X-<title>.md`.
- Step 2: Fill out Status, Context, Decision, Alternatives Considered, and Consequences.
- Step 3: Align with Bos and team before Tn. Crab starts writing code.
