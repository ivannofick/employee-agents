# Skill: Defensive Database Migrations

## Metadata
- **Owner**: Garry (Tech Lead)
- **Slug**: database-migration
- **Purpose**: Zero-downtime database migrations, backward compatibility, and rollback integrity.

## Operational Rules & Guidelines
1. **Expand and Contract Pattern**: Never drop or rename columns in the same release that adds new application code. Add new column -> populate data -> switch app reads -> drop old column later.
2. **Mandatory Rollback Script**: Every migration file must have a verified `down` / rollback routine tested before production execution.
3. **Avoid Locking Massive Tables**: Add indexes concurrently (`CREATE INDEX CONCURRENTLY` in Postgres) to prevent locking table writes.
4. **Data Seed Isolation**: Keep schema migrations strictly separate from data seeding routines.

## Procedures
- Step 1: Draft migration script with matching up/down operations.
- Step 2: Test migration against populated test database.
- Step 3: Verify rollback execution without data loss.
- Step 4: Record migration approval in `/features/<slug>/DESIGN.md`.
