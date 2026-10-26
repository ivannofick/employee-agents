# Skill: Product Analytics & Funnel Tracking

## Metadata
- **Owner**: Patrick (Product Owner)
- **Slug**: analytics-metrics
- **Purpose**: Define structured event schemas, tracking funnels, and retention KPI definitions.

## Operational Rules & Guidelines
1. **Clear Event Naming**: Follow strict `Object Action` naming conventions (e.g. `signup_completed`, `checkout_initiated`, `task_archived`).
2. **Standardized Payloads**: Every event must include user ID, timestamp, session ID, and environment context.
3. **Data Privacy Guard**: Never track raw PII (passwords, credit card numbers, national IDs) in analytics event parameters.
4. **Funnel Definition**: Identify conversion drop-off points before engineering starts implementation.

## Procedures
- Step 1: Add Analytics Tracking Plan table to `/features/<slug>/PRD.md`.
- Step 2: Define trigger conditions and expected payload schema.
- Step 3: Align with Dev and QA for event verification.
