# Skill: Incident Postmortem & RCA

## Metadata
- **Owner**: Sandy Cheeks (Project Manager)
- **Slug**: incident-postmortem
- **Purpose**: Blameless Root Cause Analysis (RCA), timeline reconstruction, and preventive engineering safeguards.

## Operational Rules & Guidelines
1. **Blameless Culture**: Focus on system vulnerabilities and procedural gaps, never blaming individual contributors.
2. **5 Whys Methodology**: Drill past surface symptoms to locate fundamental root causes.
3. **Mandatory Action Items**: Assign JIRA / task items with deadlined remediation to ensure the failure mode cannot recur.

## Procedures
- Step 1: Reconstruct incident timeline (detection, response, resolution).
- Step 2: Document impact metrics (downtime duration, affected users, data loss).
- Step 3: Publish postmortem to `/.myemployee/POSTMORTEM-DDMMYYYY-<slug>.md` and present to Bos.
