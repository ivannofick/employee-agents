# Token Footprint & Efficiency Architecture

> **Disclaimer**: All values presented in this document are **approximate ranges and realistic estimates**, not fixed constants. Actual token consumption will vary depending on the tokenizer used by your AI model (e.g., Google Gemini, Anthropic Claude, OpenAI GPT), the length of your prompts, and your project's codebase complexity.

---

## Overview

Monolithic multi-agent frameworks often suffer from severe **context bloat**—stuffing entire project histories, redundant guidelines, and massive monolithic prompts into every request turn.

`employee-agents` solves this with a **lean, gated, modular architecture**:
1. Base skills are ultra-compact (`role.md` + `default-skill.md`).
2. Heavy capabilities (Docker, WebSockets, etc.) are installed only on-demand.
3. Completed tasks (`tasks/done/`) are strictly isolated from active context.

---

## Estimated Token Footprint by Task & Phase

The table below outlines the **estimated range** of tokens loaded into context depending on the action being performed:

| Operational Scenario | Active Personas / Artifacts | Estimated Context Range | Efficiency Rationale |
|---|---|---|---|
| **Quick Component or Bugfix**<br>*(e.g., Building a Button component or fixing a modal state)* | • Tn. Crab (Developer)<br>• Stanley (QA)<br>• 1 active task ticket | **~500 – 1,200 tokens** | Only the developer and QA personas are loaded. All other personas (PO, UI/UX, Tech Lead) remain dormant with **0 tokens** consumed. |
| **Urgent Bug Pipeline**<br>*(Targeted line fix)* | • Tn. Crab (Developer)<br>• 1 targeted bug ticket | **~400 – 900 tokens** | Bypasses the Master PRD entirely and targets only the specified file and line range. |
| **Phase 1: Feature Spec & Thinking**<br>*(`/share-knowledge`)* | • Larry (Tech Analyst)<br>• Patrick (Product Owner)<br>• Squidward (UI/UX)<br>• Garry (Tech Lead) | **~2,500 – 4,000 tokens** | Generates feature PRD, design tokens, state matrix, and architecture without loading execution/coding skills. |
| **Phase 2: Feature Execution**<br>*(`/apply-work`)* | • Tn. Crab (Developer)<br>• Stanley (QA)<br>• Active feature task | **~900 – 2,000 tokens** | Implements code surgically and verifies Visual Acceptance Criteria (VAC) without re-reading brainstorming notes. |
| **All 7 Roles Combined (Static Base)**<br>*(Theoretical worst-case: loading all personas)* | • All 7 squad role files<br>• All 7 `default-skill.md` files | **~4,500 – 5,500 tokens** | Complete instructions for the entire 7-person engineering team consume **< 0.6%** of a 1M token window. |
| **Controller Adapter**<br>*(`.agent/skills/myemployee/SKILL.md`)* | • Turn-taking rules<br>• Kanban boundaries<br>• Founder sovereignty | **~1,500 – 2,000 tokens** | Injected once into system skill context. |

---

## Realistic Comparison: Monolithic Frameworks vs. employee-agents

| Scenario | Monolithic Multi-Agent Setup | employee-agents (Gated & Modular) | Typical Context Savings |
|---|---|---|---|
| **Creating a Single Component** *(Button, Input)* | Often loads full project tree and monolithic agent prompts (tens of thousands of tokens) | **~500 – 1,200 tokens** *(Surgical task targeting)* | **~85% – 95% reduction** |
| **Hotfixing a Bug** | Scans large PRDs and long conversation histories | **~400 – 900 tokens** *(Bypasses Master PRD)* | **~80% – 90% reduction** |
| **Full Team Specification** | Unstructured, sprawling system prompts | **~4,500 – 5,500 tokens** *(All 7 modular roles)* | **Structured, predictable & lean** |

---

## Core Architectural Drivers of Token Efficiency

### 1. Lazy Persona Invocation
Personas are not all active simultaneously. The framework's turn-taking coordinator only activates the specific role needed for the current workflow phase. If you are asking Tn. Crab to style a button, Squidward, Garry, and Patrick consume **zero active context tokens**.

### 2. Kanban Subdirectory Isolation
```text
.myemployee/tasks/
├── pending/ <-- AI reads only this backlog (~150 - 300 tokens per ticket)
├── in-progress/ <-- AI reads ONLY the active ticket (~200 tokens)
├── paused/ <-- Ignored during regular work
└── done/ <-- Completely isolated; NEVER scanned during daily coding
```
Whether your project has completed 5 tasks or 500 tasks, archived tickets in `tasks/done/` will **never pollute your active context window**.

### 3. Living Master PRD Summarization
Instead of feeding 15 separate feature PRDs into the AI context (which can easily swallow 30,000+ tokens), `/.myemployee/PRD.md` maintains a compact **Feature Index table** with 1–2 sentence summaries per feature. Full individual specs in `features/<slug>/` are only referenced when actively working on that specific feature.
