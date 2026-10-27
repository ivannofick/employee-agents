# Additional Skills Catalog

Welcome to the **employee-agents On-Demand Skill Registry**. 

To keep your workspace ultra-lean and context windows optimized, these skills are **not** bundled or pre-downloaded upon initialization. You can browse this written catalog and selectively clone/install only the skills you need.

---

## Developer (`developer` - Tn. Crab)

| Skill Slug | Name | Description |
|---|---|---|
| **`docker-containerization`** | Docker Containerization | Clean, multi-stage Dockerfile and docker-compose setup without bloat. |
| **`micro-benchmark`** | Micro Benchmark & Profiling | Line-level execution time and memory profiling for critical hot paths. |
| **`sql-query-optimizer`** | SQL Query Optimizer | Defensive query indexing, EXPLAIN plan analysis, and N+1 query elimination. |

---

## UI/UX Designer (`ui-ux` - Squidward)

| Skill Slug | Name | Description |
|---|---|---|
| **`mobile-responsive`** | Mobile-First Responsive Layouts | Fluid typography, CSS clamp(), viewport reflows, and touch-target standards. |
| **`dark-mode-tokens`** | Dark Mode Color Tokens | Semantic HSL color token system supporting effortless light/dark switching. |
| **`tailwind-system`** | Tailwind Design System Tokens | Curated Tailwind CSS design system with strict anti-slop color palettes. |

---

## Technical Lead (`tech-lead` - Garry)

| Skill Slug | Name | Description |
|---|---|---|
| **`security-audit`** | Security & Vulnerability Audit | OWASP top 10 auditing, sanitization guards, and secret leak prevention. |
| **`database-migration`** | Defensive Database Migrations | Zero-downtime schema migrations, backward compatibility, and rollback plans. |
| **`adr-architecture`** | Architectural Decision Records (ADR) | Structured ADR documentation for major library, database, and system choices. |

---

## QA Engineer (`qa` - Stanley)

| Skill Slug | Name | Description |
|---|---|---|
| **`load-stress-testing`** | Load & Stress Testing | Concurrency benchmarking, rate limit threshold checks, and failure recovery. |
| **`e2e-playwright`** | E2E Playwright Automation | Headless browser end-to-end integration tests for critical user journeys. |

---

## Product Owner (`product-owner` - Patrick)

| Skill Slug | Name | Description |
|---|---|---|
| **`analytics-metrics`** | Product Analytics & Funnel Tracking | Event schema definition, conversion funnels, and retention KPI tracking. |
| **`competitor-teardown`** | Competitor Teardown Analysis | Market feature gap analysis and differentiation matrix. |

---

## Project Manager (`project-manager` - Sandy Cheeks)

| Skill Slug | Name | Description |
|---|---|---|
| **`sprint-retrospective`** | Sprint Retrospective & Velocity | Task completion velocity analysis, bottlenecks review, and action plans. |
| **`incident-postmortem`** | Incident Postmortem & RCA | Blameless Root Cause Analysis (RCA) and preventive action items. |

---

## How to Add Skills to Your Workspace

### Option 1: Via Interactive CLI
```bash
# Run interactive skill picker
npx employee-agents add-skill

# Or install directly by role and skill slug:
npx employee-agents add-skill developer docker-containerization
```

### Option 2: Via AI Assistant Chat
Type:
```text
/add-skill
```
Garry and Sandy Cheeks will display the available options and install the skill file directly into your `/.myemployee/roles/<role>/skill/` directory!

---

## Contributing New Skills
Want to contribute a new skill to the community? Submit a Pull Request adding your skill file to `additional-skills/<role>/<skill-slug>.md` and updating `additional-skills/catalog.json`!
